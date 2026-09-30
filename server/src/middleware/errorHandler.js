import { AppError } from "../utils/AppError.js";
import { ZodError } from "zod";
import multer from "multer";

export function errorHandler(err, req, res, next) {
  // Handle AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details || [],
      },
    });
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request payload",
        details: err.errors.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        })),
      },
    });
  }

  // Handle Multer upload errors
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        success: false,
        error: {
          code: "FILE_TOO_LARGE",
          message: "Uploaded image exceeds the maximum 5 MB limit",
          details: [{ path: "image", message: "Maximum file size is 5 MB" }],
        },
      });
    }
    return res.status(400).json({
      success: false,
      error: {
        code: "UPLOAD_ERROR",
        message: err.message,
        details: [{ path: "image", message: err.message }],
      },
    });
  }

  // Handle JSON parse errors
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      error: {
        code: "INVALID_JSON",
        message: "Malformed JSON payload provided",
        details: [],
      },
    });
  }

  // Unexpected errors
  const isDev = process.env.NODE_ENV === "development";
  console.error("[Unhandled Error]", err);

  return res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: isDev ? err.message : "An unexpected server error occurred. Please try again later.",
      details: isDev && err.stack ? [err.stack] : [],
    },
  });
}
