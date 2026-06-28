// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";

// export interface AuthRequest extends Request {
//   userId?: Number;
//   // role?: string;
//   user?: {
//     userId: number; // ✅ fixed type
//     role: string;
//   };
// }

// export const authMiddleware = (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction,
// ) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
//       userId: user.id;
//       role: user.role;
//       email: user.email;
//     };

//     console.log("DECODED:", decoded);

//     req.userId = decoded.userId;

//     // req.user = {
//     //   id: decoded.userId,
//     //   role: decoded.role,
//     // };

//     req.user = {
//       userId: decoded.userId,
//       role: decoded.role,
//     };

//     console.log("AUTH HEADER:", req.headers.authorization);

//     next();
//   } catch {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };



import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    role: string;
    email?: string;
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
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as {
      userId: number;
      role: string;
      email?: string;
    };

    // ✅ attach clean user object
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
      email: decoded.email,
    };

    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};