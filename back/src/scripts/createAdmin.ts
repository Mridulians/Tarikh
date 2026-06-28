import bcrypt from "bcrypt";
import prisma from "../prisma/client";

async function createAdmin() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@mail.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("✅ Admin created:", admin);
}

createAdmin()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });






  // command to run this script: 
  // npx ts-node src/scripts/createAdmin.ts