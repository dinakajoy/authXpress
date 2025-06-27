import { NextFunction, Request, Response } from "express";
import config from "config";
import crypto from "crypto";
import UserModel from "../models/user.model";
import {
  createUser,
  findUserByEmail,
  findUserById,
  isUser,
  updatePassword,
  updateUser,
  validateUser,
} from "../services/user.service";
import {
  AlreadyExistingUserException,
  CustomException,
  ServerErrorException,
  WrongCredentialsException,
} from "../utils/errors";
import transporter from "../utils/emailSender";
import {
  signAccessToken,
  signPasswordAccessToken,
  verifyAccessToken,
} from "../utils/jwtUtils";
import { ICreateToken } from "../interfaces/token.interface";
import { logger } from "../utils";
import { IUser } from "../interfaces/user.interfaces";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await findUserByEmail(email, next);
    if (existingUser) {
      return next(new (AlreadyExistingUserException as any)());
    }

    // Create new user
    await createUser({ name, email, password }, next);
    res.status(201).json({ message: "User registered successfully" });
    return;
  } catch (error: any) {
    logger.error(`Register Controller Error: ${error.message}`);
    return next(new (CustomException as any)(400, error.message));
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const userIsValid = await validateUser(email, password, next);

    if (!userIsValid) {
      return next(new (WrongCredentialsException as any)());
    }

    const user = await findUserByEmail(email, next);
    if (!user) {
      return next(new (WrongCredentialsException as any)());
    }
    const accessTokenData: ICreateToken = {
      email: user.email,
      isRefreshToken: false,
    };
    const refreshTokenData: ICreateToken = {
      email: user.email,
      isRefreshToken: true,
    };

    const accessToken = (await signAccessToken(accessTokenData, next)) || "";
    const refreshToken = (await signAccessToken(refreshTokenData, next)) || "";

    await updateUser(user._id as string, { token: refreshToken }, next);
    res.status(200).json({
      status: "success",
      payload: { ...user, token: accessToken },
    });
  } catch (error: any) {
    logger.error(`Login Controller Error: ${error.message}`);
    return next(new (ServerErrorException as any)());
  }
};

export const forgotPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  const user = await findUserByEmail(email, next);
  if (!user) {
    // This is returned like this to prevent hackers from confirming unregistered emails
    return next(
      res.status(200).json({
        status: "success",
        message: "Please check your mail",
      })
    );
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  await UserModel.findByIdAndUpdate(
    user._id,
    {
      resetToken: hashedToken,
      resetTokenExpiry: new Date(Date.now() + 15 * 60 * 1000), // 15 mins expiry
    },
    { new: true }
  );

  const clientUrl = config.get("environment.clientUrl") as string;
  const resetLink = `${clientUrl}/reset-password?token=${hashedToken}`;

  try {
    const mailSent = await transporter.sendMail({
      to: email,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password. This link is valid for 1 hour.</p> Or copy link: ${resetLink}`,
    });

    if (mailSent.messageId) {
      res.status(200).json({ message: "Password reset email sent." });
    } else {
      res.status(500).json({ message: "Not successful, try again!" });
    }
    return;
  } catch (error: any) {
    logger.error(
      `forgotPasswordController AuthController Error: ${error.message}`
    );
    return next(
      new (CustomException as any)("Failed to send password reset email.")
    );
  }
};

export const resetPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token, password } = req.body;

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await UserModel.findOne({
      resetToken: hashedToken,
      resetTokenExpiry: {
        gte: new Date(), // Ensure the token hasn't expired
      },
    });
    if (!user) {
      return next(
        new (CustomException as any)(
          400,
          "The reset password link is invalid or has expired."
        )
      );
    }

    await updatePassword(user.email, password, next);
    res.status(200).json({
      status: "success",
      message: "Password updated successfully",
    });
    return;
  } catch (error: any) {
    logger.error(
      `resetPasswordController AuthController Error: ${error.message}`
    );
    if (error.name === "TokenExpiredError") {
      return next(new (CustomException as any)("Expired token."));
    }
    return next(new (CustomException as any)("Invalid token."));
  }
};

export const getCurrentUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const currentUserEmail = req.body.email;

  const user = await findUserByEmail(currentUserEmail, () => {});
  if (!user) {
    res.status(401).json({ message: "User not authenticated" });
    return;
  }
  res.status(201).json(user);
  return;
};

export const refreshTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const user = await findUserById(id, next);
    if (user) {
      const tokenIsValid = await verifyAccessToken(
        { token: user.token, isRefreshToken: true },
        next
      );
      if (tokenIsValid) {
        const accessToken = await signAccessToken(
          { email: user.email, isRefreshToken: false },
          next
        );
        res.status(200).json({
          status: "success",
          payload: { ...user, token: accessToken },
        });
        return;
      }
    }
  } catch (error: any) {
    logger.error(`refreshToken Controller Error: ${error.message}`);
    return next(new (CustomException as any)(500, "Operation unsuccessful"));
  }
};

export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const updatedUser = await updateUser(id, { token: "" }, next);

    if (updatedUser) {
      res.status(200).json({ message: "Logged out successfully" });
      return;
    }
  } catch (error: any) {
    logger.error(`updatePassword UserService Error: ${error.message}`);
    return next(new (CustomException as any)(500, "Operation unsuccessful"));
  }
};
