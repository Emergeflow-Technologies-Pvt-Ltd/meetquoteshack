-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('loanee', 'lender', 'admin');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'loanee';
