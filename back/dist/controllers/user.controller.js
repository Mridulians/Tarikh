"use strict";
// import { Request, Response } from "express";
// import prisma from "../prisma/client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLawyers = exports.getClerks = void 0;
const client_1 = __importDefault(require("../prisma/client"));
// import { AuthRequest } from "../middleware/auth.middleware";
// export const getClerks = async (req: AuthRequest, res: Response) => {
//   try {
//     // 🔐 Only ADMIN or LAWYER should access
//     if (!req.user) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }
//     if (req.user.role === "CLERK") {
//       return res.status(403).json({
//         message: "Clerks are not allowed to view clerks list",
//       });
//     }
//     const clerks = await prisma.user.findMany({
//       where: {
//         role: "CLERK",
//       },
//       select: {
//         id: true,
//         name: true,   // ✅ ADD THIS
//         email: true,
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     });
//     return res.status(200).json({
//       success: true,
//       clerks,
//     });
//   } catch (error) {
//     console.error("Get Clerks Error:", error);
//     return res.status(500).json({
//       message: "Server error",
//     });
//   }
// };
// 📌 Get all clerks (ADMIN can see all, LAWYER can see only their clerks)
const getClerks = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (req.user.role === "CLERK") {
            return res.status(403).json({
                message: "Clerks are not allowed to view clerks list",
            });
        }
        const whereCondition = req.user.role === "LAWYER"
            ? {
                role: "CLERK",
                lawyerId: Number(req.user.userId),
            }
            : {
                role: "CLERK",
            };
        const clerks = await client_1.default.user.findMany({
            where: whereCondition,
            select: {
                id: true,
                name: true,
                email: true,
                lawyerId: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return res.status(200).json({
            success: true,
            clerks,
        });
    }
    catch (error) {
        console.error("Get Clerks Error:", error);
        return res.status(500).json({
            message: "Server error",
        });
    }
};
exports.getClerks = getClerks;
// 📌 Get all lawyers (ADMIN only)
const getLawyers = async (req, res) => {
    try {
        // 🔐 Auth check
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // 🔐 Only ADMIN allowed
        if (req.user.role !== "ADMIN") {
            return res.status(403).json({
                message: "Only admin can view lawyers list",
            });
        }
        const lawyers = await client_1.default.user.findMany({
            where: {
                role: "LAWYER",
            },
            select: {
                id: true,
                name: true,
                email: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return res.status(200).json({
            success: true,
            lawyers,
        });
    }
    catch (error) {
        console.error("Get Lawyers Error:", error);
        return res.status(500).json({
            message: "Server error",
        });
    }
};
exports.getLawyers = getLawyers;
