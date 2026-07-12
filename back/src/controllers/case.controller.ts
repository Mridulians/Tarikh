// import { Response } from "express";
// import prisma from "../prisma/client";
// import { AuthRequest } from "../middleware/auth.middleware";

// // export const createCase = async (req: AuthRequest, res: Response) => {
// //   if (!req.user) {
// //     return res.status(401).json({ message: "Unauthorized" });
// //   }

// //   const { title, description, clerkId } = req.body;

// //   if (!title || !description) {
// //     return res.status(400).json({ message: "Missing fields" });
// //   }

// //   try {
// //     const newCase = await prisma.case.create({
// //       data: {
// //         title,
// //         description,
// //         createdById: parseInt(req.user.id),
// //         clerkId: clerkId ? parseInt(clerkId) : null,
// //       },
// //     });

// //     return res.status(201).json(newCase);
// //   } catch (error) {
// //     return res.status(500).json({ message: "Failed to create case" });
// //   }
// // };

// export const createCase = async (req: AuthRequest, res: Response) => {
//   if (!req.user) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   try {
//     const {
//       title,
//       description,
//       clientId,
//       hearingDate,
//       courtName,
//       caseNumber,
//       priority,
//     } = req.body;

//     // 🔴 strict validation
//     if (!title || !clientId || !hearingDate) {
//       return res.status(400).json({
//         message: "Title, Client, and Hearing Date are required",
//       });
//     }

//     const newCase = await prisma.case.create({
//       data: {
//         title,
//         description,
//         clientId: Number(clientId),
//         hearingDate: new Date(hearingDate),
//         courtName,
//         caseNumber,
//         priority,

//         // ✅ correct field
//         createdById: Number(req.user.id),
//       },
//       include: {
//         client: true,
//       },
//     });

//     return res.status(201).json(newCase);
//   } catch (error: any) {
//     return res.status(500).json({
//       message: "Failed to create case",
//       error: error.message,
//     });
//   }
// };

// export const getCases = async (req: AuthRequest, res: Response) => {
//   if (!req.user) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   const userId = parseInt(req.user.id);
//   const role = req.user.role;

//   try {
//     let cases;

//     if (role === "ADMIN") {
//       // Admin → all cases
//       cases = await prisma.case.findMany({
//         orderBy: { createdAt: "desc" },
//       });
//     } else if (role === "LAWYER") {
//       // Lawyer → only his cases
//       cases = await prisma.case.findMany({
//         where: { createdById: userId },
//         orderBy: { createdAt: "desc" },
//       });
//     } else if (role === "CLERK") {
//       // Clerk → assigned cases
//       cases = await prisma.case.findMany({
//         where: {
//           clerks: {
//             some: {
//               userId: userId,
//             },
//           },
//         },
//         orderBy: { createdAt: "desc" },
//       });
//     } else {
//       return res.status(403).json({ message: "Forbidden" });
//     }

//     return res.json(cases);
//   } catch (error) {
//     return res.status(500).json({ message: "Failed to fetch cases" });
//   }
// };

// export const getCaseById = async (req: AuthRequest, res: Response) => {
//   try {
//     const caseId = parseInt(
//       Array.isArray(req.params.id) ? req.params.id[0] : req.params.id,
//     );

//     if (isNaN(caseId)) {
//       return res.status(400).json({ message: "Invalid case ID" });
//     }

//     if (!req.user) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const foundCase = await prisma.case.findUnique({
//       where: { id: caseId },
//       include: {
//         clerks: {
//           include: {
//             user: true,
//           },
//         },
//       },
//     });

//     if (!foundCase) {
//       return res.status(404).json({ message: "Case not found" });
//     }

//     const user = req.user;

//     // 🔐 ACCESS CONTROL (CRITICAL)
//     if (
//       (user.role === "LAWYER" && foundCase.createdById !== Number(user.id)) ||
//       (user.role === "CLERK" &&
//         !foundCase.clerks.some((c) => c.userId === Number(user.id)))
//     ) {
//       return res.status(403).json({ message: "Forbidden" });
//     }

//     // ADMIN → full access (no check needed)

