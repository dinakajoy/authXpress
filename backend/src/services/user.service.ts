import { omit } from "lodash";
import { NextFunction } from "express";
import UserModel from "../models/user.model";
import { IUser } from "../interfaces/user.interfaces";
import { logger } from "../utils";
import {
  ServerErrorException,
  WrongCredentialsException,
} from "../utils/errors";
import { IUserRefreshToken } from "../interfaces/token.interface";

export const createUser = async (data: IUser, next: NextFunction) => {
  try {
    const user = await UserModel.create(data);
    return omit(user.toJSON(), "password");
  } catch (error: any) {
    logger.error(`createUser UserService Error: ${error.message}`);
    return next(new (ServerErrorException as any)());
  }
};

export const validateUser = async (
  email: string,
  password: string,
  next: NextFunction
) => {
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return false;
    }

    return await user.validatePassword(password);
  } catch (error: any) {
    logger.error(`validateUser UserService Error: ${error.message}`);
    return next(new (ServerErrorException as any)());
  }
};

export const isUser = async (email: string, next: NextFunction) => {
  try {
    const user = await UserModel.findOne({ email });
    return user !== null;
  } catch (error: any) {
    logger.error(`isUser UserService Error: ${error.message}`);
    return next(new (ServerErrorException as any)());
  }
};

export const findUserByEmail = async (email: string, next: NextFunction) => {
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return false;
    }
    return omit(user.toJSON(), "password");
  } catch (error: any) {
    logger.error(`findUserByEmail UserService Error: ${error.message}`);
    return next(new (ServerErrorException as any)());
  }
};

export const updatePassword = async (
  email: string,
  password: string,
  next: NextFunction
) => {
  try {
    const user = await findUserByEmail(email, next);
    if (user) {
      const hashedPassword = await user.hashPasswordd(password);
      const updatedUser = await UserModel.updateOne(
        { email: email },
        { password: hashedPassword }
      );
      if (updatedUser) {
        return true;
      }
    }
  } catch (error: any) {
    logger.error(`updatePassword UserService Error: ${error.message}`);
    return next(new (ServerErrorException as any)());
  }
};

export const findUsers = async (next: NextFunction) => {
  try {
    return await UserModel.find({});
  } catch (error: any) {
    logger.error(`findUsers UserService Error: ${error.message}`);
    return next(new (ServerErrorException as any)());
  }
};

export const findUserById = async (id: string, next: NextFunction) => {
  try {
    const user = await UserModel.findById(id);
    if (user) {
      return omit(user.toJSON(), "password");
    }
  } catch (error: any) {
    logger.error(`findUserById UserService Error: ${error.message}`);
    return next(new (ServerErrorException as any)());
  }
};

export const updateUser = async (
  id: string,
  data: IUser | IUserRefreshToken,
  next: NextFunction
) => {
  try {
    const user = await findUserById(id, next);
    if (user) {
      const updatedUser = await UserModel.updateOne(
        { _id: user._id },
        { ...data }
      );
      if (updatedUser) {
        return true;
      }
    }
  } catch (error: any) {
    logger.error(`updateUser UserService Error: ${error.message}`);
    return next(new (ServerErrorException as any)());
  }
};

export const deleteUser = async (id: string, next: NextFunction) => {
  try {
    const user = await findUserById(id, next);
    if (user) {
      const deletedUser = await UserModel.deleteOne({ _id: user._id });
      if (deletedUser) {
        return user;
      }
    }
  } catch (error: any) {
    logger.error(`deleteUser UserService Error: ${error.message}`);
    return next(new (ServerErrorException as any)());
  }
};
