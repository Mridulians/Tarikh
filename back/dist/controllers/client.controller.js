"use strict";
// controllers/client.controller.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteClient = exports.updateClient = exports.getClientById = exports.getClients = exports.createClient = void 0;
// import { AuthRequest } from "../middleware/auth.middleware";
const client_1 = __importDefault(require("../prisma/client"));
const client_validation_1 = require("../validations/client.validation");
// export const createClient = async (req: Request, res: Response) => {
//   try {
//     const { name, phone, email, preferredMode,type, reminderBefore } = req.body;
//     if (!name || !phone) {
//       return res.status(400).json({ message: "Name and phone required" });
//     }
//     const client = await prisma.client.create({
//       data: {
//         name,
//         phone,
//         email,
//         preferredMode,
//         type,
//         reminderBefore,
//       },
//     });
//     res.status(201).json(client);
//   } catch (error) {
//     const errorMessage =
//       error instanceof Error ? error.message : "Unknown error";
//     res.status(500).json({ error: errorMessage });
//   }
// };
// export const getClients = async (req: Request, res: Response) => {
//   try {
//     const clients = await prisma.client.findMany({
//       orderBy: { createdAt: "desc" },
//     });
//     res.json(clients);
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// };
// CREATE CLIENT - WITH AUTH
// export const createClient = async (req: AuthRequest, res: Response) => {
//   try {
//     if (!req.user) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }
//     const { name, email, phone, preferredMode, reminderBefore } = req.body;
//     if (!name || !phone) {
//       return res.status(400).json({ message: "Name & Phone required" });
//     }
//     const client = await prisma.client.create({
//       data: {
//         name,
//         email,
//         phone,
//         preferredMode,
//         reminderBefore,
//         createdById: Number(req.user.userId), // 🔥 KEY LINE
//       },
//     });
//     return res.status(201).json(client);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };
// export const createClient = async (req: AuthRequest, res: Response) => {
//   try {
//     // ✅ AUTH CHECK
//     if (!req.user) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }
//     // 🔐 ROLE CHECK (IMPORTANT)
//     if (req.user.role === "CLERK") {
//       return res.status(403).json({
//         message: "Clerks are not allowed to create clients",
//       });
//     }
//     const { name, email, phone, preferredMode, reminderBefore } = req.body;
//     // ✅ VALIDATION
//     if (!name || !phone) {
//       return res.status(400).json({
//         message: "Name & Phone required",
//       });
//     }
//     // ✅ CREATE CLIENT
//     const client = await prisma.client.create({
//       data: {
//         name,
//         email,
//         phone,
//         preferredMode,
//         reminderBefore,
//         createdById: Number(req.user.userId),
//       },
//     });
//     return res.status(201).json({
//       success: true,
//       client,
//     });
//   } catch (error) {
//     console.error("Create Client Error:", error);
//     return res.status(500).json({
//       message: "Server error",
//     });
//   }
// };
// export const createClient = async (req: AuthRequest, res: Response) => {
//   try {
//     // ✅ AUTH CHECK
//     if (!req.user) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }
//     // 🔐 ROLE CHECK
//     if (req.user.role === "CLERK") {
//       return res.status(403).json({
//         message: "Clerks are not allowed to create clients",
//       });
//     }
//     // ✅ ZOD VALIDATION
//     const parsed = createClientSchema.parse(req.body);
//     const { name, email, phone, preferredMode, reminderBefore } = parsed;
//     // ✅ OPTIONAL: prevent duplicate client by phone
//     const existing = await prisma.client.findFirst({
//       where: { phone },
//     });
//     if (existing) {
//       return res.status(400).json({
//         message: "Client with this phone already exists",
//       });
//     }
//     // ✅ CREATE CLIENT
//     const client = await prisma.client.create({
//       data: {
//         name,
//         email: email || null,
//         phone,
//         preferredMode,
//         reminderBefore,
//         createdById: Number(req.user.userId),
//       },
//     });
//     return res.status(201).json({
//       success: true,
//       client,
//     });
//   } catch (error: any) {
//     // ✅ ZOD ERROR HANDLING
//     if (error.name === "ZodError") {
//       return res.status(400).json({
//         message: "Validation failed",
//         errors: error.errors,
//       });
//     }
//     console.error("Create Client Error:", error);
//     return res.status(500).json({
//       message: "Server error",
//     });
//   }
// };
const createClient = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (req.user.role === "CLERK") {
            return res.status(403).json({
                message: "Clerks are not allowed to create clients",
            });
        }
        const parsed = client_validation_1.createClientSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                // message: "Validation failed",
                message: parsed.error.issues[0].message, // send first error message
                errors: parsed.error.flatten(),
            });
        }
        const { name, email, phone, preferredMode, reminderBefore } = parsed.data;
        const client = await client_1.default.client.create({
            data: {
                name,
                email,
                phone,
                preferredMode: preferredMode,
                reminderBefore,
                createdById: Number(req.user.userId),
            },
        });
        return res.status(201).json({
            success: true,
            client,
        });
    }
    catch (error) {
        console.error("Create Client Error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.createClient = createClient;
// GET CLIENTS (ROLE-BASED — FIXED)
const getClients = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const userId = Number(req.user.userId);
        const role = req.user.role;
        let clients;
        if (role === "ADMIN") {
            // ✅ Admin sees all
            clients = await client_1.default.client.findMany({
                orderBy: { createdAt: "desc" },
            });
        }
        else if (role === "LAWYER") {
            // ✅ Lawyer sees ONLY their clients
            clients = await client_1.default.client.findMany({
                where: { createdById: userId },
                orderBy: { createdAt: "desc" },
            });
        }
        else {
            return res.status(403).json({
                message: "Clerks cannot access clients",
            });
        }
        return res.json({ success: true, clients });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.getClients = getClients;
// GET CLIENT BY ID
// export const getClientById = async (req: AuthRequest, res: Response) => {
//   try {
//     const clientId = Number(req.params.id);
//     if (isNaN(clientId)) {
//       return res.status(400).json({ message: "Invalid ID" });
//     }
//     if (!req.user) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }
//     const client = await prisma.client.findUnique({
//       where: { id: clientId },
//     });
//     if (!client) {
//       return res.status(404).json({ message: "Client not found" });
//     }
//     // 🔐 ACCESS CONTROL
//     if (
//       req.user.role === "LAWYER" &&
//       client.createdById !== Number(req.user.userId)
//     ) {
//       return res.status(403).json({ message: "Forbidden" });
//     }
//     return res.json(client);
//   } catch {
//     return res.status(500).json({ message: "Server error" });
//   }
// };
// GET CLIENT BY ID
const getClientById = async (req, res) => {
    try {
        const clientId = Number(req.params.id);
        if (isNaN(clientId)) {
            return res.status(400).json({
                message: "Invalid ID",
            });
        }
        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
        const client = await client_1.default.client.findUnique({
            where: {
                id: clientId,
            },
            include: {
                cases: {
                    select: {
                        id: true,
                        title: true,
                        status: true,
                        hearingDate: true,
                        createdAt: true,
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                },
            },
        });
        if (!client) {
            return res.status(404).json({
                message: "Client not found",
            });
        }
        // 🔐 ACCESS CONTROL
        if (req.user.role === "LAWYER" &&
            client.createdById !== Number(req.user.userId)) {
            return res.status(403).json({
                message: "Forbidden",
            });
        }
        // console.log(client);
        return res.json({
            success: true,
            client,
        });
    }
    catch {
        return res.status(500).json({
            message: "Server error",
        });
    }
};
exports.getClientById = getClientById;
// UPDATE CLIENT
const updateClient = async (req, res) => {
    try {
        const clientId = Number(req.params.id);
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const existing = await client_1.default.client.findUnique({
            where: { id: clientId },
        });
        if (!existing) {
            return res.status(404).json({ message: "Not found" });
        }
        // 🔐 ACCESS CONTROL
        if (req.user.role === "LAWYER" &&
            existing.createdById !== Number(req.user.userId)) {
            return res.status(403).json({ message: "Forbidden" });
        }
        const updated = await client_1.default.client.update({
            where: { id: clientId },
            data: req.body,
            include: {
                cases: true,
            },
        });
        return res.json(updated);
    }
    catch {
        return res.status(500).json({ message: "Server error" });
    }
};
exports.updateClient = updateClient;
// DELETE CLIENT
const deleteClient = async (req, res) => {
    try {
        const clientId = Number(req.params.id);
        if (isNaN(clientId)) {
            return res.status(400).json({ message: "Invalid client ID" });
        }
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const linkedCases = await client_1.default.case.findMany({
            where: { clientId },
        });
        if (linkedCases.length > 0) {
            return res.status(400).json({
                message: "Cannot delete client with active cases",
            });
        }
        const userId = Number(req.user.userId);
        const role = req.user.role;
        const existing = await client_1.default.client.findUnique({
            where: { id: clientId },
        });
        if (!existing) {
            return res.status(404).json({ message: "Client not found" });
        }
        // 🔐 ROLE-BASED ACCESS CONTROL
        // ❌ Clerk cannot delete
        if (role === "CLERK") {
            return res.status(403).json({
                message: "Clerks are not allowed to delete clients",
            });
        }
        // ❌ Lawyer can delete ONLY their own clients
        if (role === "LAWYER" && existing.createdById !== userId) {
            return res.status(403).json({
                message: "You can only delete your own clients",
            });
        }
        // ✅ Admin → allowed (no restriction)
        await client_1.default.client.delete({
            where: { id: clientId },
        });
        return res.status(200).json({
            success: true,
            message: "Client deleted successfully",
        });
    }
    catch (error) {
        console.error("Delete Client Error:", error);
        return res.status(500).json({
            message: "Server error",
        });
    }
};
exports.deleteClient = deleteClient;
