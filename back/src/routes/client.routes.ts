import { Router} from "express";

import { createClient, deleteClient, getClientById, getClients, updateClient } from "../controllers/client.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";

const router = Router();

// router.post("/create-client", authMiddleware, requireRole(["LAWYER"]), createClient);
router.post("/", authMiddleware, createClient);


// ✅ GET ALL CLIENTS (ROLE BASED)
router.get("/", authMiddleware, getClients);


// ✅ GET SINGLE CLIENT BY ID
router.get("/:id", authMiddleware, getClientById);


// ✅ UPDATE CLIENT
router.put("/:id", authMiddleware, updateClient);


// ✅ DELETE CLIENT
router.delete("/:id", authMiddleware, deleteClient);

export default router;

