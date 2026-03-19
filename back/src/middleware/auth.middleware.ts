import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
  // role?: string;
  user?: {
    id: string;
    role: string;
  };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      role: any;
      userId: string;
    };

    console.log("DECODED:", decoded);

    // req.userId = decoded.userId;

    req.user = {
      id: decoded.userId,
      role: decoded.role,
    };

    console.log("AUTH HEADER:", req.headers.authorization);

    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};
