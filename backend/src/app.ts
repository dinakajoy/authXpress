import express, { Express, Request, Response, NextFunction } from "express";
import createError from "http-errors";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import config from "config";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import authRoutes from "./routes/auth.route";
import userRoleRoute from "./routes/userRole.route";
import permissionRoute from "./routes/permission.route";
import userRoute from "./routes/user.route";
import { acountLimiter } from "./middlewares";
import {
  findUserByEmail,
  createUser,
  updateUser,
} from "./services/user.service";
import { corsOptions } from "./utils";
import { signAccessToken } from "./utils/jwtUtils";
import UserModel from "./models/user.model";
import { IUser } from "./interfaces/user.interfaces";

const clientID = config.get("googleConfig.clientID") as string;
const clientSecret = config.get("googleConfig.clientSecret") as string;
const callbackURL = config.get("googleConfig.callbackURL") as string;

const app: Express = express();

// Middleware
app.use(
  acountLimiter,
  helmet(),
  compression(),
  cors<Request>(corsOptions),
  express.json(),
  express.urlencoded({ extended: false })
);

// Google login
app.use(
  session({
    secret: config.get("environment.secret"),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    },
  })
);
passport.initialize();
app.use(passport.session());
passport.use(
  new GoogleStrategy(
    {
      clientID,
      clientSecret,
      callbackURL,
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done: (error: any, user?: any) => void
    ) => {
      try {
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName;

        if (!email) return done(new Error("No email provided"));

        let user = await findUserByEmail(email, () => {});

        if (!user) {
          user = await createUser({ name, email, password: "" }, () => {});
        }
        const accessTokenData = {
          email: user?.email || "",
          isRefreshToken: false,
        };
        const refreshTokenData = {
          email: user?.email || "",
          isRefreshToken: true,
        };

        const accessToken =
          (await signAccessToken(accessTokenData, () => {})) || "";
        const refreshToken =
          (await signAccessToken(refreshTokenData, () => {})) || "";
        await updateUser(
          user?._id as string,
          { token: refreshToken },
          () => {}
        );
        return done(null, { ...user, token: accessToken });
      } catch (err) {
        console.error("Error in GoogleStrategy:", err);
        return done(err);
      }
    }
  )
);
passport.serializeUser((user: any, done) => {
  return done(null, user._id.toString());
});
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await UserModel.findById(id).exec();
    if (!user) return done(null, false);
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});
// app.get(
//   "/auth/google/popup",
//   passport.authenticate("google", {
//     scope: ["profile", "email"],
//     session: false,
//   })
// );
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${config.get("environment.clientUrl")}`,
  }),
  (req, res) => {
    res.redirect(`${config.get("environment.clientUrl")}/dashboard`);
  }
);
// app.get(
//   "/auth/google/callback",
//   passport.authenticate("google", { session: false }),
//   (req, res) => {
//     const user = req.user as any;
//     // const user = req.user as IUser | null;
//     if (!user) {
//       console.error("Error in GoogleStrategy =========");
//       res.send(`<script>window.close();</script>`);
//       return;
//     }

//     const html = `
//         <script>
//         if (window.opener) {
//           window.opener.postMessage({ token: "${user.token}" }, "${config.get(
//       "environment.clientUrl"
//     )}");
//           window.close();
//         } else {
//         console.log("No opener window found.");
//       }
//       </script>
//     `;

//     res.send(html);
//     return;
//   }
// );

// MFA
app.post("/2fa/setup", async (req, res) => {
  const { email } = req.body;

  const secret = speakeasy.generateSecret({
    name: `AuthXpress (${email})`,
  });

  // Save this secret.base32 to the user's profile in DB
  await UserModel.updateOne({ email }, { twoFASecret: secret.base32 });

  if (secret.otpauth_url) {
    const qr = await qrcode.toDataURL(secret.otpauth_url);

    res.json({ qr, secret: secret.base32 });
    return;
  }
  res.status(500).json({ error: "Failed to generate QR code" });
});
// app.post("/api/2fa/verify", async (req, res) => {
//   const { email, token } = req.body;

//   const user = await UserModel.findOne({ email });
//   if(!user) return;

//   const isValid = speakeasy.totp.verify({
//     secret: user.twoFASecret,
//     encoding: "base32",
//     token,
//     window: 1,
//   });

//   if (!isValid) {
//     res.status(401).json({ message: "Invalid 2FA token" });
//     return;
//   }

//   const accessTokenData = {
//     email: user?.email || "",
//     isRefreshToken: false,
//   };
//   const refreshTokenData = {
//     email: user?.email || "",
//     isRefreshToken: true,
//   };

//   const accessToken = (await signAccessToken(accessTokenData, () => {})) || "";
//   const refreshToken =
//     (await signAccessToken(refreshTokenData, () => {})) || "";
//   await updateUser(user?._id as string, { token: refreshToken }, () => {});
//   res.json({ token: accessToken });
//   return;
// });

// Routes
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send({ message: "Welcome 🐻" });
});

app.get("/healthcheck", (req: Request, res: Response) => {
  res.sendStatus(200);
});

app.use("/auth", authRoutes);
app.use("/permissions", permissionRoute);
app.use("/user-role", userRoleRoute);
app.use("/users", userRoute);

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new createError.NotFound());
});

// error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).json({
    status: "error",
    error: err.message || err.error,
  });
});

export default app;
