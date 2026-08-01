import { prisma } from "@/lib/prisma";
import { requireRole, successResponse, handleApiError, ApiError } from "@/lib/api";
import { UserRole, ApplicationStatus } from "@/lib/generated/prisma/enums";

/**
 * Returns the signed-in candidate's own profile plus lightweight dashboard
 * stats. Client pages have no other way to learn "which candidate am I" —
 * the session cookie is httpOnly, so this is the only place that can hand
 * the candidate id (and derived counts) to the browser.
 */
export async function GET() {
  try {
    const session = await requireRole(UserRole.CANDIDATE);

    const candidate = await prisma.candidate.findUnique({
      where: { userId: session.userId },
      include: { user: { select: { firstName: true, lastName: true, email: true } } },
    });

    if (!candidate) {
      throw new ApiError("Candidate profile not found for this account", 404);
    }

    const [totalApplications, shortlistedCount] = await Promise.all([
      prisma.application.count({ where: { candidateId: candidate.id } }),
      prisma.application.count({
        where: { candidateId: candidate.id, status: ApplicationStatus.SHORTLISTED },
      }),
    ]);

    return successResponse({
      candidate,
      stats: { totalApplications, shortlistedCount },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
