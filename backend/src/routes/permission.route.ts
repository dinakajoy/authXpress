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
import { isAuthenticated, isAuthorized } from "../middlewares";

const router = express.Router();

router.post(
  "/",
  isAuthorized(["Admin"]),
  createPermissionValidation(),
  validate,
  createPermissionController
);

router.get("/", isAuthenticated, getPermissionsController);

router.get("/:id", isAuthenticated, getPermissionController);

router.put(
  "/:id",
  isAuthorized(["Admin"]),
  createPermissionValidation(),
  validate,
  updatePermissionController
);

router.delete("/:id", isAuthorized(["Admin"]), deletePermissionController);

export default router;
