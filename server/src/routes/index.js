import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { generalLimiter } from "../middleware/rateLimiters.js";

import profileRoutes from "./profile.routes.js";
import farmsRoutes from "./farms.routes.js";
import advisoriesRoutes from "./advisories.routes.js";
import metaRoutes from "./meta.routes.js";

const apiRouter = Router();

// Health check is mounted directly on app for /api/health (public)

// All subsequent /api routes require authentication under RLS and standard rate limiting
apiRouter.use(requireAuth);
apiRouter.use(generalLimiter);

apiRouter.use("/meta", metaRoutes);
apiRouter.use("/profile", profileRoutes);
apiRouter.use("/farms", farmsRoutes);
apiRouter.use("/advisories", advisoriesRoutes);

export default apiRouter;
