import * as express from "express";
import {
  createPermissionValidation,
  validate,
} from "../validations/permission.validation";
import {
  createPermissionController,
  getPermissionsController,
  getPermissionController,
  updatePermissionController,
  deletePermissionController,
} from "../controllers/permission.controller";
import rateLimiter from "../utils/rate-limiter";

const router = express.Router();

router.post(
  "/",
  rateLimiter,
  createPermissionValidation(),
  validate,
  createPermissionController
);

router.get("/", rateLimiter, getPermissionsController);

router.get("/:id", rateLimiter, getPermissionController);

router.put(
  "/:id",
  rateLimiter,
  createPermissionValidation(),
  validate,
  updatePermissionController
);

router.delete("/:id", rateLimiter, deletePermissionController);

export default router;
