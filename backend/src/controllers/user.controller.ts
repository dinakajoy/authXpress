import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";

export const getUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find({}).populate("role");

    res.status(200).json({ status: "success", users });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const role = await User.findById({ id }).populate("role");

    res.status(200).json({ status: "success", role });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const updateUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { name, email, role } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { name, email, role },
      { new: true }
    );

    res.status(200).json({ status: "success", user });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    await User.findByIdAndDelete(id);

    res.status(200).json({ status: "success" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
