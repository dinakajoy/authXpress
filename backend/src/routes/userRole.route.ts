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

const router = express.Router();

router.post(
  "/",
  rateLimiter,
  createUserRoleValidation(),
  validate,
  createUserRoleController
);

router.get("/", rateLimiter, getUserRolesController);

router.get("/:id", rateLimiter, getUserRoleController);

router.put(
  "/:id",
  rateLimiter,
  createUserRoleValidation(),
  validate,
  updateUserRoleController
);

router.delete("/:id", rateLimiter, deleteUserRoleController);

export default router;
