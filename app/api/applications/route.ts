import { prisma } from "@/lib/prisma";
import { requireAuth, successResponse, handleApiError, ApiError } from "@/lib/api";
import { UserRole } from "@/lib/generated/prisma/enums";

/**
 * Lists applications for the signed-in user: a candidate sees their own
 * applications, a recruiter sees applications submitted to their postings.
 */
export async function GET() {
  try {
    const session = await requireAuth();

    if (session.role === UserRole.CANDIDATE) {
      const candidate = await prisma.candidate.findUnique({ where: { userId: session.userId } });
      if (!candidate) {
        throw new ApiError("Candidate profile not found for this account", 404);
      }

      const applications = await prisma.application.findMany({
        where: { candidateId: candidate.id },
        include: {
          job: { include: { company: { select: { id: true, name: true, location: true } } } },
        },
        orderBy: { appliedAt: "desc" },
      });

      return successResponse(applications);
    }

    if (session.role === UserRole.RECRUITER) {
      const recruiter = await prisma.recruiter.findUnique({ where: { userId: session.userId } });
      if (!recruiter) {
        throw new ApiError("Recruiter profile not found for this account", 404);
      }

      const applications = await prisma.application.findMany({
        where: { recruiterId: recruiter.id },
        include: {
          job: { select: { id: true, title: true } },
          candidate: {
            include: { user: { select: { firstName: true, lastName: true, email: true } } },
          },
        },
        orderBy: { appliedAt: "desc" },
      });

      return successResponse(applications);
    }

    throw new ApiError("Insufficient permissions", 403);
  } catch (error) {
    return handleApiError(error);
  }
}
