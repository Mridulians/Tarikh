"use strict";
// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// export interface AuthRequest extends Request {
//   user?: {
//     userId: number;
//     role: string;
//     email?: string;
//   };
// }
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    // if (!authHeader || !authHeader.startsWith("Bearer ")) {
    //   return res.status(401).json({ message: "Unauthorized" });
    // }
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // ✅ attach clean user object
        req.user = {
            userId: decoded.userId,
            role: decoded.role,
            email: decoded.email,
        };
        next();
    }
    catch {
        // catch {
        //   return res.status(401).json({ message: "Invalid token" });
        // }
        res.status(401).json({ message: "Invalid token" });
        return;
    }
};
exports.authMiddleware = authMiddleware;
