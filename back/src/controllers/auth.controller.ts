// import { Request, Response } from "express";
// import jwt from "jsonwebtoken";
// import prisma from "../prisma/client";
// import bcrypt from "bcrypt";
// import { AuthRequest } from "../middleware/auth.middleware";

// // export const register = async (req: Request, res: Response) => {
// //   const { email, password } = req.body;

// //   if (!email || !password) {
// //     return res.status(400).json({ message: "Missing fields" });
// //   }

// //   const hashedPassword = await bcrypt.hash(password, 10);

// //   const user = await prisma.user.create({
// //     data: {
// //       email,
// //       password: hashedPassword,
// //     },
// //   });

// //   res.status(201).json({ message: "User created", userId: user.id });
// // };

// export const register = async (req: Request, res: Response) => {
//   const { name, email, password, role } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ message: "Missing fields" });
//   }

//   // ✅ Allowed roles (NO ADMIN here)
//   const allowedRoles = ["LAWYER", "CLERK"];

//   let userRole = "LAWYER"; // default

//   if (role) {
//     if (!allowedRoles.includes(role)) {
//       return res.status(400).json({ message: "Invalid role" });
//     }
//     userRole = role;
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);

//   const user = await prisma.user.create({
//     data: {
//       name,
//       email,
//       password: hashedPassword,
//       role: userRole as any, // ✅ important
//     },
//   });

//   res.status(201).json({
//     message: "User created",
//     userId: user.id,
//     role: user.role,
//   });
// };

// export const login = async (req: Request, res: Response) => {
//   const { email, password } = req.body;

//   const user = await prisma.user.findUnique({
//     where: { email },
//   });

//   if (!user) {
//     return res.status(401).json({ message: "Invalid credentials" });
//   }

//   const isValid = await bcrypt.compare(password, user.password);

//   if (!isValid) {
//     return res.status(401).json({ message: "Invalid credentials" });
//   }

//   const token = jwt.sign(
//     { userId: user.id, role: user.role, email: user.email, name: user.name },
//     process.env.JWT_SECRET!,
//     { expiresIn: "70d" },
//   );

//   res.json({ token });
// };

// export const me = async (req: AuthRequest, res: Response) => {
//   // const userId = req.userId;

//   if (!req.user) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   const userId = req.user.userId;

//   const user = await prisma.user.findUnique({
//     where: { id: userId as any },
//     select: {
//       id: true,
//       email: true,
//       createdAt: true,
//       role: true,
//     },
//   });

//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   // console.log("i am user : " , user )
//   res.json(user);

//   //   res.json({
//   //     id: user.id,
//   //     email: user.email,
//   //     role: user.role,
//   //   });
// };










import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client";
import bcrypt from "bcrypt";
// import { AuthRequest } from "../middleware/auth.middleware";
import { registerSchema, loginSchema } from "../validations/auth.validator";

// ✅ REGISTER
// export const register = async (req: Request, res: Response) => {
//   try {
//     // ✅ ZOD VALIDATION
//     const parsed = registerSchema.safeParse(req.body);

//     if (!parsed.success) {
//       return res.status(400).json({
//         message: "Validation failed",
//         errors: parsed.error.flatten(),
//       });
//     }

//     const { name, email, password, role } = parsed.data;

//     // ❌ CHECK IF USER EXISTS
//     const existingUser = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (existingUser) {
//       return res.status(400).json({
//         message: "Email already registered",
//       });
//     }

//     // ✅ ROLE CONTROL (NO ADMIN)
//     const userRole = role || "LAWYER";

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = await prisma.user.create({
//       data: {
//         name,
//         email,
//         password: hashedPassword,
//         role: userRole,
//       },
//     });

//     return res.status(201).json({
//       success: true,
//       message: "User created",
//       userId: user.id,
//       role: user.role,
//     });
//   } catch (error) {
//     console.error("Register Error:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };


export const register = async (req: Request, res: Response) => {
  try {
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parsed.error.flatten(),
      });
    }

    const { name, email, password, role, lawyerCode } = parsed.data;

    // check email exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    const userRole = role || "LAWYER";

    const hashedPassword = await bcrypt.hash(password, 10);

    let assignedLawyerId: number | null = null;
    let generatedLawyerCode: string | null = null;

    // ✅ CLERK SIGNUP
    if (userRole === "CLERK") {
      const lawyer = await prisma.user.findUnique({
        where: { lawyerCode },
      });

      if (!lawyer || lawyer.role !== "LAWYER") {
        return res.status(400).json({
          message: "Invalid Lawyer ID",
        });
      }

      assignedLawyerId = lawyer.id;
    }

    // ✅ LAWYER SIGNUP
    if (userRole === "LAWYER") {
      const latestLawyer = await prisma.user.findFirst({
        where: {
          role: "LAWYER",
        },
        orderBy: {
          id: "desc",
        },
      });

      const nextId = latestLawyer ? latestLawyer.id + 1 : 1;

      generatedLawyerCode = `LAW-${nextId}`;
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: userRole,

        lawyerId: assignedLawyerId || undefined,

        lawyerCode: generatedLawyerCode || undefined,
      },
    });

    return res.status(201).json({
      success: true,
      message: "User created",
      userId: user.id,
      role: user.role,
      lawyerCode: user.lawyerCode,
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ✅ LOGIN
export const login = async (req: Request, res: Response) => {
  try {
    // ✅ ZOD VALIDATION
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parsed.error.flatten(),
      });
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ TOKEN
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "70d" }
    );

    return res.json({
      success: true,
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET CURRENT USER (/me)
export const me = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(req.user.userId) }, // ✅ FIXED (no any)
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        lawyerCode: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Me Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};