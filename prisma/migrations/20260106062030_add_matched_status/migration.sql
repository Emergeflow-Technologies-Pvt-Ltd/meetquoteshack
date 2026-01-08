-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('LOANEE_FREE', 'LOANEE_STAY_SMART', 'LENDER_TRIAL', 'LENDER_SIMPLE', 'LENDER_STANDARD');

-- CreateEnum
CREATE TYPE "BillingInterval" AS ENUM ('MONTHLY', 'YEARLY', 'NONE');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('TRIALING', 'ACTIVE', 'PAST_DUE', 'CANCELED', 'INCOMPLETE', 'INCOMPLETE_EXPIRED', 'UNPAID');

-- CreateEnum
CREATE TYPE "PrequalStatus" AS ENUM ('APPROVED', 'CONDITIONAL', 'DECLINED');

-- CreateEnum
CREATE TYPE "CreditTier" AS ENUM ('EXCELLENT', 'GOOD', 'FAIR', 'POOR');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "LoanStatus" ADD VALUE 'ASSIGNED_TO_POTENTIAL_LENDER';
ALTER TYPE "LoanStatus" ADD VALUE 'ASSIGNED_TO_MATCH';

-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'agent';

-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "agentCode" TEXT,
ADD COLUMN     "agentId" TEXT,
ADD COLUMN     "prequalCreditTier" "CreditTier",
ADD COLUMN     "prequalDti" DECIMAL(6,2),
ADD COLUMN     "prequalExplanation" TEXT,
ADD COLUMN     "prequalLabel" TEXT,
ADD COLUMN     "prequalLti" DECIMAL(6,2),
ADD COLUMN     "prequalLtv" DECIMAL(6,2),
ADD COLUMN     "prequalMortMax" DECIMAL(14,2),
ADD COLUMN     "prequalMortMin" DECIMAL(14,2),
ADD COLUMN     "prequalPayment" DECIMAL(12,2),
ADD COLUMN     "prequalRoomMonthly" DECIMAL(12,2),
ADD COLUMN     "prequalSnapshot" JSONB,
ADD COLUMN     "prequalStatus" "PrequalStatus",
ADD COLUMN     "prequalTdsr" DECIMAL(6,2);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "freeTierEndsAt" TIMESTAMP(3),
ADD COLUMN     "hasSeenFreeTrialModal" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "stripeCustomerId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "plan" "SubscriptionPlan" NOT NULL,
    "billingInterval" "BillingInterval" NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "stripeSubscriptionId" TEXT,
    "stripePriceId" TEXT,
    "currentPeriodEnd" TIMESTAMP(3),
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agent" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "business" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "agentCode" TEXT,
    "calendlyUrl" TEXT,

    CONSTRAINT "Agent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentReview" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "agentId" TEXT NOT NULL,
    "loaneeId" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,

    CONSTRAINT "AgentReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentApplicationUnlock" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AgentApplicationUnlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PotentialLender" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "lenderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PotentialLender_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripeSubscriptionId_key" ON "Subscription"("stripeSubscriptionId");

-- CreateIndex
CREATE INDEX "Subscription_userId_idx" ON "Subscription"("userId");

-- CreateIndex
CREATE INDEX "Subscription_role_idx" ON "Subscription"("role");

-- CreateIndex
CREATE INDEX "Subscription_plan_idx" ON "Subscription"("plan");

-- CreateIndex
CREATE UNIQUE INDEX "Agent_userId_key" ON "Agent"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Agent_agentCode_key" ON "Agent"("agentCode");

-- CreateIndex
CREATE INDEX "Agent_userId_idx" ON "Agent"("userId");

-- CreateIndex
CREATE INDEX "AgentReview_agentId_idx" ON "AgentReview"("agentId");

-- CreateIndex
CREATE UNIQUE INDEX "AgentReview_applicationId_key" ON "AgentReview"("applicationId");

-- CreateIndex
CREATE INDEX "AgentApplicationUnlock_agentId_idx" ON "AgentApplicationUnlock"("agentId");

-- CreateIndex
CREATE INDEX "AgentApplicationUnlock_applicationId_idx" ON "AgentApplicationUnlock"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "AgentApplicationUnlock_applicationId_agentId_key" ON "AgentApplicationUnlock"("applicationId", "agentId");

-- CreateIndex
CREATE INDEX "PotentialLender_applicationId_idx" ON "PotentialLender"("applicationId");

-- CreateIndex
CREATE INDEX "PotentialLender_lenderId_idx" ON "PotentialLender"("lenderId");

-- CreateIndex
CREATE INDEX "Application_agentId_idx" ON "Application"("agentId");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentReview" ADD CONSTRAINT "AgentReview_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentReview" ADD CONSTRAINT "AgentReview_loaneeId_fkey" FOREIGN KEY ("loaneeId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentReview" ADD CONSTRAINT "AgentReview_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentApplicationUnlock" ADD CONSTRAINT "AgentApplicationUnlock_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentApplicationUnlock" ADD CONSTRAINT "AgentApplicationUnlock_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PotentialLender" ADD CONSTRAINT "PotentialLender_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
