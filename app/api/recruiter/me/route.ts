import { prisma } from "@/lib/prisma";
import { requireRole, successResponse, handleApiError, ApiError } from "@/lib/api";
import { UserRole } from "@/lib/generated/prisma/enums";

/**
 * Returns the signed-in recruiter's own profile, company, and lightweight
 * dashboard stats. Mirrors GET /api/candidates/me for the recruiter side.
 */
export async function GET() {
  try {
    const session = await requireRole(UserRole.RECRUITER);

    const recruiter = await prisma.recruiter.findUnique({
      where: { userId: session.userId },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        company: { select: { id: true, name: true, verificationStatus: true } },
      },
    });

    if (!recruiter) {
      throw new ApiError("Recruiter profile not found for this account", 404);
    }

    const [activeJobCount, totalApplications] = await Promise.all([
      prisma.job.count({ where: { recruiterId: recruiter.id, isActive: true } }),
      prisma.application.count({ where: { recruiterId: recruiter.id } }),
    ]);

    return successResponse({
      recruiter,
      stats: { activeJobCount, totalApplications },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
