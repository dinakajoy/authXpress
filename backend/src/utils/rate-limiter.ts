import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from "express";

const accountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // Limit each IP to 100 requests per `window` (here, per 1 hour)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req: Request, res: Response, next: NextFunction, options) => {
    res.status(options.statusCode).json({
      success: false,
      message: "Too many access attempts, please try again after 1 hour",
    });
  },
});

export default accountLimiter