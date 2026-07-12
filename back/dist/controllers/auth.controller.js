"use strict";
// import { Request, Response } from "express";
// import jwt from "jsonwebtoken";
// import prisma from "../prisma/client";
// import bcrypt from "bcrypt";
// import { AuthRequest } from "../middleware/auth.middleware";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = __importDefault(require("../prisma/client"));
const bcrypt_1 = __importDefault(require("bcrypt"));
// import { AuthRequest } from "../middleware/auth.middleware";
const auth_validator_1 = require("../validations/auth.validator");
// ✅ REGISTER
// export const register = async (req: Request, res: Response) => {
//   try {
//     // ✅ ZOD VALIDATION
//     const parsed = registerSchema.safeParse(req.body);
//     if (!parsed.success) {
//       return res.status(400).json({
//         message: "Validation failed",
//         errors: parsed.error.flatten(),
//       });
//     }
//     const { name, email, password, role } = parsed.data;
//     // ❌ CHECK IF USER EXISTS
//     const existingUser = await prisma.user.findUnique({
//       where: { email },
//     });
//     if (existingUser) {
//       return res.status(400).json({
//         message: "Email already registered",
//       });
//     }
//     // ✅ ROLE CONTROL (NO ADMIN)
//     const userRole = role || "LAWYER";
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = await prisma.user.create({
//       data: {
//         name,
//         email,
//         password: hashedPassword,
//         role: userRole,
//       },
//     });
//     return res.status(201).json({
//       success: true,
//       message: "User created",
//       userId: user.id,
//       role: user.role,
//     });
//   } catch (error) {
//     console.error("Register Error:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };
const register = async (req, res) => {
    try {
        const parsed = auth_validator_1.registerSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: parsed.error.flatten(),
            });
        }
        const { name, email, password, role, lawyerCode } = parsed.data;
        // check email exists
        const existingUser = await client_1.default.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered",
            });
        }
        const userRole = role || "LAWYER";
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        let assignedLawyerId = null;
        let generatedLawyerCode = null;
        // ✅ CLERK SIGNUP
        if (userRole === "CLERK") {
            const lawyer = await client_1.default.user.findUnique({
                where: { lawyerCode },
            });
            if (!lawyer || lawyer.role !== "LAWYER") {
                return res.status(400).json({
                    message: "Invalid Lawyer ID",
                });
            }
            assignedLawyerId = lawyer.id;
        }
        // ✅ LAWYER SIGNUP
        if (userRole === "LAWYER") {
            const latestLawyer = await client_1.default.user.findFirst({
                where: {
                    role: "LAWYER",
                },
                orderBy: {
                    id: "desc",
                },
            });
            const nextId = latestLawyer ? latestLawyer.id + 1 : 1;
            generatedLawyerCode = `LAW-${nextId}`;
        }
        const user = await client_1.default.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: userRole,
                lawyerId: assignedLawyerId || undefined,
                lawyerCode: generatedLawyerCode || undefined,
            },
        });
        return res.status(201).json({
            success: true,
            message: "User created",
            userId: user.id,
            role: user.role,
            lawyerCode: user.lawyerCode,
        });
    }
    catch (error) {
        console.error("Register Error:", error);
        return res.status(500).json({
            message: "Server error",
        });
    }
};
exports.register = register;
// ✅ LOGIN
const login = async (req, res) => {
    try {
        // ✅ ZOD VALIDATION
        const parsed = auth_validator_1.loginSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: parsed.error.flatten(),
            });
        }
        const { email, password } = parsed.data;
        const user = await client_1.default.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const isValid = await bcrypt_1.default.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        // ✅ TOKEN
        const token = jsonwebtoken_1.default.sign({
            userId: user.id,
            role: user.role,
            email: user.email,
            name: user.name,
        }, process.env.JWT_SECRET, { expiresIn: "70d" });
        return res.json({
            success: true,
            token,
        });
    }
    catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.login = login;
// ✅ GET CURRENT USER (/me)
const me = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const user = await client_1.default.user.findUnique({
            where: { id: Number(req.user.userId) }, // ✅ FIXED (no any)
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                lawyerCode: true,
            },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.json({
            success: true,
            user,
        });
    }
    catch (error) {
        console.error("Me Error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.me = me;
