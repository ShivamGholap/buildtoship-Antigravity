import { Router } from "express";
import {
  listFarms,
  createFarm,
  getFarm,
  updateFarm,
  deleteFarm
} from "../controllers/farms.controller.js";
import { validate } from "../middleware/validate.js";
import { farmSchema } from "../validators/farm.js";
import { idParamSchema } from "../validators/common.js";

const router = Router();

router.get("/", listFarms);
router.post("/", validate(farmSchema), createFarm);
router.get("/:id", validate(idParamSchema, "params"), getFarm);
router.put("/:id", validate(idParamSchema, "params"), validate(farmSchema), updateFarm);
router.delete("/:id", validate(idParamSchema, "params"), deleteFarm);

export default router;
