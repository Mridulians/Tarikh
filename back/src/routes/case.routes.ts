import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { createCase, getCaseActivity, getCaseDetails } from "../controllers/case.controller";
import { getCases } from "../controllers/case.controller";
import { getCaseById } from "../controllers/case.controller";
import { updateCase } from "../controllers/case.controller";
import { deleteCase } from "../controllers/case.controller";
import { assignClerk } from "../controllers/case.controller";
import { getMyCases } from "../controllers/case.controller";

const router = Router();

router.post("/create-case", authMiddleware, requireRole(["LAWYER"]), createCase);

router.get("/getall-cases", authMiddleware, getCases); // role-based access control can be implemented in this controller

router.get("/my-cases", authMiddleware, getMyCases);

router.get("/:id", authMiddleware, getCaseById);


router.put("/:id", authMiddleware, updateCase);

router.delete("/:id", authMiddleware, deleteCase);

router.patch("/:id/assign", authMiddleware, assignClerk);

router.get("/:id/activity", authMiddleware, getCaseActivity);

router.get("/:id/details", authMiddleware, getCaseDetails);

export default router;
