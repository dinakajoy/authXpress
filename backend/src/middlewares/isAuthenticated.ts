import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import { logger } from "../utils";
import { verifyAccessToken } from "../utils/jwtUtils";
import { isUser } from "../services/user.service";
import {
  WrongCredentialsException,
  UnauthorizedUserException,
  CustomException,
} from "../utils/errors";

const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
      const result = await isUser(userEmail);
      if (!result) {
        return next(new (WrongCredentialsException as any)());
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

export default isAuthenticated;
