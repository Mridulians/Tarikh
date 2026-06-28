import express from "express";
import { getClerks, getLawyers } from "../controllers/user.controller";
import {authMiddleware} from "../middleware/auth.middleware";

const router = express.Router();

// 🔐 Only authenticated users can fetch clerks
router.get("/clerks", authMiddleware, getClerks);
router.get("/lawyers", authMiddleware, getLawyers)

export default router;