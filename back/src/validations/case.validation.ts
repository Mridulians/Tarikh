// src/validations/case.validation.ts

import { z } from "zod";

export const createCaseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),

  description: z.string().optional(),

  clientId: z.number().gt(0, "Client is required"),

  hearingDate: z.string().datetime({
    message: "Invalid hearing date format",
  }),

  courtName: z.string().optional(),
  caseNumber: z.string().optional(),

  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  status: z.enum(["OPEN", "CLOSED"]).optional(),
});

export const assignClerkSchema = z.object({
  clerkId: z.number().gt(0, "Clerk ID is required"),
});