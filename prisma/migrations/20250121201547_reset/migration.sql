-- CreateEnum
CREATE TYPE "ApplicationType" AS ENUM ('GENERAL', 'MORTGAGE');

-- CreateEnum
CREATE TYPE "HousingStatus" AS ENUM ('RENT', 'OWN');

-- CreateEnum
CREATE TYPE "ResidencyStatus" AS ENUM ('CITIZEN', 'PERMANENT_RESIDENT', 'WORK_PERMIT', 'STUDENT_VISA', 'OTHER');

-- CreateEnum
CREATE TYPE "EmploymentStatus" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'SEASONAL', 'SELF_EMPLOYED', 'OTHER');

-- CreateEnum
CREATE TYPE "MortgageLoanPurpose" AS ENUM ('BUYING', 'REPAIR', 'RENOVATION');

-- CreateEnum
CREATE TYPE "MortgageType" AS ENUM ('REFINE', 'EQUITY', 'BRIDGE', 'FIRST_TIME');

-- CreateEnum
CREATE TYPE "MortgageHousingType" AS ENUM ('CONDO', 'APARTMENT', 'DUPLEX', 'TOWNHOUSE', 'DETACHED', 'SEMIDETACHED', 'CONTAINER', 'MOBILE', 'BUNGALOW', 'OTHER');

-- CreateEnum
CREATE TYPE "LoanStatus" AS ENUM ('processing', 'rejected', 'progressing', 'accepted', 'archived');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('IDENTITY_PROOF', 'INCOME_PROOF', 'EMPLOYMENT_LETTER', 'TAX_RETURN', 'BANK_STATEMENT', 'PROPERTY_DOCUMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('pending', 'uploaded', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "GeneralMaritalStatus" AS ENUM ('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED', 'OTHER');

-- CreateEnum
CREATE TYPE "GeneralEducationLevel" AS ENUM ('HIGH_SCHOOL', 'COLLEGE', 'UNIVERSITY', 'POST_GRADUATE', 'OTHER');

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "type" "ApplicationType" NOT NULL DEFAULT 'GENERAL',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isAdult" BOOLEAN NOT NULL,
    "agreePrivacyPolicy" BOOLEAN NOT NULL,
    "hasBankruptcy" BOOLEAN NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "currentAddress" TEXT NOT NULL,
    "residencyDuration" INTEGER NOT NULL,
    "housingStatus" "HousingStatus" NOT NULL,
    "housingPayment" DECIMAL(65,30) NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "maritalStatus" "GeneralMaritalStatus" NOT NULL,
    "residencyStatus" "ResidencyStatus" NOT NULL,
    "personalPhone" TEXT NOT NULL,
    "employmentStatus" "EmploymentStatus" NOT NULL,
    "grossIncome" DECIMAL(65,30) NOT NULL,
    "workplaceName" TEXT NOT NULL,
    "workplaceAddress" TEXT NOT NULL,
    "workplacePhone" TEXT NOT NULL,
    "workplaceEmail" TEXT NOT NULL,
    "loanAmount" DECIMAL(65,30),
    "status" "LoanStatus" NOT NULL DEFAULT 'processing',
    "generalEducationLevel" "GeneralEducationLevel",
    "generalFieldOfStudy" TEXT,
    "mortgageBusinessPhone" TEXT,
    "mortgageLoanPurpose" "MortgageLoanPurpose",
    "mortgageType" "MortgageType",
    "mortgageHousingType" "MortgageHousingType",
    "mortgageDownPayment" DECIMAL(65,30),

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

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "senderRole" "UserRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
