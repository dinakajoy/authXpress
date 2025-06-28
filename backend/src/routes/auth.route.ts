import { Router } from "express";
import {
  register,
  login,
  forgotPasswordController,
  resetPasswordController,
  refreshTokenController,
  logoutController,
  getCurrentUserController,
} from "../controllers/auth.controller";
import {
  forgetPasswordValidation,
  loginValidation,
  resetPasswordValidation,
  signupValidation,
  validate,
} from "../validations/auth.validation";
import { routeLimiter, isAuthenticated } from "../middlewares";

const router = Router();

router.post("/register", routeLimiter, signupValidation(), validate, register);

router.post("/login", routeLimiter, loginValidation(), validate, login);

// Forgot Password route
router.post(
  "/forgot-password",
  routeLimiter,
  forgetPasswordValidation(),
  validate,
  forgotPasswordController
);

// Reset Password route
router.put(
  "/reset-password",
  routeLimiter,
  resetPasswordValidation(),
  validate,
  resetPasswordController
);

router.get(
  "/current-user",
  routeLimiter,
  isAuthenticated,
  getCurrentUserController
);

// Refresh Token routelpll
router.get("/refresh-token", routeLimiter, refreshTokenController);

// Logout route
router.get("/logout/:id", logoutController);

export default router;
