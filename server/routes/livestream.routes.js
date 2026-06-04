import { Router } from "express";
import {
  setLivestream,
  getActiveLivestreamController,
  deactivateLivestream,
} from "../controllers/livestream.controller.js";
import { isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// Public
router.get("/active", getActiveLivestreamController);

// Admin
router.post("/", isAdmin, setLivestream);
router.patch("/:id/deactivate", isAdmin, deactivateLivestream);

export default router;