//     res.json(foundCase);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// export const updateCase = async (req: AuthRequest, res: Response) => {
//   try {
//     const caseId = parseInt(
//       Array.isArray(req.params.id) ? req.params.id[0] : req.params.id,
//     );

//     if (isNaN(caseId)) {
//       return res.status(400).json({ message: "Invalid case ID" });
//     }

//     if (!req.user) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const { title, description, status } = req.body;

//     const existingCase = await prisma.case.findUnique({
//       where: { id: caseId },
//     });

//     if (!existingCase) {
//       return res.status(404).json({ message: "Case not found" });
//     }

//     const user = req.user;

//     // 🔐 ACCESS CONTROL
//     if (
//       user.role === "CLERK" ||
//       (user.role === "LAWYER" && existingCase.createdById !== Number(user.id))
//     ) {
//       return res.status(403).json({ message: "Forbidden" });
//     }

//     const updatedCase = await prisma.case.update({
//       where: { id: caseId },
//       data: {
//         title,
//         description,
//         status,
//       },
//     });

//     res.json(updatedCase);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// export const deleteCase = async (req: AuthRequest, res: Response) => {
//   try {
//     const caseId = parseInt(
//       Array.isArray(req.params.id) ? req.params.id[0] : req.params.id,
//     );

//     if (isNaN(caseId)) {
//       return res.status(400).json({ message: "Invalid case ID" });
//     }

//     if (!req.user) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const existingCase = await prisma.case.findUnique({
//       where: { id: caseId },
//     });

//     if (!existingCase) {
//       return res.status(404).json({ message: "Case not found" });
//     }

//     const user = req.user;

//     // 🔐 ACCESS CONTROL
//     if (
//       user.role === "CLERK" ||
//       (user.role === "LAWYER" && existingCase.createdById !== Number(user.id))
//     ) {
//       return res.status(403).json({ message: "Forbidden" });
//     }

//     await prisma.case.delete({
//       where: { id: caseId },
//     });

//     res.json({ message: "Case deleted successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // export const assignClerk = async (req: AuthRequest, res: Response) => {
// //   try {
// //     const caseId = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
// //     const { clerkId } = req.body;

// //     if (!caseId || !clerkId) {
// //       return res.status(400).json({ message: "Missing fields" });
// //     }

// //     if (!req.user) {
// //       return res.status(401).json({ message: "Unauthorized" });
// //     }

// //     const existingCase = await prisma.case.findUnique({
// //       where: { id: caseId },
// //     });

// //     if (!existingCase) {
// //       return res.status(404).json({ message: "Case not found" });
// //     }

// //     const clerk = await prisma.user.findUnique({
// //       where: { id: clerkId },
// //     });

// //     if (!clerk || clerk.role !== "CLERK") {
// //       return res.status(400).json({ message: "Invalid clerk" });
// //     }

// //     const user = req.user;

// //     // 🔐 ACCESS CONTROL
// //     if (
// //       user.role === "CLERK" ||
// //       (user.role === "LAWYER" && existingCase.createdById !== Number(user.id))
// //     ) {
// //       return res.status(403).json({ message: "Forbidden" });
// //     }

// //     const updatedCase = await prisma.case.update({
// //       where: { id: caseId },
// //       data: {
// //         clerkId,
// //       },
// //     });

// //     res.json(updatedCase);
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // };

// export const getMyCases = async (req: AuthRequest, res: Response) => {
//   try {
//     if (!req.user) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const userId = parseInt(req.user.id);
//     const role = req.user.role;

//     let cases;

//     // ADMIN → all cases
//     if (role === "ADMIN") {
//       cases = await prisma.case.findMany({
//         include: {
//           createdBy: true,
//           clerks: true,
//         },
//       });
//     }

//     // LAWYER → only their cases
//     else if (role === "LAWYER") {
//       cases = await prisma.case.findMany({
//         where: {
//           createdById: userId,
//         },
//         include: {
//           clerks: {
//             include: {
//               user: true,
//             },
//           },
//         },
//       });
//     }

