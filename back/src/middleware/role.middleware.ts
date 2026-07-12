// middleware/role.middleware.ts
// import { Response, NextFunction } from "express";
// import { AuthRequest } from "./auth.middleware";
import {Request, Response, NextFunction} from "express";

export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      // return res.status(401).json({ message: "Unauthorized" });
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      // return res.status(403).json({ message: "Forbidden" });
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    next();
  };
};
