import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

export const signupValidation = () => [
  body("name").not().isEmpty().trim().escape(),
  body("email").isEmail().normalizeEmail(),
  body("password")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      "Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one special character."
    ),
];

export const loginValidation = () => [
  body("email").isEmail().normalizeEmail(),
  body("password").not().isEmpty().trim().escape(),
];

export const forgetPasswordValidation = () => [
  body("email").isEmail().normalizeEmail(),
];

export const resetPasswordValidation = () => [
  body("token").not().isEmpty().trim().escape(),
  body("password").isLength({ min: 5 }).isStrongPassword(),
];

export const userValidation = () => [
  body("name").not().isEmpty().trim().escape(),
  body("email").isEmail().normalizeEmail(),
  body("role").not().isEmpty().trim().escape(),
];

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors: any = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  res.status(422).json({
    status: "error",
    error: `Invalid value for ${errors.array()[0].path}`,
  });
  return;
};
