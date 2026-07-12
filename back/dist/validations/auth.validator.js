"use strict";
// import { z } from "zod";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
// // ✅ REGISTER VALIDATION
// export const registerSchema = z.object({
//   name: z.string().min(2, "Name must be at least 2 characters"),
//   email: z.string().email("Invalid email format"),
//   password: z
//     .string()
//     .min(6, "Password must be at least 6 characters"),
//   role: z.enum(["LAWYER", "CLERK"]).optional(),
// });
// // ✅ LOGIN VALIDATION
// export const loginSchema = z.object({
//   email: z.string().email("Invalid email format"),
//   password: z.string().min(1, "Password is required"),
// });
const zod_1 = require("zod");
// ✅ REGISTER VALIDATION
exports.registerSchema = zod_1.z
    .object({
    name: zod_1.z.string().min(2, "Name must be at least 2 characters"),
    email: zod_1.z.string().email("Invalid email format"),
    password: zod_1.z
        .string()
        .min(6, "Password must be at least 6 characters"),
    role: zod_1.z.enum(["LAWYER", "CLERK"]).optional(),
    // clerk enters lawyer code
    lawyerCode: zod_1.z.string().optional(),
})
    .superRefine((data, ctx) => {
    if (data.role === "CLERK" && !data.lawyerCode) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            path: ["lawyerCode"],
            message: "Lawyer ID is required for clerks",
        });
    }
});
// ✅ LOGIN VALIDATION
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email format"),
    password: zod_1.z.string().min(1, "Password is required"),
});
