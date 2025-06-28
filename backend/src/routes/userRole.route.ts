import * as express from "express";
import {
  createUserRoleValidation,
  validate,
} from "../validations/userRole.validation";
import {
  createUserRoleController,
  getUserRoleController,
  getUserRolesController,
  updateUserRoleController,
  deleteUserRoleController,
} from "../controllers/userRole.controller";
import rateLimiter from "../utils/rate-limiter";
import { isAuthenticated, isAuthorized } from "../middlewares";

const router = express.Router();

router.post(
  "/",
  rateLimiter,
  isAuthorized(["Admin"]),
  createUserRoleValidation(),
  validate,
  createUserRoleController
);

router.get("/", rateLimiter, isAuthenticated, getUserRolesController);

router.get("/:id", rateLimiter, isAuthenticated, getUserRoleController);

router.put(
  "/:id",
  rateLimiter,
  isAuthorized(["Admin"]),
  createUserRoleValidation(),
  validate,
  updateUserRoleController
);

router.delete(
  "/:id",
  rateLimiter,
  isAuthorized(["Admin"]),
  deleteUserRoleController
);

export default router;
