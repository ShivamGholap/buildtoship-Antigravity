import multer from "multer";
import { AppError } from "../utils/AppError.js";
import { sniffImageMimeType } from "../utils/imageSniff.js";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname !== "image") {
      return cb(new AppError("Only 'image' field is accepted for file uploads", 400, "INVALID_FIELD"));
    }
    const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedMimes.includes(file.mimetype.toLowerCase())) {
      return cb(new AppError("Unsupported file type. Only JPEG, PNG, and WebP are allowed", 415, "UNSUPPORTED_MEDIA_TYPE"));
    }
    cb(null, true);
  },
});

export const uploadImageSingle = upload.single("image");

/**
 * Middleware that executes after multer to verify genuine magic bytes of the in-memory buffer
 */
export function verifyImageMagicBytes(req, res, next) {
  if (!req.file) {
    return next();
  }

  const verifiedMime = sniffImageMimeType(req.file.buffer);
  if (!verifiedMime) {
    return next(new AppError("Corrupted or invalid image file. Magic bytes do not match JPEG, PNG, or WebP", 415, "UNSUPPORTED_MEDIA_TYPE", [
      { path: "image", message: "File contents do not match genuine image signatures" }
    ]));
  }

  req.file.verifiedMimeType = verifiedMime;
  next();
}
