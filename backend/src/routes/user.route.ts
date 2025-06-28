import * as express from "express";
import { userValidation, validate } from "../validations/auth.validation";
import {
  updateUserController,
  getUserController,
  getUsersController,
  deleteUserController,
} from "../controllers/user.controller";
import rateLimiter from "../utils/rate-limiter";
import { isAuthenticated, isAuthorized } from "../middlewares";

const router = express.Router();

router.get("/", rateLimiter, isAuthenticated, getUsersController);

router.get("/:id", rateLimiter, isAuthenticated, getUserController);

router.put(
  "/:id",
  rateLimiter,
  isAuthorized(["Admin", "Human Resources"]),
  userValidation(),
  validate,
  updateUserController
);

router.delete(
  "/:id",
  rateLimiter,
  isAuthorized(["Admin", "Human Resources"]),
  deleteUserController
);

export default router;
