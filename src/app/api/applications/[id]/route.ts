import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { LoanStatus } from "@prisma/client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    const id = (await params).id;

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!id) {
      return new NextResponse("Missing application ID", { status: 400 });
    }

    const application = await prisma.application.findFirst({
      where: {
        id,
        status: {
          in: ["OPEN", "ASSIGNED_TO_LENDER", "IN_PROGRESS", "IN_CHAT", "REJECTED", "APPROVED"],
        },
      },
      include: {
        documents: true,
        messages: true,
        lender: {
          include: {
            user: {
              select: { id: true },
            },
          },
        },
        ApplicationStatusHistory: {
          orderBy: { changedAt: "desc" },
          include: {
            changedBy: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    });

    if (!application) {
      return new NextResponse("Not found", { status: 404 });
    }

    const potentials = await prisma.potentialLender.findMany({
      where: { applicationId: id },
      select: { lenderId: true },
    });

    const potentialLenderIds = potentials.map((p) => p.lenderId);

    const lenderList = await prisma.lender.findMany({ select: { name: true, id: true } });

    const { ApplicationStatusHistory, ...rest } = application;

    return NextResponse.json({
      application: {
        ...rest,
        applicationStatusHistory: ApplicationStatusHistory,
        potentialLenderIds,
      },
      lenderList,
    });
  } catch (error) {
    console.error("[APPLICATION_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}


export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; lenderId?: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const id = (await params).id;

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const caller = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true },
    });

    if (!caller) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const {
      fileName,
      fileKey,
      fileUrl,
      docId,
      status,
      lenderId,
      mode,
      potentialLenderIds,
    } = body as {
      fileName?: string;
      fileKey?: string;
      fileUrl?: string;
      docId?: string;
      status?: string;
      lenderId?: string | null;
      mode?: "single" | "multi";
      potentialLenderIds?: string[];
    };

    const application = await prisma.application.findUnique({
      where: { id },
      include: { documents: true },
    });

    if (!application) {
      return new NextResponse("Not found", { status: 404 });
    }

    const allowedStatuses = [
      "OPEN",
      "ASSIGNED_TO_LENDER",
      "IN_PROGRESS",
      "IN_CHAT",
      "REJECTED",
      "APPROVED",
    ];
    if (!allowedStatuses.includes(application.status)) {
      return new NextResponse("Not found", { status: 404 });
    }

    if (!status) {
      if (!docId) {
        return NextResponse.json({ error: "docId required for document update" }, { status: 400 });
      }

      const updatedDoc = await prisma.document.update({
        where: { id: docId },
        data: {
          fileName,
          fileKey,
          fileUrl,
          status: "UPLOADED",
        },
      });

      return NextResponse.json({
        message: "Document updated",
        document: updatedDoc,
      });
    }

    const isAssignAction = status === "ASSIGNED_TO_LENDER" || mode === "multi" || Array.isArray(potentialLenderIds);

    if (status === undefined) {
      return NextResponse.json({ error: "status is required" }, { status: 400 });
    }
    
    if (!Object.values(LoanStatus).includes(status as LoanStatus)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    const validatedStatus = status as LoanStatus;


    if (isAssignAction && caller.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden - admin access required" }, { status: 403 });
    }

    if (status === "ASSIGNED_TO_LENDER" && mode !== "multi" && !lenderId) {
      return NextResponse.json({ error: "lenderId is required when setting ASSIGNED_TO_LENDER" }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      if (mode === "multi" || (Array.isArray(potentialLenderIds) && potentialLenderIds.length > 0)) {
        const ids = Array.isArray(potentialLenderIds) ? potentialLenderIds : [];

        if (ids.length < 1) {
          throw new Error("Provide at least one potential lender id");
        }

        await tx.potentialLender.deleteMany({
          where: { applicationId: id },
        });

        const createManyData = ids.map((lid) => ({ applicationId: id, lenderId: lid }));
        if (createManyData.length > 0) {
          await tx.potentialLender.createMany({
            data: createManyData,
            skipDuplicates: true,
          });
        }

        await tx.application.update({
          where: { id },
          data: {
            lenderId: null,
            ...(validatedStatus ? { status: validatedStatus } : {}),
          },
        });

        await tx.applicationStatusHistory.create({
          data: {
            applicationId: id,
            oldStatus: application.status,
            newStatus: validatedStatus,
            changedById: caller.id,
          },
        });

        const updatedApp = await tx.application.findUnique({ where: { id } });
        const potentials = await tx.potentialLender.findMany({ where: { applicationId: id } });
        return { application: updatedApp, potentialLenderIds: potentials.map(p => p.lenderId) };
      }

      if (lenderId !== undefined) {
        if (lenderId === null) {
          const updated = await tx.application.update({
            where: { id },
            data: {
              ...(validatedStatus ? { status: validatedStatus } : {}),
              lender: { disconnect: true },
            },
          });

          await tx.applicationStatusHistory.create({
            data: {
              applicationId: id,
              oldStatus: application.status,
              newStatus: validatedStatus,
              changedById: caller.id,
            },
          });

          await tx.potentialLender.deleteMany({ where: { applicationId: id } });

          const potentialsAfter = await tx.potentialLender.findMany({ where: { applicationId: id } });
          return { application: updated, potentialLenderIds: potentialsAfter.map(p => p.lenderId) };
        }

        const updated = await tx.application.update({
          where: { id },
          data: {
            ...(validatedStatus ? { status: validatedStatus } : {}),
            lender: { connect: { id: lenderId } },
          },
        });

        await tx.potentialLender.deleteMany({ where: { applicationId: id } });

        await tx.applicationStatusHistory.create({
          data: {
            applicationId: id,
            oldStatus: application.status,
            newStatus: validatedStatus,
            changedById: caller.id,
          },
        });

        return { application: updated, potentialLenderIds: [] };
      }

      const updatedApplication = await tx.application.update({
        where: { id },
        data: { ...(validatedStatus ? { status: validatedStatus } : {}), },
      });

      await tx.applicationStatusHistory.create({
        data: {
          applicationId: id,
          oldStatus: application.status,
          newStatus: validatedStatus,
          changedById: caller.id,
        },
      });

      const existingPotentials = await tx.potentialLender.findMany({ where: { applicationId: id } });
      return { application: updatedApplication, potentialLenderIds: existingPotentials.map(p => p.lenderId) };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[APPLICATION_PATCH_ASSIGN]", error);
    const msg = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}