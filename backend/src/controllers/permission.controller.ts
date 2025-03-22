import { Request, Response, NextFunction } from "express";
import Permission from "../models/permission.model";

export const createPermissionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, group, description } = req.body;
    const permission = new Permission({ name, group, description });
    await permission.save();
    res.status(201).json(permission);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getPermissionsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const permissions = await Permission.find({});

    res.status(200).json({ status: "success", permissions });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getPermissionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const permission = await Permission.findById({ id }).populate(
      "permissions"
    );

    res.status(200).json({ status: "success", permission });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const updatePermissionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { name, group, description } = req.body;
  try {
    const permission = await Permission.findByIdAndUpdate(
      id,
      { name, group, description },
      { new: true }
    );

    res.status(200).json({ status: "success", permission });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deletePermissionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    await Permission.findByIdAndDelete(id);

    res.status(200).json({ status: "success" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
