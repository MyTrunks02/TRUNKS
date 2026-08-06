import { prisma } from "@/lib/prisma";
import { successResponse, handleApiError } from "@/lib/api";

/**
 * Lists all skills. Public — used to populate skill pickers (candidate
 * profile, job posting form).
 */
export async function GET() {
  try {
    const skills = await prisma.skill.findMany({ orderBy: { name: "asc" } });
    return successResponse(skills);
  } catch (error) {
    return handleApiError(error);
  }
}
