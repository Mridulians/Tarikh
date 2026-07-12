"use strict";
// src/validations/case.validation.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignClerkSchema = exports.createCaseSchema = void 0;
const zod_1 = require("zod");
exports.createCaseSchema = zod_1.z.object({
    title: zod_1.z.string().min(3, "Title must be at least 3 characters"),
    description: zod_1.z.string().optional(),
    clientId: zod_1.z.number().gt(0, "Client is required"),
    hearingDate: zod_1.z.string().datetime({
        message: "Invalid hearing date format",
    }),
    courtName: zod_1.z.string().optional(),
    caseNumber: zod_1.z.string().optional(),
    priority: zod_1.z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
    status: zod_1.z.enum(["OPEN", "CLOSED"]).optional(),
});
exports.assignClerkSchema = zod_1.z.object({
    clerkId: zod_1.z.number().gt(0, "Clerk ID is required"),
});
