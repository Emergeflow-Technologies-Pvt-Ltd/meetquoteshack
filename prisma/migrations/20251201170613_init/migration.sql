-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('DOCUMENT_REQUEST', 'DOCUMENT_SUBMITTED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('loanee', 'lender', 'admin');

-- CreateEnum
CREATE TYPE "ApplicationType" AS ENUM ('general', 'mortgage');

-- CreateEnum
CREATE TYPE "HousingStatus" AS ENUM ('rent', 'own');

-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('CAR', 'TRUCK', 'SUV', 'VAN', 'SEDAN', 'MINIVAN', 'OTHER');

-- CreateEnum
CREATE TYPE "ResidencyStatus" AS ENUM ('citizen', 'permanent_resident', 'work_permit', 'student_visa', 'other', 'refugee');

-- CreateEnum
CREATE TYPE "EmploymentStatus" AS ENUM ('full_time', 'part_time', 'contract', 'seasonal', 'self_employed', 'other');

-- CreateEnum
CREATE TYPE "MortgagePurpose" AS ENUM ('buying', 'repair', 'renovation');

-- CreateEnum
CREATE TYPE "MortgageType" AS ENUM ('refine', 'equity', 'bridge', 'first_time');

-- CreateEnum
CREATE TYPE "MortgageHousingType" AS ENUM ('condo', 'apartment', 'duplex', 'townhouse', 'detached', 'semi_detached', 'container', 'mobile', 'bungalow', '50');

-- CreateEnum
CREATE TYPE "LoanType" AS ENUM ('FIRST_TIME_HOME', 'MORTGAGE_REFINANCE', 'INVESTMENT_PROPERTY', 'HELOC', 'HOME_REPAIR', 'COMMERCIAL', 'CAR', 'PERSONAL', 'LINE_OF_CREDIT', 'BUSINESS', 'OTHER');

-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('CONDO', 'APARTMENT', 'DUPLEX', 'TOWNHOUSE', 'DETACHED', 'SEMI_DETACHED', 'HOUSE', 'CONTAINER', 'MOBILE', 'BUNGALOW', 'OTHER');

-- CreateEnum
CREATE TYPE "LoanStatus" AS ENUM ('OPEN', 'ASSIGNED_TO_LENDER', 'IN_PROGRESS', 'IN_CHAT', 'APPROVED', 'REJECTED', 'ARCHIVED');

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

-- CreateEnum
CREATE TYPE "DownPayment" AS ENUM ('5', '10', '15', '20', 'more');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "role" "UserRole" NOT NULL DEFAULT 'loanee',
    "password" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

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
    "loanType" "LoanType" NOT NULL,
    "estimatedPropertyValue" DECIMAL(12,2),
    "houseType" "PropertyType",
    "downPayment" "DownPayment",
    "tradeInCurrentVehicle" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "LoanStatus" NOT NULL DEFAULT 'OPEN',
    "hasBankruptcy" BOOLEAN NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "previousAddress" TEXT,
    "currentAddress" TEXT NOT NULL,
    "yearsAtCurrentAddress" INTEGER NOT NULL,
    "housingStatus" "HousingStatus" NOT NULL,
    "housingPayment" DECIMAL(10,2) NOT NULL,
    "creditScore" INTEGER,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "maritalStatus" "MaritalStatus" NOT NULL,
    "residencyStatus" "ResidencyStatus" NOT NULL,
    "personalPhone" TEXT NOT NULL,
    "personalEmail" TEXT NOT NULL,
    "vehicleType" "VehicleType",
    "employmentStatus" "EmploymentStatus" NOT NULL,
    "grossIncome" DECIMAL(12,2) NOT NULL,
    "workplaceName" TEXT NOT NULL,
    "workplaceAddress" TEXT NOT NULL,
    "workplacePhone" TEXT NOT NULL,
    "workplaceEmail" TEXT NOT NULL,
    "workplaceDuration" INTEGER NOT NULL,
    "monthlyDebts" DECIMAL(12,2) NOT NULL,
    "savings" DECIMAL(12,2) NOT NULL,
    "otherIncome" BOOLEAN NOT NULL,
    "otherIncomeAmount" DECIMAL(12,2),
    "childCareBenefit" BOOLEAN NOT NULL,
    "sin" INTEGER,
    "hasCoApplicant" BOOLEAN NOT NULL,
    "coApplicantFullName" TEXT,
    "coApplicantDateOfBirth" TIMESTAMP(3),
    "coApplicantAddress" TEXT,
    "coApplicantPhone" TEXT,
    "coApplicantEmail" TEXT,
    "loanAmount" DECIMAL(12,2) NOT NULL,
    "generalEducationLevel" "EducationLevel",
    "generalFieldOfStudy" TEXT,
    "lenderId" TEXT,

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

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL DEFAULT 'DOCUMENT_REQUEST',
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationStatusHistory" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "oldStatus" "LoanStatus",
    "newStatus" "LoanStatus" NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changedById" TEXT,

    CONSTRAINT "ApplicationStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Lender_userId_key" ON "Lender"("userId");

-- CreateIndex
CREATE INDEX "Application_userId_idx" ON "Application"("userId");

-- CreateIndex
CREATE INDEX "Application_lenderId_idx" ON "Application"("lenderId");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_applicationId_idx" ON "Notification"("applicationId");

-- CreateIndex
CREATE INDEX "Notification_type_idx" ON "Notification"("type");

-- CreateIndex
CREATE INDEX "ApplicationStatusHistory_applicationId_idx" ON "ApplicationStatusHistory"("applicationId");

-- CreateIndex
CREATE INDEX "ApplicationStatusHistory_changedById_idx" ON "ApplicationStatusHistory"("changedById");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lender" ADD CONSTRAINT "Lender_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_lenderId_fkey" FOREIGN KEY ("lenderId") REFERENCES "Lender"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationStatusHistory" ADD CONSTRAINT "ApplicationStatusHistory_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationStatusHistory" ADD CONSTRAINT "ApplicationStatusHistory_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
