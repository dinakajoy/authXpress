import rateLimit from "express-rate-limit";
import { Request, Response, NextFunction } from "express";

const accountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response, next: NextFunction, options) => {
    res.status(options.statusCode).json({
      success: false,
      message: "Too many access attempts from this IP, please try again after an hour",
    });
  },
});

export default accountLimiter;

