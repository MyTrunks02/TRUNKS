import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, successResponse, handleApiError, ApiError } from "@/lib/api";
import { candidateProfileSchema } from "@/lib/validators";
import { UserRole } from "@/lib/generated/prisma/enums";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    await requireAuth();
    const { id } = await params;

    const candidate = await prisma.candidate.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true } },
      },
    });

    if (!candidate) {
      throw new ApiError("Candidate not found", 404);
    }

    return successResponse(candidate);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    const candidate = await prisma.candidate.findUnique({ where: { id } });
    if (!candidate) {
      throw new ApiError("Candidate not found", 404);
    }

    const isOwner = candidate.userId === session.userId;
    if (!isOwner && session.role !== UserRole.ADMIN) {
      throw new ApiError("You can only edit your own candidate profile", 403);
    }

    const body = await request.json();
    const parsed = candidateProfileSchema.safeParse(body);

    if (!parsed.success) {
      throw new ApiError(parsed.error.issues[0]?.message ?? "Invalid profile data", 400);
    }

    const updated = await prisma.candidate.update({
      where: { id },
      data: parsed.data,
    });

    return successResponse(updated);
  } catch (error) {
    return handleApiError(error);
  }
}
