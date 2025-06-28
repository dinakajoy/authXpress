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
  findUserById,
} from "./services/user.service";
import { corsOptions, logger } from "./utils";
import { signAccessToken } from "./utils/jwtUtils";
import UserModel from "./models/user.model";
import { IUser } from "./interfaces/user.interfaces";

const clientID = config.get("googleConfig.clientID") as string;
const clientSecret = config.get("googleConfig.clientSecret") as string;

const app: Express = express();

// Middleware
app.use(
  acountLimiter,
  // helmet(),
  compression(),
  cors<Request>(corsOptions),
  express.json(),
  express.urlencoded({ extended: false })
);

// Google login
passport.initialize();
passport.use(
  new GoogleStrategy(
    {
      clientID,
      clientSecret,
      callbackURL: "/auth/google/callback",
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
        logger.error("Error in GoogleStrategy:", err);
        return done(err);
      }
    }
  )
);
app.get(
  "/auth/google/popup",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const user = req.user as IUser | null;

    if (!user || !user.token) {
      res.json({ success: false, message: "User not found or token missing" });
      return;
    }

    const html = `
          <script>
        if (window.opener) {
          window.opener.postMessage({ user: "${user}" }, "${config.get(
      "environment.clientUrl"
    )}");
          window.close();
        } else {
        console.log("No opener window found.");
      }
      </script>
    `;

    res.send(html);
    return;
  }
);

// MFA
app.post("/2fa/setup", async (req, res) => {
  const { id } = req.body;

  const secret = speakeasy.generateSecret({
    name: `AuthXpress (${id})`,
  });

  let user = await findUserById(id, () => {});
  if (!user || !user.token) {
    res.json({ success: false, message: "User not found!" });
    return;
  }
  // Save this secret.base32 to the user's profile in DB
  await updateUser(
    user?._id as string,
    { twoFASecret: secret.base32 },
    () => {}
  );

  if (secret.otpauth_url) {
    const qr = await qrcode.toDataURL(secret.otpauth_url);

    res.json({ qr });
    return;
  }
  res.status(500).json({ error: "Failed to generate QR code" });
});
app.post("/2fa/verify", async (req, res) => {
  const { id, token } = req.body;
  const user = await findUserById(id, () => {});

  if (!user || !user.twoFASecret) {
    res.status(404).json({
      success: false,
      message: "User not found or 2FA secret missing",
    });
    return;
  }

  const currentCode = speakeasy.totp({
    secret: user.twoFASecret,
    encoding: "base32",
  });

  const isValid = speakeasy.totp.verify({
    secret: user.twoFASecret,
    encoding: "base32",
    token,
    window: 2,
  });

  if (!isValid) {
    res.status(401).json({ success: false, message: "Invalid token" });
    return;
  }

  // Mark user as 2FA-enabled in DB
  await updateUser(
    user?._id as string,
    { twoFAEnabled: true },
    () => {}
  );

  res.json({ success: true });
  return;
});
app.post("/2fa/disable", async (req, res) => {
  const { id } = req.body;
  const user = await findUserById(id, () => {});

  if (!user) {
    res.status(404).json({ success: false, message: "User not found" });
    return;
  }

  // Mark user as not 2FA-enabled in DB
  await updateUser(
    user?._id as string,
    { twoFAEnabled: false, twoFASecret: null },
    () => {}
  );

  res.json({ success: true, message: "2FA disabled" });
  return;
});

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
