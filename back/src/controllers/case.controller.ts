import { Response } from "express";
import prisma from "../prisma/client";
import { AuthRequest } from "../middleware/auth.middleware";

export const createCase = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { title, description, clerkId } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const newCase = await prisma.case.create({
      data: {
        title,
        description,
        lawyerId: parseInt(req.user.id),
        clerkId: clerkId ? parseInt(clerkId) : null,
      },
    });

    return res.status(201).json(newCase);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create case" });
  }
};