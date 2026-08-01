import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, successResponse, handleApiError, ApiError } from "@/lib/api";
import { addCandidateSkillsSchema } from "@/lib/validators";
import { AssessmentStatus, UserRole } from "@/lib/generated/prisma/enums";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    const candidate = await prisma.candidate.findUnique({ where: { id } });
    if (!candidate) {
      throw new ApiError("Candidate not found", 404);
    }

    const isOwner = candidate.userId === session.userId;
    if (!isOwner && session.role !== UserRole.ADMIN) {
      throw new ApiError("You can only add skills to your own candidate profile", 403);
    }

    const body = await request.json();
    const parsed = addCandidateSkillsSchema.safeParse(body);

    if (!parsed.success) {
      throw new ApiError(parsed.error.issues[0]?.message ?? "Invalid request", 400);
    }

    const uniqueSkillIds = [...new Set(parsed.data.skillIds)];

    const skills = await prisma.skill.findMany({
      where: { id: { in: uniqueSkillIds } },
      select: { id: true },
    });

    if (skills.length !== uniqueSkillIds.length) {
      throw new ApiError("One or more skill ids do not exist", 400);
    }

    // SQLite doesn't support `skipDuplicates`, so existing candidate/skill
    // pairs are filtered out before insert instead of relying on it.
    const existing = await prisma.assessment.findMany({
      where: { candidateId: id, skillId: { in: uniqueSkillIds } },
      select: { skillId: true },
    });
    const existingSkillIds = new Set(existing.map((assessment) => assessment.skillId));
    const newSkillIds = uniqueSkillIds.filter((skillId) => !existingSkillIds.has(skillId));

    if (newSkillIds.length > 0) {
      await prisma.assessment.createMany({
        data: newSkillIds.map((skillId) => ({
          candidateId: id,
          skillId,
          status: AssessmentStatus.PENDING,
        })),
      });
    }

    const assessments = await prisma.assessment.findMany({
      where: { candidateId: id },
      include: { skill: true },
    });

    return successResponse(assessments, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
