import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from "express";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req: Request, res: Response, next: NextFunction, options) => {
    res.status(options.statusCode).json({
      success: false,
      message: "Too many access attempts, please try again after 15 minutes",
    });
  },
});

export default limiter