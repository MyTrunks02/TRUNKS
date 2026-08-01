import { prisma } from "./prisma";
import { AssessmentStatus } from "./generated/prisma/enums";

// A completed, scored Assessment is treated as proof of a candidate's
// proficiency in a skill; required skills count for more of the final
// percentage than optional ("nice to have") ones.
const REQUIRED_SKILL_WEIGHT = 0.7;
const OPTIONAL_SKILL_WEIGHT = 0.3;

export interface SkillRequirement {
  skillId: string;
  isRequired: boolean;
}

export interface CandidateSkillScore {
  skillId: string;
  score: number; // 0-100, from a completed Assessment
}

/**
 * Computes a 0-100 match percentage between a candidate's assessed skills
 * and a job's required/optional skills. A skill the candidate has no
 * completed assessment for contributes 0 toward its group's average.
 */
export function computeSkillMatch(
  candidateSkills: CandidateSkillScore[],
  jobSkills: SkillRequirement[]
): number {
  const required = jobSkills.filter((skill) => skill.isRequired);
  const optional = jobSkills.filter((skill) => !skill.isRequired);

  if (required.length === 0 && optional.length === 0) {
    return 0;
  }

  const averageScore = (skills: SkillRequirement[]): number => {
    if (skills.length === 0) return 0;
    const total = skills.reduce((sum, skill) => {
      const match = candidateSkills.find((candidate) => candidate.skillId === skill.skillId);
      return sum + (match?.score ?? 0);
    }, 0);
    return total / skills.length;
  };

  if (required.length === 0) {
    return Math.round(averageScore(optional));
  }

  if (optional.length === 0) {
    return Math.round(averageScore(required));
  }

  return Math.round(averageScore(required) * REQUIRED_SKILL_WEIGHT + averageScore(optional) * OPTIONAL_SKILL_WEIGHT);
}

/**
 * Loads a candidate's completed assessments and a job's required skills from
 * the database, then computes their match percentage.
 */
export async function calculateMatchPercentage(candidateId: string, jobId: string): Promise<number> {
  const [assessments, jobSkills] = await Promise.all([
    prisma.assessment.findMany({
      where: { candidateId, status: AssessmentStatus.COMPLETED, score: { not: null } },
      select: { skillId: true, score: true },
    }),
    prisma.jobRequiredSkill.findMany({
      where: { jobId },
      select: { skillId: true, isRequired: true },
    }),
  ]);

  const candidateSkills: CandidateSkillScore[] = assessments.map((assessment) => ({
    skillId: assessment.skillId,
    score: assessment.score ?? 0,
  }));

  return computeSkillMatch(candidateSkills, jobSkills);
}

/**
 * Calculates and persists a candidate's match percentage for a single job
 * into `JobMatchingResult`.
 */
export async function matchCandidateToJob(candidateId: string, jobId: string) {
  const matchPercentage = await calculateMatchPercentage(candidateId, jobId);

  return prisma.jobMatchingResult.upsert({
    where: { candidateId_jobId: { candidateId, jobId } },
    create: { candidateId, jobId, matchPercentage },
    update: { matchPercentage },
  });
}

/**
 * Recomputes match results for a candidate against every currently active
 * job, ordered best match first. Intended to run after a candidate updates
 * their skills/assessments.
 */
export async function matchCandidateToActiveJobs(candidateId: string) {
  const activeJobs = await prisma.job.findMany({
    where: { isActive: true },
    select: { id: true },
  });

  const results = await Promise.all(activeJobs.map((job) => matchCandidateToJob(candidateId, job.id)));

  return results.sort((a, b) => b.matchPercentage - a.matchPercentage);
}
