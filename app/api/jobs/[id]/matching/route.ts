import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, successResponse, handleApiError, ApiError } from "@/lib/api";
import { calculateMatchPercentage } from "@/lib/matching";
import { UserRole } from "@/lib/generated/prisma/enums";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * Calculates (without persisting — this is a read-only GET) the current
 * candidate's match percentage against the given job.
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireRole(UserRole.CANDIDATE);
    const { id: jobId } = await params;

    const candidate = await prisma.candidate.findUnique({ where: { userId: session.userId } });
    if (!candidate) {
      throw new ApiError("Candidate profile not found for this account", 404);
    }

    const job = await prisma.job.findUnique({ where: { id: jobId }, select: { id: true } });
    if (!job) {
      throw new ApiError("Job not found", 404);
    }

    const matchPercentage = await calculateMatchPercentage(candidate.id, jobId);

    return successResponse({ jobId, candidateId: candidate.id, matchPercentage });
  } catch (error) {
    return handleApiError(error);
  }
}
