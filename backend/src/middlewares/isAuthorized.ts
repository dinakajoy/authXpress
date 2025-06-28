import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import { logger } from "../utils";
import { verifyAccessToken } from "../utils/jwtUtils";
import {
  WrongCredentialsException,
  UnauthorizedUserException,
  CustomException,
} from "../utils/errors";
import { IUserWithRole } from "../interfaces/user.interfaces";
import UserModel from "../models/user.model";

const isAuthorized =
  (allowedRoles: string[]) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    const tokenExist = req.headers["authorization"];
    if (!tokenExist) {
      return next(new (UnauthorizedUserException as any)());
    }
    try {
      const token = tokenExist.split(" ")[1];
      const decodedToken: JwtPayload | undefined = await verifyAccessToken({
        token,
        isRefreshToken: false,
      });

      if (decodedToken) {
        const userEmail = decodedToken.payload.email;
        const user = await UserModel.findOne({
          email: userEmail,
        }).populate("role") as IUserWithRole;
        if (!user || !user.role) {
          return next(new (WrongCredentialsException as any)());
        }

        const authorized = allowedRoles.includes(user.role?.label);
        if (!authorized) {
          return next(new (UnauthorizedUserException as any)());
        }

        req.body.email = userEmail;
        return next();
      } else {
        return next(new (UnauthorizedUserException as any)());
      }
    } catch (error: any) {
      logger.error(`isAuthenticated Middleware Error: ${error.message}`);
      return next(new (CustomException as any)(403, "Operation unsuccessful"));
    }
  };

export default isAuthorized;
