"use strict";
// import { Response } from "express";
// import prisma from "../prisma/client";
// import { AuthRequest } from "../middleware/auth.middleware";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCaseDetails = exports.getCaseActivity = exports.assignClerk = exports.deleteCase = exports.updateCase = exports.getCaseById = exports.getMyCases = exports.getCases = exports.createCase = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const activity_1 = require("../utils/activity");
const case_validation_1 = require("../validations/case.validation");
// ✅ CREATE CASE
// export const createCase = async (req: AuthRequest, res: Response) => {
//   if (!req.user) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }
//   try {
//     const {
//       title,
//       description,
//       clientId,
//       hearingDate,
//       courtName,
//       caseNumber,
//       priority,
//       status,
//     } = req.body;
//     if (!title || !clientId || !hearingDate) {
//       return res.status(400).json({
//         message: "Title, Client, and Hearing Date are required",
//       });
//     }
//     // ✅ validate client exists
//     const clientExists = await prisma.client.findUnique({
//       where: { id: Number(clientId) },
//     });
//     if (!clientExists) {
//       return res.status(400).json({ message: "Invalid client" });
//     }
//     const newCase = await prisma.case.create({
//       data: {
//         title,
//         description,
//         clientId: Number(clientId),
//         hearingDate: new Date(hearingDate),
//         courtName,
//         caseNumber,
//         priority,
//         status,
//         createdById: Number(req.user.userId),
//       },
//       include: {
//         client: true,
//         createdBy: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//             role: true,
//           },
//         },
//         clerks: {
//           include: {
//             user: true,
//           },
//         },
//       },
//     });
//     await logActivity({
//       caseId: newCase.id,
//       userId: req.user.userId,
//       action: "CREATED",
//       message: `Case "${newCase.title}" created`,
//     });
//     return res.status(201).json(newCase);
//   } catch (error: any) {
//     return res.status(500).json({
//       message: "Failed to create case",
//       error: error.message,
//     });
//   }
// };
const createCase = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        // ✅ ZOD VALIDATION
        const parsed = case_validation_1.createCaseSchema.parse(req.body);
        const { title, description, clientId, hearingDate, courtName, caseNumber, priority, status, } = parsed;
        // ✅ CHECK CLIENT EXISTS
        const clientExists = await client_1.default.client.findUnique({
            where: { id: clientId },
        });
        if (!clientExists) {
            return res.status(400).json({ message: "Invalid client" });
        }
        // ✅ CREATE CASE
        const newCase = await client_1.default.case.create({
            data: {
                title,
                description,
                clientId,
                hearingDate: new Date(hearingDate),
                courtName,
                caseNumber,
                priority,
                status,
                createdById: Number(req.user.userId),
            },
            include: {
                client: true,
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
                clerks: {
                    include: {
                        user: true,
                    },
                },
            },
        });
        // ✅ ACTIVITY LOG
        await (0, activity_1.logActivity)({
            caseId: newCase.id,
            userId: req.user.userId,
            action: "CREATED",
            message: `Case "${newCase.title}" created`,
        });
        return res.status(201).json(newCase);
    }
    catch (error) {
        // ✅ CLEAN ZOD ERROR
        if (error.name === "ZodError") {
            return res.status(400).json({
                // message: "Validation failed",
                message: error.issues[0].message, // send first error message
                errors: error.errors,
            });
        }
        return res.status(500).json({
            message: "Failed to create case",
            error: error.message,
        });
    }
};
exports.createCase = createCase;
// ✅ GET ALL CASES (ADMIN ONLY - ROLE BASED CONTROL IN CONTROLLER)
const getCases = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    if (req.user.role !== "ADMIN") {
        return res.status(403).json({
            message: "Only admin can access all cases",
        });
    }
    try {
        const cases = await client_1.default.case.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                client: true,
                createdBy: true,
                clerks: {
                    include: { user: true },
                },
            },
        });
        return res.json({ success: true, cases });
    }
    catch {
        return res.status(500).json({ message: "Failed to fetch cases" });
    }
};
exports.getCases = getCases;
// ✅ GET MY CASES (ROLE BASED)
const getMyCases = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = Number(req.user.userId);
    const role = req.user.role;
    try {
        let cases;
        if (role === "ADMIN") {
            cases = await client_1.default.case.findMany({
                include: {
                    client: true,
                    createdBy: true,
                    clerks: {
                        include: { user: true },
                    },
                },
            });
        }
        else if (role === "LAWYER") {
            cases = await client_1.default.case.findMany({
                where: { createdById: userId },
                include: {
                    client: true,
                    clerks: {
                        include: { user: true },
                    },
                },
            });
        }
        else if (role === "CLERK") {
            cases = await client_1.default.case.findMany({
                where: {
                    clerks: {
                        some: { userId },
                    },
                },
                include: {
                    client: true,
                    createdBy: true,
                },
            });
        }
        else {
            return res.status(403).json({ message: "Invalid role" });
        }
        return res.json({ success: true, cases });
    }
    catch {
        return res.status(500).json({ message: "Server error" });
    }
};
exports.getMyCases = getMyCases;
// ✅ GET CASE BY ID
const getCaseById = async (req, res) => {
    try {
        const caseId = Number(req.params.id);
        if (isNaN(caseId)) {
            return res.status(400).json({ message: "Invalid case ID" });
        }
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const foundCase = await client_1.default.case.findUnique({
            where: { id: caseId },
            include: {
                client: true,
                createdBy: true,
                clerks: {
                    include: { user: true },
                },
            },
        });
        if (!foundCase) {
            return res.status(404).json({ message: "Case not found" });
        }
        const user = req.user;
        if ((user.role === "LAWYER" &&
            foundCase.createdById !== Number(user.userId)) ||
            (user.role === "CLERK" &&
                !foundCase.clerks.some((c) => c.userId === Number(user.userId)))) {
            return res.status(403).json({ message: "Forbidden" });
        }
        return res.json(foundCase);
    }
    catch {
        return res.status(500).json({ message: "Server error" });
    }
};
exports.getCaseById = getCaseById;
// ✅ UPDATE CASE
const updateCase = async (req, res) => {
    try {
        const caseId = Number(req.params.id);
        if (isNaN(caseId)) {
            return res.status(400).json({ message: "Invalid case ID" });
        }
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { title, description, status, hearingDate } = req.body;
        const existingCase = await client_1.default.case.findUnique({
            where: { id: caseId },
        });
        if (!existingCase) {
            return res.status(404).json({ message: "Case not found" });
        }
        const user = req.user;
        // if (
        //   user.role === "CLERK" ||
        //   (user.role === "LAWYER" &&
        //     existingCase.createdById !== Number(user.userId))
        // ) {
        //   return res.status(403).json({ message: "Forbidden" });
        // }
        // LAWYER can edit only their own case
        if (user.role === "LAWYER" &&
            existingCase.createdById !== Number(user.userId)) {
            return res.status(403).json({
                message: "Forbidden",
            });
        }
        // optional extra protection
        if (user.role !== "LAWYER" && user.role !== "CLERK") {
            return res.status(403).json({
                message: "Forbidden",
            });
        }
        const updatedCase = await client_1.default.case.update({
            where: { id: caseId },
            data: {
                title,
                description,
                status,
                hearingDate: hearingDate ? new Date(hearingDate) : undefined,
            },
        });
        // 🟡 Generic update log
        await (0, activity_1.logActivity)({
            caseId,
            userId: req.user.userId,
            action: "UPDATED",
            message: "Case updated",
            metadata: { title, description },
        });
        // 🔴 STATUS CHANGE (only if changed)
        if (status && status !== existingCase.status) {
            await (0, activity_1.logActivity)({
                caseId,
                userId: req.user.userId,
                action: "STATUS_CHANGED",
                message: `Status changed from ${existingCase.status} to ${status}`,
                metadata: {
                    from: existingCase.status,
                    to: status,
                },
            });
        }
        return res.json(updatedCase);
    }
    catch {
        return res.status(500).json({ message: "Server error" });
    }
};
exports.updateCase = updateCase;
// ✅ DELETE CASE
const deleteCase = async (req, res) => {
    try {
        const caseId = Number(req.params.id);
        if (isNaN(caseId)) {
            return res.status(400).json({ message: "Invalid case ID" });
        }
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const existingCase = await client_1.default.case.findUnique({
            where: { id: caseId },
        });
        if (!existingCase) {
            return res.status(404).json({ message: "Case not found" });
        }
        const user = req.user;
        if (user.role === "CLERK" ||
            (user.role === "LAWYER" &&
                existingCase.createdById !== Number(user.userId))) {
            return res.status(403).json({ message: "Forbidden" });
        }
        await (0, activity_1.logActivity)({
            caseId,
            userId: req.user.userId,
            action: "DELETED",
            message: `Case deleted`,
        });
        await client_1.default.case.delete({
            where: { id: caseId },
        });
        return res.json({ message: "Case deleted successfully" });
    }
    catch {
        return res.status(500).json({ message: "Server error" });
    }
};
exports.deleteCase = deleteCase;
// ✅ ASSIGN CLERK (CORRECT WAY)
// export const assignClerk = async (req: AuthRequest, res: Response) => {
//   try {
//     const caseId = Number(req.params.id);
//     const { clerkId } = req.body;
//     if (isNaN(caseId) || !clerkId) {
//       return res.status(400).json({ message: "Invalid data" });
//     }
//     if (!req.user) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }
//     const userId = Number(req.user.userId);
//     const role = req.user.role;
//     const existingCase = await prisma.case.findUnique({
//       where: { id: caseId },
//     });
//     if (!existingCase) {
//       return res.status(404).json({ message: "Case not found" });
//     }
//     const clerk = await prisma.user.findUnique({
//       where: { id: clerkId },
//     });
//     if (!clerk || clerk.role !== "CLERK") {
//       return res.status(400).json({ message: "Invalid clerk" });
//     }
//     if (
//       role === "CLERK" ||
//       (role === "LAWYER" && existingCase.createdById !== userId)
//     ) {
//       return res.status(403).json({ message: "Forbidden" });
//     }
//     // ✅ prevent duplicate
//     const existingAssignment = await prisma.caseClerk.findFirst({
//       where: { caseId, userId: clerkId },
//     });
//     if (existingAssignment) {
//       return res.status(400).json({
//         message: "Clerk already assigned",
//       });
//     }
//     // ✅ assign
//     await prisma.caseClerk.create({
//       data: {
//         caseId,
//         userId: clerkId,
//       },
//     });
//     const updatedCase = await prisma.case.findUnique({
//       where: { id: caseId },
//       include: {
//         client: true,
//         createdBy: true,
//         clerks: {
//           include: { user: true },
//         },
//       },
//     });
//     await logActivity({
//       caseId,
//       userId: req.user.userId,
//       action: "CLERK_ASSIGNED",
//       message: `Clerk assigned`,
//       metadata: { clerkId },
//     });
//     return res.json({
//       success: true,
//       message: "Clerk assigned successfully",
//       case: updatedCase,
//     });
//   } catch {
//     return res.status(500).json({ message: "Server error" });
//   }
// };
const assignClerk = async (req, res) => {
    try {
        // ✅ AUTH CHECK
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const caseId = Number(req.params.id);
        if (isNaN(caseId)) {
            return res.status(400).json({ message: "Invalid case ID" });
        }
        // ✅ ZOD VALIDATION
        const parsed = case_validation_1.assignClerkSchema.parse(req.body);
        const { clerkId } = parsed;
        const userId = Number(req.user.userId);
        const role = req.user.role;
        // ✅ CASE CHECK
        const existingCase = await client_1.default.case.findUnique({
            where: { id: caseId },
        });
        if (!existingCase) {
            return res.status(404).json({ message: "Case not found" });
        }
        // ✅ CLERK VALIDATION
        const clerk = await client_1.default.user.findUnique({
            where: { id: clerkId },
        });
        if (!clerk || clerk.role !== "CLERK") {
            return res.status(400).json({ message: "Invalid clerk" });
        }
        // ✅ LAWYER CAN ASSIGN ONLY THEIR OWN CLERKS
        if (role === "LAWYER" && clerk.lawyerId !== userId) {
            return res.status(403).json({
                message: "You can only assign your own clerks",
            });
        }
        // 🔐 ACCESS CONTROL
        if (role === "CLERK") {
            return res.status(403).json({
                message: "Clerks are not allowed to assign",
            });
        }
        if (role === "LAWYER" && existingCase.createdById !== userId) {
            return res.status(403).json({
                message: "You can only assign your own cases",
            });
        }
        // ✅ PREVENT DUPLICATE
        const existingAssignment = await client_1.default.caseClerk.findFirst({
            where: {
                caseId,
                userId: clerkId,
            },
        });
        if (existingAssignment) {
            return res.status(400).json({
                message: "Clerk already assigned",
            });
        }
        // ✅ ASSIGN
        await client_1.default.caseClerk.create({
            data: {
                caseId,
                userId: clerkId,
            },
        });
        // ✅ FETCH UPDATED CASE
        const updatedCase = await client_1.default.case.findUnique({
            where: { id: caseId },
            include: {
                client: true,
                createdBy: true,
                clerks: {
                    include: { user: true },
                },
            },
        });
        // ✅ ACTIVITY LOG
        await (0, activity_1.logActivity)({
            caseId,
            userId: req.user.userId,
            action: "CLERK_ASSIGNED",
            message: `Clerk assigned (ID: ${clerkId})`,
            metadata: { clerkId },
        });
        return res.json({
            success: true,
            message: "Clerk assigned successfully",
            case: updatedCase,
        });
    }
    catch (error) {
        // ✅ ZOD ERROR
        if (error.name === "ZodError") {
            return res.status(400).json({
                message: "Validation failed",
                errors: error.errors,
            });
        }
        return res.status(500).json({
            message: "Server error",
        });
    }
};
exports.assignClerk = assignClerk;
// ✅ GET CASE ACTIVITY LOG
const getCaseActivity = async (req, res) => {
    const caseId = Number(req.params.id);
    if (isNaN(caseId)) {
        return res.status(400).json({ message: "Invalid case ID" });
    }
    const activities = await client_1.default.caseActivity.findMany({
        where: { caseId },
        orderBy: { createdAt: "desc" },
        include: {
            performedBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });
    return res.json({
        success: true,
        activities,
    });
};
exports.getCaseActivity = getCaseActivity;
// Complete case details APIs
const getCaseDetails = async (req, res) => {
    try {
        const caseId = Number(req.params.id);
        if (isNaN(caseId)) {
            return res.status(400).json({ message: "Invalid case ID" });
        }
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const userId = Number(req.user.userId);
        const role = req.user.role;
        const caseData = await client_1.default.case.findUnique({
            where: { id: caseId },
            include: {
                client: true,
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                clerks: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
                activities: {
                    orderBy: { createdAt: "desc" }, // 🔥 timeline
                    include: {
                        performedBy: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        });
        if (!caseData) {
            return res.status(404).json({ message: "Case not found" });
        }
        // 🔐 ACCESS CONTROL
        if (role === "LAWYER" && caseData.createdById !== userId) {
            return res.status(403).json({ message: "Forbidden" });
        }
        if (role === "CLERK" && !caseData.clerks.some((c) => c.userId === userId)) {
            return res.status(403).json({ message: "Forbidden" });
        }
        return res.status(200).json({
            success: true,
            case: caseData,
        });
    }
    catch (error) {
        console.error("Case Details Error:", error);
        return res.status(500).json({
            message: "Server error",
        });
    }
};
exports.getCaseDetails = getCaseDetails;
// NEW CODE ENDS HERE
