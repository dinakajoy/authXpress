import express, { Express, Request, Response, NextFunction } from "express";
import createError from "http-errors";
import compression from "compression";
import cors from "cors";
import authRoutes from "./routes/auth.route";
import userRoleRoute from "./routes/userRole.route";
import permissionRoute from "./routes/permission.route";
import userRoute from "./routes/user.route";
import { acountLimiter } from "./middlewares";
import { corsOptions } from "./utils";

const app: Express = express();

// Middleware
app.use(
  acountLimiter,
  cors<Request>(corsOptions),
  compression(),
  express.json(),
  express.urlencoded({ extended: false })
);

// Routes
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send({ message: "Welcome 🐻" });
});

app.get("/healthcheck", (req: Request, res: Response) => {
  res.sendStatus(200);
});

app.use("/auth", authRoutes);
app.use('/permissions', permissionRoute);
app.use('/user-role', userRoleRoute);
app.use('/users', userRoute);

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
