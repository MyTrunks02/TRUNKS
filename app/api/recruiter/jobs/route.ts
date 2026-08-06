import { prisma } from "@/lib/prisma";
import { requireRole, successResponse, handleApiError, ApiError } from "@/lib/api";
import { UserRole } from "@/lib/generated/prisma/enums";

/**
 * Lists the signed-in recruiter's own job postings (active and inactive)
 * with application counts, for the recruiter dashboard.
 */
export async function GET() {
  try {
    const session = await requireRole(UserRole.RECRUITER);

    const recruiter = await prisma.recruiter.findUnique({ where: { userId: session.userId } });
    if (!recruiter) {
      throw new ApiError("Recruiter profile not found for this account", 404);
    }

    const jobs = await prisma.job.findMany({
      where: { recruiterId: recruiter.id },
      include: {
        company: { select: { id: true, name: true } },
        requiredSkills: { include: { skill: true } },
        _count: { select: { applications: true } },
      },
      orderBy: { postedDate: "desc" },
    });

    return successResponse(jobs);
  } catch (error) {
    return handleApiError(error);
  }
}
