import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client";
import bcrypt from "bcrypt";
import { AuthRequest } from "../middleware/auth.middleware";



export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  res.status(201).json({ message: "User created", userId: user.id });
};



export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

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

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" },
  );

  res.json({ token });
};



export const me = async (req: AuthRequest, res: Response) => {
  // const userId = req.userId;

  if(!req.user){
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = req.user.id;

  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId!) },
    select: {
      id: true,
      email: true,
      createdAt: true,
      role: true,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // console.log("i am user : " , user )
  res.json(user);

//   res.json({
//     id: user.id,
//     email: user.email,
//     role: user.role,
//   });
};
