import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, successResponse, handleApiError, ApiError } from "@/lib/api";
import { updateApplicationStatusSchema } from "@/lib/validators";
import { sendApplicationStatusEmail } from "@/lib/email";
import { UserRole } from "@/lib/generated/prisma/enums";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireRole(UserRole.RECRUITER, UserRole.ADMIN);
    const { id } = await params;

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        job: { select: { title: true } },
        candidate: { include: { user: { select: { email: true } } } },
        recruiter: { select: { userId: true } },
      },
    });

    if (!application) {
      throw new ApiError("Application not found", 404);
    }

    const isOwningRecruiter = application.recruiter.userId === session.userId;
    if (session.role === UserRole.RECRUITER && !isOwningRecruiter) {
      throw new ApiError("You can only update applications for your own job postings", 403);
    }

    const body = await request.json();
    const parsed = updateApplicationStatusSchema.safeParse(body);

    if (!parsed.success) {
      throw new ApiError(parsed.error.issues[0]?.message ?? "Invalid status", 400);
    }

    const { status: newStatus } = parsed.data;
    const oldStatus = application.status;

    if (oldStatus === newStatus) {
      throw new ApiError("Application is already in this status", 409);
    }

    const updatedApplication = await prisma.$transaction(async (tx) => {
      const updated = await tx.application.update({
        where: { id },
        data: { status: newStatus },
      });

      await tx.applicationStatusHistory.create({
        data: { applicationId: id, oldStatus, newStatus },
      });

      return updated;
    });

    try {
      await sendApplicationStatusEmail(application.candidate.user.email, application.job.title, newStatus);
    } catch (error) {
      console.error("Failed to send application status email:", error);
    }

    return successResponse(updatedApplication);
  } catch (error) {
    return handleApiError(error);
  }
}
