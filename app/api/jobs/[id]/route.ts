import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, handleApiError, ApiError } from "@/lib/api";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * Returns a single job with its company and required/optional skills.
 * Public — no auth required, mirrors GET /api/jobs.
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        company: { select: { id: true, name: true, location: true, industry: true, website: true, description: true } },
        recruiter: { select: { id: true, title: true } },
        requiredSkills: { include: { skill: true } },
      },
    });

    if (!job) {
      throw new ApiError("Job not found", 404);
    }

    return successResponse(job);
  } catch (error) {
    return handleApiError(error);
  }
}
