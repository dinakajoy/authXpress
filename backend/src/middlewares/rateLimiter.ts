import rateLimit from "express-rate-limit";
import { Request, Response, NextFunction } from "express";

const routeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response, next: NextFunction, options) => {
    res.status(options.statusCode).json({
      success: false,
      message: "Too many access attempts from this device, please try again after 15 minutes",
    });
  },
});

export default routeLimiter;

