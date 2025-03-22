import * as express from "express";
import { userValidation, validate } from "../validations/auth.validation";
import {
  updateUserController,
  getUserController,
  getUsersController,
  deleteUserController,
} from "../controllers/user.controller";
import rateLimiter from "../utils/rate-limiter";

const router = express.Router();

router.get("/", rateLimiter, getUsersController);

router.get("/:id", rateLimiter, getUserController);

router.put(
  "/:id",
  rateLimiter,
  userValidation(),
  validate,
  updateUserController
);

router.delete("/:id", rateLimiter, deleteUserController);

export default router;
