// import { Request, Response } from "express";
// import prisma from "../prisma/client";

// // 📌 Get all users with role = CLERK
// export const getClerks = async (req: Request, res: Response) => {
//   try {
//     const clerks = await prisma.user.findMany({
//       where: {
//         role: "CLERK",
//       },
//       select: {
//         id: true,
//         email: true,
//       },
//     });

//     return res.status(200).json({
//       success: true,
//       clerks,
//     });
//   } catch (error) {
//     console.error("Get Clerks Error:", error);
//     return res.status(500).json({
//       message: "Server error",
//     });
//   }
// };

import { Request, Response } from "express";
import prisma from "../prisma/client";
// import { AuthRequest } from "../middleware/auth.middleware";


// export const getClerks = async (req: AuthRequest, res: Response) => {
//   try {
//     // 🔐 Only ADMIN or LAWYER should access
//     if (!req.user) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     if (req.user.role === "CLERK") {
//       return res.status(403).json({
//         message: "Clerks are not allowed to view clerks list",
//       });
//     }

//     const clerks = await prisma.user.findMany({
//       where: {
//         role: "CLERK",
//       },
//       select: {
//         id: true,
//         name: true,   // ✅ ADD THIS
//         email: true,
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     });

//     return res.status(200).json({
//       success: true,
//       clerks,
//     });
//   } catch (error) {
//     console.error("Get Clerks Error:", error);
//     return res.status(500).json({
//       message: "Server error",
//     });
//   }
// };





// 📌 Get all clerks (ADMIN can see all, LAWYER can see only their clerks)
export const getClerks = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.role === "CLERK") {
      return res.status(403).json({
        message: "Clerks are not allowed to view clerks list",
      });
    }

    const whereCondition =
      req.user.role === "LAWYER"
        ? {
            role: "CLERK" as const,
            lawyerId: Number(req.user.userId),
          }
        : {
            role: "CLERK" as const,
          };

    const clerks = await prisma.user.findMany({
      where: whereCondition,
      select: {
        id: true,
        name: true,
        email: true,
        lawyerId: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      clerks,
    });
  } catch (error) {
    console.error("Get Clerks Error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// 📌 Get all lawyers (ADMIN only)
export const getLawyers = async (req: Request, res: Response) => {
  try {
    // 🔐 Auth check
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 🔐 Only ADMIN allowed
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        message: "Only admin can view lawyers list",
      });
    }

    const lawyers = await prisma.user.findMany({
      where: {
        role: "LAWYER",
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      lawyers,
    });
  } catch (error) {
    console.error("Get Lawyers Error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};
