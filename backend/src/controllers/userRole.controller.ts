import { Request, Response, NextFunction } from "express";
import UserRole from "../models/userRole.model";

export const createUserRoleController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { label, description, permission } = req.body;
    const userRole = new UserRole({ label, description, permission });
    await userRole.save();
    res.status(201).json(userRole);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getUserRolesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userRoles = await UserRole.find({}).populate("permission").lean();

    res.status(200).json({ status: "success", userRoles });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getUserRoleController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const role = await UserRole.findById({ id }).populate("permission").lean();

    res.status(200).json({ status: "success", role });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const updateUserRoleController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { label, description, permission } = req.body;
  try {
    const role = await UserRole.findByIdAndUpdate(
      id,
      { label, description, permission },
      { new: true }
    );

    res.status(200).json({ status: "success", role });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteUserRoleController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    await UserRole.findByIdAndDelete(id);

    res.status(200).json({ status: "success" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
