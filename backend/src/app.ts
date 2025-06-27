import express, { Express, Request, Response, NextFunction } from "express";
import createError from "http-errors";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import config from "config";
import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
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
passport.initialize();
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
    const user = req.user as any;
    // const user = req.user as IUser | null;
    if (!user) {
      console.error("Error in GoogleStrategy =========");
      res.send(`<script>window.close();</script>`);
      return;
    }

    const html = `
        <script>
        if (window.opener) {
          window.opener.postMessage({ token: "${user.token}" }, "${config.get(
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
