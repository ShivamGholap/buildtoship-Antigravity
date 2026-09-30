import { Router } from "express";
import {
  generateCropRecommendation,
  generateDiseaseDiagnosis,
  generateFertilizerPlan,
  generateIrrigationPlan,
  generateSeasonalCalendar,
  listAdvisories,
  getAdvisoryDetail,
  deleteAdvisory,
  upsertFeedback
} from "../controllers/advisories.controller.js";
import { listMessages, postMessage } from "../controllers/messages.controller.js";
import { validate } from "../middleware/validate.js";
import { aiLimiter } from "../middleware/rateLimiters.js";
import { enforceDailyQuota } from "../middleware/dailyQuota.js";
import { uploadImageSingle, verifyImageMagicBytes } from "../middleware/upload.js";
import { idParamSchema } from "../validators/common.js";
import {
  cropRecommendationInputSchema,
  diseaseDiagnosisInputSchema,
  fertilizerPlanInputSchema,
  irrigationPlanInputSchema,
  seasonalCalendarInputSchema,
  listAdvisoriesQuerySchema,
  chatMessageSchema,
  feedbackSchema
} from "../validators/advisoryInputs.js";

const router = Router();

// Advisory Generation Endpoints (AI rate limited & daily quota checked)
router.post(
  "/crop-recommendation",
  aiLimiter,
  enforceDailyQuota,
  validate(cropRecommendationInputSchema),
  generateCropRecommendation
);

router.post(
  "/disease-diagnosis",
  aiLimiter,
  enforceDailyQuota,
  uploadImageSingle,
  verifyImageMagicBytes,
  validate(diseaseDiagnosisInputSchema),
  generateDiseaseDiagnosis
);

router.post(
  "/fertilizer-plan",
  aiLimiter,
  enforceDailyQuota,
  validate(fertilizerPlanInputSchema),
  generateFertilizerPlan
);

router.post(
  "/irrigation-plan",
  aiLimiter,
  enforceDailyQuota,
  validate(irrigationPlanInputSchema),
  generateIrrigationPlan
);

router.post(
  "/seasonal-calendar",
  aiLimiter,
  enforceDailyQuota,
  validate(seasonalCalendarInputSchema),
  generateSeasonalCalendar
);

// Listing & Management
router.get("/", validate(listAdvisoriesQuerySchema, "query"), listAdvisories);
router.get("/:id", validate(idParamSchema, "params"), getAdvisoryDetail);
router.delete("/:id", validate(idParamSchema, "params"), deleteAdvisory);

// Follow-up Chat on an Advisory
router.get("/:id/messages", validate(idParamSchema, "params"), listMessages);
router.post(
  "/:id/messages",
  aiLimiter,
  enforceDailyQuota,
  validate(idParamSchema, "params"),
  validate(chatMessageSchema),
  postMessage
);

// Feedback
router.put(
  "/:id/feedback",
  validate(idParamSchema, "params"),
  validate(feedbackSchema),
  upsertFeedback
);

export default router;
