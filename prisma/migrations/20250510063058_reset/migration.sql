/*
  Warnings:

  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Application` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Document` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Lender` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('pending', 'completed', 'approved', 'rejected');

-- AlterEnum
ALTER TYPE "LoanStatus" ADD VALUE 'verified';

-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_userId_fkey";

-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "Lender" DROP CONSTRAINT "Lender_userId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_applicationId_fkey";

-- DropIndex
DROP INDEX "Account_userId_idx";

-- DropIndex
DROP INDEX "Session_userId_idx";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "password";

-- DropTable
DROP TABLE "Application";

-- DropTable
DROP TABLE "Document";

-- DropTable
DROP TABLE "Lender";

-- DropTable
DROP TABLE "Message";

-- DropEnum
DROP TYPE "ApplicationType";

-- DropEnum
DROP TYPE "DocumentStatus";

-- DropEnum
DROP TYPE "DocumentType";

-- DropEnum
DROP TYPE "EducationLevel";

-- DropEnum
DROP TYPE "EmploymentStatus";

-- DropEnum
DROP TYPE "HousingStatus";

-- DropEnum
DROP TYPE "MaritalStatus";

-- DropEnum
DROP TYPE "MortgageDownPayment";

-- DropEnum
DROP TYPE "MortgageHousingType";

-- DropEnum
DROP TYPE "MortgagePurpose";

-- DropEnum
DROP TYPE "MortgageType";

-- DropEnum
DROP TYPE "ResidencyStatus";

-- CreateTable
CREATE TABLE "Investor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "business" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "investment" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "eligibility" BOOLEAN NOT NULL,

    CONSTRAINT "Investor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Loan" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "age" TEXT NOT NULL,
    "bankruptcy" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "purpose" TEXT NOT NULL,
    "vehicle" TEXT,
    "name" JSONB NOT NULL,
    "number" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "marriage" TEXT NOT NULL,
    "residenceStatus" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "housingStatus" TEXT NOT NULL,
    "monthlyPayment" TEXT NOT NULL,
    "employment" TEXT NOT NULL,
    "income" TEXT NOT NULL,
    "otherIncome" TEXT NOT NULL,
    "childBenefit" TEXT NOT NULL,
    "creditScore" TEXT NOT NULL,
    "houseExpenditure" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "debt" TEXT NOT NULL,
    "sin" TEXT,
    "payDayLoans" TEXT NOT NULL,
    "owe" TEXT NOT NULL,
    "status" "LoanStatus" NOT NULL DEFAULT 'processing',
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "tasks" JSONB[],

    CONSTRAINT "Loan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Newsletter" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Newsletter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Newsletter_email_key" ON "Newsletter"("email");

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
