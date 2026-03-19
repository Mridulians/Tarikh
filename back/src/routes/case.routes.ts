import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { createCase } from "../controllers/case.controller";

const router = Router();

router.post(
  "/",
  authMiddleware,
  requireRole(["LAWYER"]),
  createCase
);

export default router;