//     // CLERK → only assigned cases
//     else if (role === "CLERK") {
//       cases = await prisma.case.findMany({
//         where: {
//           clerks: {
//             some: {
//               userId: userId,
//             },
//           },
//         },
//         include: {
//           createdBy: true,
//         },
//       });
//     } else {
//       return res.status(403).json({
//         message: "Invalid role",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       cases,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       message: "Server error",
//     });
//   }
// };

// export const assignClerk = async (req: AuthRequest, res: Response) => {
//   try {
//     // ✅ Extract and validate caseId
//     const caseIdRaw = Array.isArray(req.params.id)
//       ? req.params.id[0]
//       : req.params.id;
//     const caseId = parseInt(caseIdRaw);
//     const { clerkId } = req.body;

//     if (isNaN(caseId)) {
//       return res.status(400).json({ message: "Invalid case ID" });
//     }

//     if (!clerkId) {
//       return res.status(400).json({ message: "Clerk ID is required" });
//     }

//     // ✅ Check authentication
//     if (!req.user) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const role = req.user.role;
//     const userId = parseInt(req.user.id, 10);
//     if (isNaN(userId)) {
//       return res.status(400).json({ message: "Invalid user ID" });
//     }

//     // ✅ Find case
//     const existingCase = await prisma.case.findUnique({
//       where: { id: caseId },
//     });

//     if (!existingCase) {
//       return res.status(404).json({ message: "Case not found" });
//     }

//     // ✅ Find clerk and validate role
//     const clerk = await prisma.user.findUnique({
//       where: { id: clerkId },
//     });

//     if (!clerk || clerk.role !== "CLERK") {
//       return res.status(400).json({ message: "Invalid clerk" });
//     }

//     // 🔐 ACCESS CONTROL

//     // ❌ Clerk cannot assign
//     if (role === "CLERK") {
//       return res.status(403).json({
//         message: "Clerks are not allowed to assign cases",
//       });
//     }

//     // ❌ Lawyer can only assign their own cases
//     if (role === "LAWYER" && existingCase.createdById !== userId) {
//       return res.status(403).json({
//         message: "You can only assign your own cases",
//       });
//     }

//     // ✅ Assign clerk
//     const updatedCase = await prisma.case.update({
//       where: { id: caseId },
//       data: {
//         clerks: {
//           create: {
//             userId: clerkId,
//           },
//         },
//       },
//       include: {
//         createdBy: true,
//         clerks: {
//           include: {
//             user: true,
//           },
//         },
//       },
//     });

//     return res.status(200).json({
//       success: true,
//       message: "Clerk assigned successfully",
//       case: updatedCase,
//     });
//   } catch (error) {
//     console.error("Assign Clerk Error:", error);
//     return res.status(500).json({
//       message: "Server error",
//     });
//   }
// };

// NEW CODE STARTS HERE

import { Request, Response } from "express";
import prisma from "../prisma/client";
// import { AuthRequest } from "../middleware/auth.middleware";
import { logActivity } from "../utils/activity";
import {
  assignClerkSchema,
  createCaseSchema,
} from "../validations/case.validation";

// ✅ CREATE CASE
// export const createCase = async (req: AuthRequest, res: Response) => {
//   if (!req.user) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   try {
//     const {
//       title,
//       description,
//       clientId,
//       hearingDate,
//       courtName,
//       caseNumber,
//       priority,
//       status,
//     } = req.body;

//     if (!title || !clientId || !hearingDate) {
//       return res.status(400).json({
//         message: "Title, Client, and Hearing Date are required",
//       });
//     }

//     // ✅ validate client exists
//     const clientExists = await prisma.client.findUnique({
//       where: { id: Number(clientId) },
//     });

//     if (!clientExists) {
//       return res.status(400).json({ message: "Invalid client" });
//     }

//     const newCase = await prisma.case.create({
//       data: {
//         title,
//         description,
//         clientId: Number(clientId),
//         hearingDate: new Date(hearingDate),
//         courtName,
//         caseNumber,
//         priority,
//         status,
//         createdById: Number(req.user.userId),
//       },
//       include: {
//         client: true,
//         createdBy: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//             role: true,
//           },
//         },
//         clerks: {
//           include: {
//             user: true,
//           },
//         },
//       },
//     });

//     await logActivity({
//       caseId: newCase.id,
//       userId: req.user.userId,
//       action: "CREATED",
//       message: `Case "${newCase.title}" created`,
//     });

