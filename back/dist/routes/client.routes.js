"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_controller_1 = require("../controllers/client.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// router.post("/create-client", authMiddleware, requireRole(["LAWYER"]), createClient);
router.post("/", auth_middleware_1.authMiddleware, client_controller_1.createClient);
// ✅ GET ALL CLIENTS (ROLE BASED)
router.get("/", auth_middleware_1.authMiddleware, client_controller_1.getClients);
// ✅ GET SINGLE CLIENT BY ID
router.get("/:id", auth_middleware_1.authMiddleware, client_controller_1.getClientById);
// ✅ UPDATE CLIENT
router.put("/:id", auth_middleware_1.authMiddleware, client_controller_1.updateClient);
// ✅ DELETE CLIENT
router.delete("/:id", auth_middleware_1.authMiddleware, client_controller_1.deleteClient);
exports.default = router;
