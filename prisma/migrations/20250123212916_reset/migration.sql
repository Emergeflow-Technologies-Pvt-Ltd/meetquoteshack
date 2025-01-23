/*
  Warnings:

  - The values [1,2] on the enum `ApplicationType` will be removed. If these variants are still used in the database, this will fail.
  - The values [1,2,3,4] on the enum `DocumentStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [1,2,3,4,5,6,50] on the enum `DocumentType` will be removed. If these variants are still used in the database, this will fail.
  - The values [1,2,3,4,50] on the enum `EducationLevel` will be removed. If these variants are still used in the database, this will fail.
  - The values [1,2,3,4,5,50] on the enum `EmploymentStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [1,2] on the enum `HousingStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [1,2,3,4,5] on the enum `LoanStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [1,2,3,4,50] on the enum `MaritalStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [1,2,3,4,5,6,7,8,9] on the enum `MortgageHousingType` will be removed. If these variants are still used in the database, this will fail.
  - The values [1,2,3] on the enum `MortgagePurpose` will be removed. If these variants are still used in the database, this will fail.
  - The values [1,2,3,4] on the enum `MortgageType` will be removed. If these variants are still used in the database, this will fail.
  - The values [1,2,3,4,50] on the enum `ResidencyStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [1,2,3] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `personalEmail` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ApplicationType_new" AS ENUM ('general', 'mortgage');
ALTER TABLE "Application" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Application" ALTER COLUMN "type" TYPE "ApplicationType_new" USING ("type"::text::"ApplicationType_new");
ALTER TYPE "ApplicationType" RENAME TO "ApplicationType_old";
ALTER TYPE "ApplicationType_new" RENAME TO "ApplicationType";
DROP TYPE "ApplicationType_old";
ALTER TABLE "Application" ALTER COLUMN "type" SET DEFAULT 'general';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "DocumentStatus_new" AS ENUM ('pending', 'uploaded', 'approved', 'rejected');
ALTER TABLE "Document" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Document" ALTER COLUMN "status" TYPE "DocumentStatus_new" USING ("status"::text::"DocumentStatus_new");
ALTER TYPE "DocumentStatus" RENAME TO "DocumentStatus_old";
ALTER TYPE "DocumentStatus_new" RENAME TO "DocumentStatus";
DROP TYPE "DocumentStatus_old";
ALTER TABLE "Document" ALTER COLUMN "status" SET DEFAULT 'pending';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "DocumentType_new" AS ENUM ('identity_proof', 'income_proof', 'employment_letter', 'tax_return', 'bank_statement', 'property_document', 'other');
ALTER TABLE "Document" ALTER COLUMN "documentType" TYPE "DocumentType_new" USING ("documentType"::text::"DocumentType_new");
ALTER TYPE "DocumentType" RENAME TO "DocumentType_old";
ALTER TYPE "DocumentType_new" RENAME TO "DocumentType";
DROP TYPE "DocumentType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "EducationLevel_new" AS ENUM ('high_school', 'college', 'university', 'post_graduate', 'other');
ALTER TABLE "Application" ALTER COLUMN "generalEducationLevel" TYPE "EducationLevel_new" USING ("generalEducationLevel"::text::"EducationLevel_new");
ALTER TYPE "EducationLevel" RENAME TO "EducationLevel_old";
ALTER TYPE "EducationLevel_new" RENAME TO "EducationLevel";
DROP TYPE "EducationLevel_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "EmploymentStatus_new" AS ENUM ('full_time', 'part_time', 'contract', 'seasonal', 'self_employed', 'other');
ALTER TABLE "Application" ALTER COLUMN "employmentStatus" TYPE "EmploymentStatus_new" USING ("employmentStatus"::text::"EmploymentStatus_new");
ALTER TYPE "EmploymentStatus" RENAME TO "EmploymentStatus_old";
ALTER TYPE "EmploymentStatus_new" RENAME TO "EmploymentStatus";
DROP TYPE "EmploymentStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "HousingStatus_new" AS ENUM ('rent', 'own');
ALTER TABLE "Application" ALTER COLUMN "housingStatus" TYPE "HousingStatus_new" USING ("housingStatus"::text::"HousingStatus_new");
ALTER TYPE "HousingStatus" RENAME TO "HousingStatus_old";
ALTER TYPE "HousingStatus_new" RENAME TO "HousingStatus";
DROP TYPE "HousingStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "LoanStatus_new" AS ENUM ('processing', 'rejected', 'progressing', 'accepted', 'archived');
ALTER TABLE "Application" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Application" ALTER COLUMN "status" TYPE "LoanStatus_new" USING ("status"::text::"LoanStatus_new");
ALTER TYPE "LoanStatus" RENAME TO "LoanStatus_old";
ALTER TYPE "LoanStatus_new" RENAME TO "LoanStatus";
DROP TYPE "LoanStatus_old";
ALTER TABLE "Application" ALTER COLUMN "status" SET DEFAULT 'processing';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "MaritalStatus_new" AS ENUM ('single', 'married', 'divorced', 'widowed', 'other');
ALTER TABLE "Application" ALTER COLUMN "maritalStatus" TYPE "MaritalStatus_new" USING ("maritalStatus"::text::"MaritalStatus_new");
ALTER TYPE "MaritalStatus" RENAME TO "MaritalStatus_old";
ALTER TYPE "MaritalStatus_new" RENAME TO "MaritalStatus";
DROP TYPE "MaritalStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "MortgageHousingType_new" AS ENUM ('condo', 'apartment', 'duplex', 'townhouse', 'detached', 'semi_detached', 'container', 'mobile', 'bungalow', '50');
ALTER TABLE "Application" ALTER COLUMN "mortgageHousingType" TYPE "MortgageHousingType_new" USING ("mortgageHousingType"::text::"MortgageHousingType_new");
ALTER TYPE "MortgageHousingType" RENAME TO "MortgageHousingType_old";
ALTER TYPE "MortgageHousingType_new" RENAME TO "MortgageHousingType";
DROP TYPE "MortgageHousingType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "MortgagePurpose_new" AS ENUM ('buying', 'repair', 'renovation');
ALTER TABLE "Application" ALTER COLUMN "mortgagePurpose" TYPE "MortgagePurpose_new" USING ("mortgagePurpose"::text::"MortgagePurpose_new");
ALTER TYPE "MortgagePurpose" RENAME TO "MortgagePurpose_old";
ALTER TYPE "MortgagePurpose_new" RENAME TO "MortgagePurpose";
DROP TYPE "MortgagePurpose_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "MortgageType_new" AS ENUM ('refine', 'equity', 'bridge', 'first_time');
ALTER TABLE "Application" ALTER COLUMN "mortgageType" TYPE "MortgageType_new" USING ("mortgageType"::text::"MortgageType_new");
ALTER TYPE "MortgageType" RENAME TO "MortgageType_old";
ALTER TYPE "MortgageType_new" RENAME TO "MortgageType";
DROP TYPE "MortgageType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ResidencyStatus_new" AS ENUM ('citizen', 'permanent_resident', 'work_permit', 'student_visa', 'other');
ALTER TABLE "Application" ALTER COLUMN "residencyStatus" TYPE "ResidencyStatus_new" USING ("residencyStatus"::text::"ResidencyStatus_new");
ALTER TYPE "ResidencyStatus" RENAME TO "ResidencyStatus_old";
ALTER TYPE "ResidencyStatus_new" RENAME TO "ResidencyStatus";
DROP TYPE "ResidencyStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('loanee', 'lender', 'admin');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TABLE "Message" ALTER COLUMN "senderRole" TYPE "UserRole_new" USING ("senderRole"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'loanee';
COMMIT;

-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "personalEmail" TEXT NOT NULL,
ALTER COLUMN "type" SET DEFAULT 'general',
ALTER COLUMN "status" SET DEFAULT 'processing';

-- AlterTable
ALTER TABLE "Document" ALTER COLUMN "status" SET DEFAULT 'pending';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'loanee';
