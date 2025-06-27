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
import { acountLimiter, isAuthenticated } from "../middlewares";

const router = Router();

router.post("/register", signupValidation(), validate, register);

router.post("/login", loginValidation(), validate, login);

// Forgot Password route
router.post(
  "/forgot-password",
  acountLimiter,
  forgetPasswordValidation(),
  validate,
  forgotPasswordController
);

// Reset Password route
router.put(
  "/reset-password",
  resetPasswordValidation(),
  validate,
  resetPasswordController
);

router.get("/current-user", isAuthenticated, getCurrentUserController);

// Refresh Token routelpll
router.get("/refresh-token", refreshTokenController);

// Logout route
router.get("/logout/:id", logoutController);

export default router;
