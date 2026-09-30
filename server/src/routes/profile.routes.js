import { Router } from "express";
import { getProfile, updateProfile, deleteUserData } from "../controllers/profile.controller.js";
import { validate } from "../middleware/validate.js";
import { profileUpdateSchema } from "../validators/profile.js";

const router = Router();

router.get("/", getProfile);
router.put("/", validate(profileUpdateSchema), updateProfile);
router.delete("/data", deleteUserData);

export default router;
