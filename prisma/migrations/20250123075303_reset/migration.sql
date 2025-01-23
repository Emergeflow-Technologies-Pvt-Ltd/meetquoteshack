/*
  Warnings:

  - The values [GENERAL,MORTGAGE] on the enum `ApplicationType` will be removed. If these variants are still used in the database, this will fail.
  - The values [pending,uploaded,approved,rejected] on the enum `DocumentStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [IDENTITY_PROOF,INCOME_PROOF,EMPLOYMENT_LETTER,TAX_RETURN,BANK_STATEMENT,PROPERTY_DOCUMENT,OTHER] on the enum `DocumentType` will be removed. If these variants are still used in the database, this will fail.
  - The values [FULL_TIME,PART_TIME,CONTRACT,SEASONAL,SELF_EMPLOYED,OTHER] on the enum `EmploymentStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [RENT,OWN] on the enum `HousingStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [processing,rejected,progressing,accepted,archived] on the enum `LoanStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [CONDO,APARTMENT,DUPLEX,TOWNHOUSE,DETACHED,SEMIDETACHED,CONTAINER,MOBILE,BUNGALOW,OTHER] on the enum `MortgageHousingType` will be removed. If these variants are still used in the database, this will fail.
  - The values [REFINE,EQUITY,BRIDGE,FIRST_TIME] on the enum `MortgageType` will be removed. If these variants are still used in the database, this will fail.
  - The values [CITIZEN,PERMANENT_RESIDENT,WORK_PERMIT,STUDENT_VISA,OTHER] on the enum `ResidencyStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [loanee,lender,admin] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `agreePrivacyPolicy` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `isAdult` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `mortgageLoanPurpose` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `residencyDuration` on the `Application` table. All the data in the column will be lost.
  - You are about to alter the column `housingPayment` on the `Application` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `grossIncome` on the `Application` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(12,2)`.
  - You are about to alter the column `loanAmount` on the `Application` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(12,2)`.
  - The `generalEducationLevel` column on the `Application` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `mortgageDownPayment` column on the `Application` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `yearsAtCurrentAddress` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `maritalStatus` on the `Application` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `loanAmount` on table `Application` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "MortgagePurpose" AS ENUM ('1', '2', '3');

-- CreateEnum
CREATE TYPE "MaritalStatus" AS ENUM ('1', '2', '3', '4', '50');

-- CreateEnum
CREATE TYPE "EducationLevel" AS ENUM ('1', '2', '3', '4', '50');

-- CreateEnum
CREATE TYPE "MortgageDownPayment" AS ENUM ('5', '10', '15', '20', 'more');

-- AlterEnum
BEGIN;
CREATE TYPE "ApplicationType_new" AS ENUM ('1', '2');
ALTER TABLE "Application" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Application" ALTER COLUMN "type" TYPE "ApplicationType_new" USING ("type"::text::"ApplicationType_new");
ALTER TYPE "ApplicationType" RENAME TO "ApplicationType_old";
ALTER TYPE "ApplicationType_new" RENAME TO "ApplicationType";
DROP TYPE "ApplicationType_old";
ALTER TABLE "Application" ALTER COLUMN "type" SET DEFAULT '1';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "DocumentStatus_new" AS ENUM ('1', '2', '3', '4');
ALTER TABLE "Document" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Document" ALTER COLUMN "status" TYPE "DocumentStatus_new" USING ("status"::text::"DocumentStatus_new");
ALTER TYPE "DocumentStatus" RENAME TO "DocumentStatus_old";
ALTER TYPE "DocumentStatus_new" RENAME TO "DocumentStatus";
DROP TYPE "DocumentStatus_old";
ALTER TABLE "Document" ALTER COLUMN "status" SET DEFAULT '1';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "DocumentType_new" AS ENUM ('1', '2', '3', '4', '5', '6', '50');
ALTER TABLE "Document" ALTER COLUMN "documentType" TYPE "DocumentType_new" USING ("documentType"::text::"DocumentType_new");
ALTER TYPE "DocumentType" RENAME TO "DocumentType_old";
ALTER TYPE "DocumentType_new" RENAME TO "DocumentType";
DROP TYPE "DocumentType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "EmploymentStatus_new" AS ENUM ('1', '2', '3', '4', '5', '50');
ALTER TABLE "Application" ALTER COLUMN "employmentStatus" TYPE "EmploymentStatus_new" USING ("employmentStatus"::text::"EmploymentStatus_new");
ALTER TYPE "EmploymentStatus" RENAME TO "EmploymentStatus_old";
ALTER TYPE "EmploymentStatus_new" RENAME TO "EmploymentStatus";
DROP TYPE "EmploymentStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "HousingStatus_new" AS ENUM ('1', '2');
ALTER TABLE "Application" ALTER COLUMN "housingStatus" TYPE "HousingStatus_new" USING ("housingStatus"::text::"HousingStatus_new");
ALTER TYPE "HousingStatus" RENAME TO "HousingStatus_old";
ALTER TYPE "HousingStatus_new" RENAME TO "HousingStatus";
DROP TYPE "HousingStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "LoanStatus_new" AS ENUM ('1', '2', '3', '4', '5');
ALTER TABLE "Application" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Application" ALTER COLUMN "status" TYPE "LoanStatus_new" USING ("status"::text::"LoanStatus_new");
ALTER TYPE "LoanStatus" RENAME TO "LoanStatus_old";
ALTER TYPE "LoanStatus_new" RENAME TO "LoanStatus";
DROP TYPE "LoanStatus_old";
ALTER TABLE "Application" ALTER COLUMN "status" SET DEFAULT '1';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "MortgageHousingType_new" AS ENUM ('1', '2', '3', '4', '5', '6', '7', '8', '9', '50');
ALTER TABLE "Application" ALTER COLUMN "mortgageHousingType" TYPE "MortgageHousingType_new" USING ("mortgageHousingType"::text::"MortgageHousingType_new");
ALTER TYPE "MortgageHousingType" RENAME TO "MortgageHousingType_old";
ALTER TYPE "MortgageHousingType_new" RENAME TO "MortgageHousingType";
DROP TYPE "MortgageHousingType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "MortgageType_new" AS ENUM ('1', '2', '3', '4');
ALTER TABLE "Application" ALTER COLUMN "mortgageType" TYPE "MortgageType_new" USING ("mortgageType"::text::"MortgageType_new");
ALTER TYPE "MortgageType" RENAME TO "MortgageType_old";
ALTER TYPE "MortgageType_new" RENAME TO "MortgageType";
DROP TYPE "MortgageType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ResidencyStatus_new" AS ENUM ('1', '2', '3', '4', '50');
ALTER TABLE "Application" ALTER COLUMN "residencyStatus" TYPE "ResidencyStatus_new" USING ("residencyStatus"::text::"ResidencyStatus_new");
ALTER TYPE "ResidencyStatus" RENAME TO "ResidencyStatus_old";
ALTER TYPE "ResidencyStatus_new" RENAME TO "ResidencyStatus";
DROP TYPE "ResidencyStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('1', '2', '3');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TABLE "Message" ALTER COLUMN "senderRole" TYPE "UserRole_new" USING ("senderRole"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT '1';
COMMIT;

-- AlterTable
ALTER TABLE "Application" DROP COLUMN "agreePrivacyPolicy",
DROP COLUMN "isAdult",
DROP COLUMN "mortgageLoanPurpose",
DROP COLUMN "residencyDuration",
ADD COLUMN     "mortgagePurpose" "MortgagePurpose",
ADD COLUMN     "yearsAtCurrentAddress" INTEGER NOT NULL,
ALTER COLUMN "type" SET DEFAULT '1',
ALTER COLUMN "housingPayment" SET DATA TYPE DECIMAL(10,2),
DROP COLUMN "maritalStatus",
ADD COLUMN     "maritalStatus" "MaritalStatus" NOT NULL,
ALTER COLUMN "grossIncome" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "loanAmount" SET NOT NULL,
ALTER COLUMN "loanAmount" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "status" SET DEFAULT '1',
DROP COLUMN "generalEducationLevel",
ADD COLUMN     "generalEducationLevel" "EducationLevel",
DROP COLUMN "mortgageDownPayment",
ADD COLUMN     "mortgageDownPayment" "MortgageDownPayment";

-- AlterTable
ALTER TABLE "Document" ALTER COLUMN "status" SET DEFAULT '1';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT '1';

-- DropEnum
DROP TYPE "GeneralEducationLevel";

-- DropEnum
DROP TYPE "GeneralMaritalStatus";

-- DropEnum
DROP TYPE "MortgageLoanPurpose";

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE INDEX "Application_userId_idx" ON "Application"("userId");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");
