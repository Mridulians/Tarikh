"use strict";
// src/validations/client.validation.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClientSchema = void 0;
const zod_1 = require("zod");
exports.createClientSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Name must be at least 2 characters"),
    email: zod_1.z
        .string()
        .email("Invalid email")
        .optional()
        .or(zod_1.z.literal("")),
    phone: zod_1.z
        .string()
        .regex(/^[0-9]{10}$/, "Phone must be exactly 10 digits"),
    //   preferredMode: z.enum(["SMS", "EMAIL", "CALL"]).optional(),
    //   reminderBefore: z
    //     .number()
    //     .min(1, "Reminder must be at least 1 minute")
    //     .optional(),
    preferredMode: zod_1.z.enum(["SMS", "EMAIL", "WHATSAPP", "CALL"]), // ✅ required
    reminderBefore: zod_1.z
        .number()
        .min(1, "Too low")
        .max(10080, "Too high"), // max 7 days  // ✅ required
});
