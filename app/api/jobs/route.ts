import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, successResponse, handleApiError, ApiError } from "@/lib/api";
import { jobSchema } from "@/lib/validators";
import { JobType, UserRole, WorkMode } from "@/lib/generated/prisma/enums";
import type { Prisma } from "@/lib/generated/prisma/client";

const MAX_PAGE_SIZE = 50;
const DEFAULT_PAGE_SIZE = 20;

/**
 * Lists active jobs with optional filters. Public — no auth required.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const jobType = searchParams.get("jobType");
    const workMode = searchParams.get("workMode");
    const location = searchParams.get("location");
    const search = searchParams.get("search");
    const minSalary = searchParams.get("minSalary");
    const maxSalary = searchParams.get("maxSalary");
    const page = Math.max(1, Number(searchParams.get("page") ?? 1) || 1);
    const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, Number(searchParams.get("limit") ?? DEFAULT_PAGE_SIZE) || DEFAULT_PAGE_SIZE));

    const where: Prisma.JobWhereInput = { isActive: true };

    if (jobType && (Object.values(JobType) as string[]).includes(jobType)) {
      where.jobType = jobType as JobType;
    }

    if (workMode && (Object.values(WorkMode) as string[]).includes(workMode)) {
      where.workMode = workMode as WorkMode;
    }

    if (location) {
      where.location = { contains: location };
    }

    if (search) {
      where.OR = [{ title: { contains: search } }, { description: { contains: search } }];
    }

    // A job matches a salary filter if its own range overlaps the query.
    if (minSalary) {
      where.maxSalary = { gte: Number(minSalary) };
    }
    if (maxSalary) {
      where.minSalary = { lte: Number(maxSalary) };
    }

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: {
          company: { select: { id: true, name: true, location: true } },
          requiredSkills: { include: { skill: true } },
        },
        orderBy: { postedDate: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.job.count({ where }),
    ]);

    return successResponse({ jobs, total, page, limit });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Creates a job posting for the authenticated recruiter's company.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await requireRole(UserRole.RECRUITER);

    const recruiter = await prisma.recruiter.findUnique({ where: { userId: session.userId } });
    if (!recruiter) {
      throw new ApiError("Recruiter profile not found for this account", 404);
    }

    const body = await request.json();
    const parsed = jobSchema.safeParse(body);

    if (!parsed.success) {
      throw new ApiError(parsed.error.issues[0]?.message ?? "Invalid job data", 400);
    }

    const { requiredSkillIds, optionalSkillIds, ...jobData } = parsed.data;

    const uniqueRequiredSkillIds = [...new Set(requiredSkillIds)];
    const requiredSet = new Set(uniqueRequiredSkillIds);
    const uniqueOptionalSkillIds = [...new Set(optionalSkillIds)].filter(
      (skillId) => !requiredSet.has(skillId)
    );
    const allSkillIds = [...uniqueRequiredSkillIds, ...uniqueOptionalSkillIds];

    const existingSkills = await prisma.skill.findMany({
      where: { id: { in: allSkillIds } },
      select: { id: true },
    });

    if (existingSkills.length !== allSkillIds.length) {
      throw new ApiError("One or more skill ids do not exist", 400);
    }

    const job = await prisma.job.create({
      data: {
        ...jobData,
        companyId: recruiter.companyId,
        recruiterId: recruiter.id,
        requiredSkills: {
          create: [
            ...uniqueRequiredSkillIds.map((skillId) => ({ skillId, isRequired: true })),
            ...uniqueOptionalSkillIds.map((skillId) => ({ skillId, isRequired: false })),
          ],
        },
      },
      include: { requiredSkills: { include: { skill: true } } },
    });

    return successResponse(job, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
