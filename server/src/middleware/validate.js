import { AppError } from "../utils/AppError.js";

/**
 * Zod validation middleware factory for request body, query, or params
 */
export function validate(schema, source = "body") {
  return (req, res, next) => {
    const dataToValidate = req[source];
    const result = schema.safeParse(dataToValidate);

    if (!result.success) {
      const details = result.error.errors.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      }));

      return next(new AppError("Validation failed", 400, "VALIDATION_ERROR", details));
    }

    // Replace request data with parsed/coerced data
    req[source] = result.data;
    next();
  };
}
