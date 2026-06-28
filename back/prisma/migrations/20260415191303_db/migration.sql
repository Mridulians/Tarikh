/*
  Warnings:

  - You are about to drop the column `clerkId` on the `Case` table. All the data in the column will be lost.
  - You are about to drop the column `lawyerId` on the `Case` table. All the data in the column will be lost.
  - Added the required column `clientId` to the `Case` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `Case` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hearingDate` to the `Case` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Case` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "CommunicationMode" AS ENUM ('SMS', 'EMAIL', 'WHATSAPP');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('CREATED', 'UPDATED', 'STATUS_CHANGED', 'CLERK_ASSIGNED', 'CLERK_REMOVED', 'DELETED');

-- AlterEnum
ALTER TYPE "CaseStatus" ADD VALUE 'PENDING';

-- DropForeignKey
ALTER TABLE "Case" DROP CONSTRAINT "Case_clerkId_fkey";

-- DropForeignKey
ALTER TABLE "Case" DROP CONSTRAINT "Case_lawyerId_fkey";

-- AlterTable
ALTER TABLE "Case" DROP COLUMN "clerkId",
DROP COLUMN "lawyerId",
ADD COLUMN     "caseNumber" TEXT,
ADD COLUMN     "clientId" INTEGER NOT NULL,
ADD COLUMN     "courtName" TEXT,
ADD COLUMN     "createdById" INTEGER NOT NULL,
ADD COLUMN     "hearingDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "role" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "type" TEXT,
    "preferredMode" "CommunicationMode" NOT NULL DEFAULT 'SMS',
    "reminderBefore" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseClerk" (
    "id" SERIAL NOT NULL,
    "caseId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CaseClerk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseActivity" (
    "id" SERIAL NOT NULL,
    "caseId" INTEGER NOT NULL,
    "action" "ActivityType" NOT NULL,
    "message" TEXT NOT NULL,
    "performedById" INTEGER NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CaseActivity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CaseClerk_caseId_userId_key" ON "CaseClerk"("caseId", "userId");

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseClerk" ADD CONSTRAINT "CaseClerk_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseClerk" ADD CONSTRAINT "CaseClerk_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseActivity" ADD CONSTRAINT "CaseActivity_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseActivity" ADD CONSTRAINT "CaseActivity_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