//     return res.status(201).json(newCase);
//   } catch (error: any) {
//     return res.status(500).json({
//       message: "Failed to create case",
//       error: error.message,
//     });
//   }
// };

export const createCase = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // ✅ ZOD VALIDATION
    const parsed = createCaseSchema.parse(req.body);

    const {
      title,
      description,
      clientId,
      hearingDate,
      courtName,
      caseNumber,
      priority,
      status,
    } = parsed;

    // ✅ CHECK CLIENT EXISTS
    const clientExists = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!clientExists) {
      return res.status(400).json({ message: "Invalid client" });
    }

    // ✅ CREATE CASE
    const newCase = await prisma.case.create({
      data: {
        title,
        description,
        clientId,
        hearingDate: new Date(hearingDate),
        courtName,
        caseNumber,
        priority,
        status,
        createdById: Number(req.user.userId),
      },
      include: {
        client: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        clerks: {
          include: {
            user: true,
          },
        },
      },
    });

    // ✅ ACTIVITY LOG
    await logActivity({
      caseId: newCase.id,
      userId: req.user.userId,
      action: "CREATED",
      message: `Case "${newCase.title}" created`,
    });

    return res.status(201).json(newCase);
  } catch (error: any) {
    // ✅ CLEAN ZOD ERROR
    if (error.name === "ZodError") {
      return res.status(400).json({
        // message: "Validation failed",
        message: error.issues[0].message, // send first error message

        errors: error.errors,
      });
    }

    return res.status(500).json({
      message: "Failed to create case",
      error: error.message,
    });
  }
};

// ✅ GET ALL CASES (ADMIN ONLY - ROLE BASED CONTROL IN CONTROLLER)
export const getCases = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      message: "Only admin can access all cases",
    });
  }

  try {
    const cases = await prisma.case.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        client: true,
        createdBy: true,
        clerks: {
          include: { user: true },
        },
      },
    });

    return res.json({ success: true, cases });
  } catch {
    return res.status(500).json({ message: "Failed to fetch cases" });
  }
};

