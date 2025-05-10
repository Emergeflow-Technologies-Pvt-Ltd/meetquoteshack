/*
  Warnings:

  - The values [verified] on the enum `LoanStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `Investor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Loan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Newsletter` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `senderId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ApplicationType" AS ENUM ('general', 'mortgage');

-- CreateEnum
CREATE TYPE "HousingStatus" AS ENUM ('rent', 'own');

-- CreateEnum
CREATE TYPE "ResidencyStatus" AS ENUM ('citizen', 'permanent_resident', 'work_permit', 'student_visa', 'other');

-- CreateEnum
CREATE TYPE "EmploymentStatus" AS ENUM ('full_time', 'part_time', 'contract', 'seasonal', 'self_employed', 'other');

-- CreateEnum
CREATE TYPE "MortgagePurpose" AS ENUM ('buying', 'repair', 'renovation');

-- CreateEnum
CREATE TYPE "MortgageType" AS ENUM ('refine', 'equity', 'bridge', 'first_time');

-- CreateEnum
CREATE TYPE "MortgageHousingType" AS ENUM ('condo', 'apartment', 'duplex', 'townhouse', 'detached', 'semi_detached', 'container', 'mobile', 'bungalow', '50');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('identity_proof', 'income_proof', 'employment_letter', 'tax_return', 'bank_statement', 'property_document', 'other');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('pending', 'uploaded', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "MaritalStatus" AS ENUM ('single', 'married', 'divorced', 'widowed', 'other');

-- CreateEnum
CREATE TYPE "EducationLevel" AS ENUM ('high_school', 'college', 'university', 'post_graduate', 'other');

-- CreateEnum
CREATE TYPE "MortgageDownPayment" AS ENUM ('5', '10', '15', '20', 'more');

-- AlterEnum
BEGIN;
CREATE TYPE "LoanStatus_new" AS ENUM ('processing', 'rejected', 'progressing', 'accepted', 'archived');
ALTER TABLE "Loan" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Application" ALTER COLUMN "status" TYPE "LoanStatus_new" USING ("status"::text::"LoanStatus_new");
ALTER TYPE "LoanStatus" RENAME TO "LoanStatus_old";
ALTER TYPE "LoanStatus_new" RENAME TO "LoanStatus";
DROP TYPE "LoanStatus_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Loan" DROP CONSTRAINT "Loan_userId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_applicationId_fkey";

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "senderId" TEXT NOT NULL,
ALTER COLUMN "senderRole" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT;

-- DropTable
DROP TABLE "Investor";

-- DropTable
DROP TABLE "Loan";

-- DropTable
DROP TABLE "Newsletter";

-- DropEnum
DROP TYPE "TaskStatus";

-- CreateTable
CREATE TABLE "Lender" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "business" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "investment" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "userId" TEXT,
    "approved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Lender_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "ApplicationType" NOT NULL DEFAULT 'general',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "LoanStatus" NOT NULL DEFAULT 'processing',
    "hasBankruptcy" BOOLEAN NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "currentAddress" TEXT NOT NULL,
    "yearsAtCurrentAddress" INTEGER NOT NULL,
    "housingStatus" "HousingStatus" NOT NULL,
    "housingPayment" DECIMAL(10,2) NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "maritalStatus" "MaritalStatus" NOT NULL,
    "residencyStatus" "ResidencyStatus" NOT NULL,
    "personalPhone" TEXT NOT NULL,
    "personalEmail" TEXT NOT NULL,
    "employmentStatus" "EmploymentStatus" NOT NULL,
    "grossIncome" DECIMAL(12,2) NOT NULL,
    "workplaceName" TEXT NOT NULL,
    "workplaceAddress" TEXT NOT NULL,
    "workplacePhone" TEXT NOT NULL,
    "workplaceEmail" TEXT NOT NULL,
    "loanAmount" DECIMAL(12,2) NOT NULL,
    "generalEducationLevel" "EducationLevel",
    "generalFieldOfStudy" TEXT,
    "mortgageBusinessPhone" TEXT,
    "mortgagePurpose" "MortgagePurpose",
    "mortgageType" "MortgageType",
    "mortgageHousingType" "MortgageHousingType",
    "mortgageDownPayment" "MortgageDownPayment",

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "documentType" "DocumentType" NOT NULL,
    "fileUrl" TEXT,
    "fileKey" TEXT,
    "fileType" TEXT,
    "fileName" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "DocumentStatus" NOT NULL DEFAULT 'pending',

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lender_userId_key" ON "Lender"("userId");

-- CreateIndex
CREATE INDEX "Application_userId_idx" ON "Application"("userId");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- AddForeignKey
ALTER TABLE "Lender" ADD CONSTRAINT "Lender_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
