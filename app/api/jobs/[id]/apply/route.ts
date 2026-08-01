import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, successResponse, handleApiError, ApiError } from "@/lib/api";
import { matchCandidateToJob } from "@/lib/matching";
import { sendApplicationStatusEmail } from "@/lib/email";
import { ApplicationStatus, UserRole } from "@/lib/generated/prisma/enums";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireRole(UserRole.CANDIDATE);
    const { id: jobId } = await params;

    const candidate = await prisma.candidate.findUnique({ where: { userId: session.userId } });
    if (!candidate) {
      throw new ApiError("Candidate profile not found for this account", 404);
    }

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job || !job.isActive) {
      throw new ApiError("Job not found or no longer accepting applications", 404);
    }

    const existingApplication = await prisma.application.findUnique({
      where: { candidateId_jobId: { candidateId: candidate.id, jobId } },
    });

    if (existingApplication) {
      throw new ApiError("You have already applied to this job", 409);
    }

    // Persisted (not just calculated) since an application is the kind of
    // mutation a match percentage should be pinned to going forward.
    const { matchPercentage } = await matchCandidateToJob(candidate.id, jobId);

    const application = await prisma.$transaction(async (tx) => {
      const createdApplication = await tx.application.create({
        data: {
          candidateId: candidate.id,
          jobId,
          recruiterId: job.recruiterId,
          status: ApplicationStatus.APPLIED,
          matchPercentage,
        },
      });

      await tx.applicationStatusHistory.create({
        data: {
          applicationId: createdApplication.id,
          oldStatus: null,
          newStatus: ApplicationStatus.APPLIED,
        },
      });

      return createdApplication;
    });

    try {
      const user = await prisma.user.findUnique({ where: { id: session.userId } });
      if (user) {
        await sendApplicationStatusEmail(user.email, job.title, ApplicationStatus.APPLIED);
      }
    } catch (error) {
      console.error("Failed to send application confirmation email:", error);
    }

    return successResponse(application, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
