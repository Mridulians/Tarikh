// src/validations/client.validation.ts

import { z } from "zod";

export const createClientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),

  email: z
    .string()
    .email("Invalid email")
    .optional()
    .or(z.literal("")),

  phone: z
    .string()
    .regex(/^[0-9]{10}$/, "Phone must be exactly 10 digits"),

//   preferredMode: z.enum(["SMS", "EMAIL", "CALL"]).optional(),

//   reminderBefore: z
//     .number()
//     .min(1, "Reminder must be at least 1 minute")
//     .optional(),


  preferredMode: z.enum(["SMS", "EMAIL", "WHATSAPP", "CALL"]), // ✅ required

   reminderBefore: z
    .number()
    .min(1, "Too low")
    .max(10080, "Too high"), // max 7 days  // ✅ required


});