/*
  Warnings:

  - A unique constraint covering the columns `[lawyerCode]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "CommunicationMode" ADD VALUE 'CALL';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lawyerCode" TEXT,
ADD COLUMN     "lawyerId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "User_lawyerCode_key" ON "User"("lawyerCode");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_lawyerId_fkey" FOREIGN KEY ("lawyerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
