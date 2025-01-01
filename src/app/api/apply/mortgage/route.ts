import { NextResponse } from 'next/server';
import type { LoanFormValues } from '@/app/apply/mortgage/types';
import prisma from '@/lib/db';
import { CanadianStatus, EmploymentStatus, HousingType, LoanPurpose, MortgageType } from '@prisma/client';
import { HousingStatus } from '@prisma/client';


export async function POST(request: Request) {
  try {
    const data: LoanFormValues = await request.json();

    // Validate required fields
    if (!data.firstName || !data.lastName || !data.employmentStatus) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save application to database
    const application = await prisma.mortgageApplication.create({
      data: {
        isAdult: data.isAdult,
        hasBankruptcy: data.hasBankruptcy,
        firstName: data.firstName,
        lastName: data.lastName,
        currentAddress: data.currentAddress,
        residencyDuration: data.residencyDuration || 0,
        housingStatus: data.housingStatus?.toLowerCase() as HousingStatus,
        housingPayment: data.housingPayment || 0,
        canadianStatus: data.canadianStatus?.toLowerCase().replace(' ', '') as CanadianStatus,
        employmentStatus: data.employmentStatus?.toLowerCase() as EmploymentStatus,
        grossIncome: data.grossIncome || 0,
        workplaceName: data.workplaceName,
        workplacePhone: data.workplacePhone,
        workplaceEmail: data.workplaceEmail,
        loanAmount: data.loanAmount,
        loanPurpose: data.loanPurpose?.toLowerCase() as LoanPurpose,
        mortgageType: data.mortgageType?.toLowerCase() as MortgageType,
        housingType: data.housingType?.toLowerCase() as HousingType,
        downPayment: data.downPayment
      }
    });

    return NextResponse.json(
      {
        message: 'Application submitted successfully',
        applicationId: application.id
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing mortgage application:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
