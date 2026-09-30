import rateLimit from "express-rate-limit";
import { env } from "../config/env.js";

/**
 * General rate limiter: 120 requests per 15 minutes per IP
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.GENERAL_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: {
        code: "RATE_LIMIT_EXCEEDED",
        message: "Too many requests from this IP address. Please try again after 15 minutes.",
        details: []
      }
    });
  }
});

/**
 * AI endpoint rate limiter: 20 requests per 10 minutes per authenticated user ID
 */
export const aiLimiter = rateLimit({
  windowMs: env.AI_RATE_LIMIT_WINDOW_MIN * 60 * 1000,
  max: env.AI_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.user?.id || req.ip;
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: {
        code: "AI_RATE_LIMIT_EXCEEDED",
        message: `AI rate limit reached (${env.AI_RATE_LIMIT_MAX} requests per ${env.AI_RATE_LIMIT_WINDOW_MIN} minutes). Please wait before generating again.`,
        details: []
      }
    });
  }
});
