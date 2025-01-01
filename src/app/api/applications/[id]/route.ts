import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    const id = (await params).id;

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!id) {
      return new NextResponse("Missing application ID", { status: 400 });
    }

    const application = await prisma.mortgageApplication.findUnique({
      where: {
        id: id,
        userId: session.user.id
      },
      include: {
        documents: true
      }
    });

    if (!application) {
      return new NextResponse("Not found", { status: 404 }); 
    }

    return NextResponse.json(application);

  } catch (error) {
    console.error("[APPLICATION_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