// ✅ GET MY CASES (ROLE BASED)
export const getMyCases = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = Number(req.user.userId);
  const role = req.user.role;

  try {
    let cases;

    if (role === "ADMIN") {
      cases = await prisma.case.findMany({
        include: {
          client: true,
          createdBy: true,
          clerks: {
            include: { user: true },
          },
        },
      });
    } else if (role === "LAWYER") {
      cases = await prisma.case.findMany({
        where: { createdById: userId },
        include: {
          client: true,
          clerks: {
            include: { user: true },
          },
        },
      });
    } else if (role === "CLERK") {
      cases = await prisma.case.findMany({
        where: {
          clerks: {
            some: { userId },
          },
        },
        include: {
          client: true,
          createdBy: true,
        },
      });
    } else {
      return res.status(403).json({ message: "Invalid role" });
    }

    return res.json({ success: true, cases });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET CASE BY ID
export const getCaseById = async (req: Request, res: Response) => {
  try {
    const caseId = Number(req.params.id);

    if (isNaN(caseId)) {
      return res.status(400).json({ message: "Invalid case ID" });
    }

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const foundCase = await prisma.case.findUnique({
      where: { id: caseId },
      include: {
        client: true,
        createdBy: true,
        clerks: {
          include: { user: true },
        },
      },
    });

    if (!foundCase) {
      return res.status(404).json({ message: "Case not found" });
    }

    const user = req.user;

    if (
      (user.role === "LAWYER" &&
        foundCase.createdById !== Number(user.userId)) ||
      (user.role === "CLERK" &&
        !foundCase.clerks.some((c) => c.userId === Number(user.userId)))
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return res.json(foundCase);
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ UPDATE CASE
export const updateCase = async (req: Request, res: Response) => {
  try {
    const caseId = Number(req.params.id);

    if (isNaN(caseId)) {
      return res.status(400).json({ message: "Invalid case ID" });
    }

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { title, description, status, hearingDate } = req.body;

    const existingCase = await prisma.case.findUnique({
      where: { id: caseId },
    });

    if (!existingCase) {
      return res.status(404).json({ message: "Case not found" });
    }

    const user = req.user;

    // if (
    //   user.role === "CLERK" ||
    //   (user.role === "LAWYER" &&
    //     existingCase.createdById !== Number(user.userId))
    // ) {
    //   return res.status(403).json({ message: "Forbidden" });
    // }

    // LAWYER can edit only their own case
    if (
      user.role === "LAWYER" &&
      existingCase.createdById !== Number(user.userId)
    ) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    // optional extra protection
    if (user.role !== "LAWYER" && user.role !== "CLERK") {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const updatedCase = await prisma.case.update({
      where: { id: caseId },
      data: {
        title,
        description,
        status,
        hearingDate: hearingDate ? new Date(hearingDate) : undefined,
      },
    });

    // 🟡 Generic update log
    await logActivity({
      caseId,
      userId: req.user.userId,
      action: "UPDATED",
      message: "Case updated",
      metadata: { title, description },
    });

    // 🔴 STATUS CHANGE (only if changed)
    if (status && status !== existingCase.status) {
      await logActivity({
        caseId,
        userId: req.user.userId,
        action: "STATUS_CHANGED",
        message: `Status changed from ${existingCase.status} to ${status}`,
        metadata: {
          from: existingCase.status,
          to: status,
        },
      });
    }

    return res.json(updatedCase);
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ DELETE CASE
export const deleteCase = async (req: Request, res: Response) => {
  try {
    const caseId = Number(req.params.id);

    if (isNaN(caseId)) {
      return res.status(400).json({ message: "Invalid case ID" });
    }

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const existingCase = await prisma.case.findUnique({
      where: { id: caseId },
    });

    if (!existingCase) {
      return res.status(404).json({ message: "Case not found" });
    }

    const user = req.user;

    if (
      user.role === "CLERK" ||
      (user.role === "LAWYER" &&
        existingCase.createdById !== Number(user.userId))
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await logActivity({
      caseId,
      userId: req.user.userId,
      action: "DELETED",
      message: `Case deleted`,
    });

    await prisma.case.delete({
      where: { id: caseId },
    });

    return res.json({ message: "Case deleted successfully" });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ ASSIGN CLERK (CORRECT WAY)
// export const assignClerk = async (req: AuthRequest, res: Response) => {
//   try {
//     const caseId = Number(req.params.id);
//     const { clerkId } = req.body;

//     if (isNaN(caseId) || !clerkId) {
//       return res.status(400).json({ message: "Invalid data" });
//     }

//     if (!req.user) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const userId = Number(req.user.userId);
//     const role = req.user.role;

//     const existingCase = await prisma.case.findUnique({
//       where: { id: caseId },
//     });

//     if (!existingCase) {
//       return res.status(404).json({ message: "Case not found" });
//     }

//     const clerk = await prisma.user.findUnique({
//       where: { id: clerkId },
//     });

//     if (!clerk || clerk.role !== "CLERK") {
//       return res.status(400).json({ message: "Invalid clerk" });
//     }

//     if (
//       role === "CLERK" ||
//       (role === "LAWYER" && existingCase.createdById !== userId)
//     ) {
//       return res.status(403).json({ message: "Forbidden" });
//     }

//     // ✅ prevent duplicate
//     const existingAssignment = await prisma.caseClerk.findFirst({
//       where: { caseId, userId: clerkId },
//     });

//     if (existingAssignment) {
//       return res.status(400).json({
//         message: "Clerk already assigned",
//       });
//     }

//     // ✅ assign
//     await prisma.caseClerk.create({
//       data: {
//         caseId,
//         userId: clerkId,
//       },
//     });

//     const updatedCase = await prisma.case.findUnique({
//       where: { id: caseId },
//       include: {
//         client: true,
//         createdBy: true,
//         clerks: {
//           include: { user: true },
//         },
//       },
//     });

//     await logActivity({
//       caseId,
//       userId: req.user.userId,
//       action: "CLERK_ASSIGNED",
//       message: `Clerk assigned`,
//       metadata: { clerkId },
//     });

//     return res.json({
//       success: true,
//       message: "Clerk assigned successfully",
//       case: updatedCase,
//     });
//   } catch {
//     return res.status(500).json({ message: "Server error" });
//   }
// };
export const assignClerk = async (req: Request, res: Response) => {
  try {
    // ✅ AUTH CHECK
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const caseId = Number(req.params.id);

    if (isNaN(caseId)) {
      return res.status(400).json({ message: "Invalid case ID" });
    }

    // ✅ ZOD VALIDATION
    const parsed = assignClerkSchema.parse(req.body);
    const { clerkId } = parsed;

    const userId = Number(req.user.userId);
    const role = req.user.role;

    // ✅ CASE CHECK
    const existingCase = await prisma.case.findUnique({
      where: { id: caseId },
    });

    if (!existingCase) {
      return res.status(404).json({ message: "Case not found" });
    }

    // ✅ CLERK VALIDATION
    const clerk = await prisma.user.findUnique({
      where: { id: clerkId },
    });

    if (!clerk || clerk.role !== "CLERK") {
      return res.status(400).json({ message: "Invalid clerk" });
    }
    
    // ✅ LAWYER CAN ASSIGN ONLY THEIR OWN CLERKS
    if (role === "LAWYER" && clerk.lawyerId !== userId) {
      return res.status(403).json({
        message: "You can only assign your own clerks",
      });
    }

    // 🔐 ACCESS CONTROL
    if (role === "CLERK") {
      return res.status(403).json({
        message: "Clerks are not allowed to assign",
      });
    }

    if (role === "LAWYER" && existingCase.createdById !== userId) {
      return res.status(403).json({
        message: "You can only assign your own cases",
      });
    }

    // ✅ PREVENT DUPLICATE
    const existingAssignment = await prisma.caseClerk.findFirst({
      where: {
        caseId,
        userId: clerkId,
      },
    });

    if (existingAssignment) {
      return res.status(400).json({
        message: "Clerk already assigned",
      });
    }

    // ✅ ASSIGN
    await prisma.caseClerk.create({
      data: {
        caseId,
        userId: clerkId,
      },
    });

    // ✅ FETCH UPDATED CASE
    const updatedCase = await prisma.case.findUnique({
      where: { id: caseId },
      include: {
        client: true,
        createdBy: true,
        clerks: {
          include: { user: true },
        },
      },
    });

    // ✅ ACTIVITY LOG
    await logActivity({
      caseId,
      userId: req.user.userId,
      action: "CLERK_ASSIGNED",
      message: `Clerk assigned (ID: ${clerkId})`,
      metadata: { clerkId },
    });

    return res.json({
      success: true,
      message: "Clerk assigned successfully",
      case: updatedCase,
    });
  } catch (error: any) {
    // ✅ ZOD ERROR
    if (error.name === "ZodError") {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.errors,
      });
    }

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ✅ GET CASE ACTIVITY LOG
export const getCaseActivity = async (req: Request, res: Response) => {
  const caseId = Number(req.params.id);

  if (isNaN(caseId)) {
    return res.status(400).json({ message: "Invalid case ID" });
  }

  const activities = await prisma.caseActivity.findMany({
    where: { caseId },
    orderBy: { createdAt: "desc" },
    include: {
      performedBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return res.json({
    success: true,
    activities,
  });
};

// Complete case details APIs
export const getCaseDetails = async (req: Request, res: Response) => {
  try {
    const caseId = Number(req.params.id);

    if (isNaN(caseId)) {
      return res.status(400).json({ message: "Invalid case ID" });
    }

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = Number(req.user.userId);
    const role = req.user.role;

    const caseData = await prisma.case.findUnique({
      where: { id: caseId },
      include: {
        client: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        clerks: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        activities: {
          orderBy: { createdAt: "desc" }, // 🔥 timeline
          include: {
            performedBy: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!caseData) {
      return res.status(404).json({ message: "Case not found" });
    }

    // 🔐 ACCESS CONTROL

    if (role === "LAWYER" && caseData.createdById !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (role === "CLERK" && !caseData.clerks.some((c) => c.userId === userId)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return res.status(200).json({
      success: true,
      case: caseData,
    });
  } catch (error) {
    console.error("Case Details Error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

// NEW CODE ENDS HERE
