import { hash } from "bcryptjs";
import { prisma } from "../lib/prisma";
import { JobType, UserRole, VerificationStatus, WorkMode } from "../lib/generated/prisma/enums";

// Deliberately not `import "dotenv/config"` here: prisma.config.ts already
// loads `.env.local` (where DATABASE_URL actually lives) and, when this
// script runs via `prisma db seed`, that loaded env is inherited by this
// process. Loading dotenv here too would load `.env` instead and shadow it
// with the wrong value.

const SALT_ROUNDS = 12;
const SEED_RECRUITER_PASSWORD = "TrunksSeed123";

const SKILLS_BY_CATEGORY: Record<string, string[]> = {
  Programming: ["JavaScript", "TypeScript", "Python", "Java", "Go", "Rust"],
  Frontend: ["React", "Vue", "Angular", "Tailwind CSS", "HTML/CSS", "Next.js"],
  Backend: ["Node.js", "Express", "Django", "Spring Boot", "FastAPI"],
  Database: ["PostgreSQL", "MongoDB", "MySQL", "Redis"],
  Tools: ["Git", "Linux", "Docker", "AWS", "Figma", "VS Code"],
  DevOps: ["Kubernetes", "CI/CD", "GitHub Actions", "Jenkins"],
};

async function seedSkills(): Promise<Map<string, string>> {
  const skillIdByName = new Map<string, string>();

  for (const [category, names] of Object.entries(SKILLS_BY_CATEGORY)) {
    for (const name of names) {
      const skill = await prisma.skill.upsert({
        where: { name },
        update: { category },
        create: { name, category },
      });
      skillIdByName.set(name, skill.id);
    }
    console.log(`  Seeded ${names.length} skills in "${category}"`);
  }

  console.log(`Skills seeded: ${skillIdByName.size} total`);
  return skillIdByName;
}

async function seedCompany() {
  const company = await prisma.company.upsert({
    where: { name: "TechCorp India" },
    update: {},
    create: {
      name: "TechCorp India",
      description: "A technology company building scalable software solutions out of Bangalore.",
      website: "https://techcorp.in",
      location: "Bangalore, India",
      industry: "Technology",
      verificationStatus: VerificationStatus.VERIFIED,
    },
  });

  console.log(`Company ready: ${company.name} (${company.id})`);
  return company;
}

async function seedRecruiter(companyId: string) {
  const passwordHash = await hash(SEED_RECRUITER_PASSWORD, SALT_ROUNDS);

  const recruiterUser = await prisma.user.upsert({
    where: { email: "recruiter@techcorp.in" },
    update: {},
    create: {
      email: "recruiter@techcorp.in",
      firstName: "Priya",
      lastName: "Sharma",
      role: UserRole.RECRUITER,
      passwordHash,
      emailVerified: true,
    },
  });

  const recruiter = await prisma.recruiter.upsert({
    where: { userId: recruiterUser.id },
    update: { companyId },
    create: {
      userId: recruiterUser.id,
      companyId,
      title: "Technical Recruiter",
      verificationStatus: VerificationStatus.VERIFIED,
    },
  });

  console.log(`Recruiter ready: ${recruiterUser.email} (${recruiter.id})`);
  return recruiter;
}

function getSkillId(skillIdByName: Map<string, string>, name: string): string {
  const id = skillIdByName.get(name);
  if (!id) {
    throw new Error(`Cannot seed job requirements: skill "${name}" was not seeded`);
  }
  return id;
}

interface JobSeedSpec {
  id: string;
  title: string;
  description: string;
  jobType: JobType;
  workMode: WorkMode;
  location: string;
  minSalary: number;
  maxSalary: number;
  requiredSkills: string[];
  optionalSkills: string[];
}

const JOB_SPECS: JobSeedSpec[] = [
  {
    id: "seed-job-fullstack-developer",
    title: "Senior Full Stack Developer",
    description:
      "Own end-to-end delivery of customer-facing features across our React frontend and Node.js backend, working closely with product and design.",
    jobType: JobType.FULL_TIME,
    workMode: WorkMode.HYBRID,
    location: "Bangalore, India",
    minSalary: 1800000,
    maxSalary: 3000000,
    requiredSkills: ["JavaScript", "React", "Node.js", "PostgreSQL"],
    optionalSkills: ["TypeScript", "Docker"],
  },
  {
    id: "seed-job-devops-engineer",
    title: "DevOps Engineer",
    description:
      "Build and operate the CI/CD pipelines and Kubernetes infrastructure that ship our platform to production every day.",
    jobType: JobType.FULL_TIME,
    workMode: WorkMode.REMOTE,
    location: "Remote - India",
    minSalary: 1500000,
    maxSalary: 2500000,
    requiredSkills: ["Docker", "Kubernetes", "AWS", "CI/CD"],
    optionalSkills: ["GitHub Actions", "Linux"],
  },
  {
    id: "seed-job-frontend-developer",
    title: "Frontend Developer (React)",
    description:
      "Build polished, accessible UI for our candidate and recruiter dashboards using React and Tailwind CSS.",
    jobType: JobType.FULL_TIME,
    workMode: WorkMode.ONSITE,
    location: "Bangalore, India",
    minSalary: 1200000,
    maxSalary: 2000000,
    requiredSkills: ["React", "JavaScript", "Tailwind CSS", "HTML/CSS"],
    optionalSkills: ["Next.js", "TypeScript"],
  },
];

async function seedJobs(companyId: string, recruiterId: string, skillIdByName: Map<string, string>) {
  for (const spec of JOB_SPECS) {
    const job = await prisma.job.upsert({
      where: { id: spec.id },
      update: {
        title: spec.title,
        description: spec.description,
        jobType: spec.jobType,
        workMode: spec.workMode,
        location: spec.location,
        minSalary: spec.minSalary,
        maxSalary: spec.maxSalary,
        isActive: true,
      },
      create: {
        id: spec.id,
        companyId,
        recruiterId,
        title: spec.title,
        description: spec.description,
        jobType: spec.jobType,
        workMode: spec.workMode,
        location: spec.location,
        minSalary: spec.minSalary,
        maxSalary: spec.maxSalary,
        isActive: true,
      },
    });

    const requirements = [
      ...spec.requiredSkills.map((name) => ({ skillId: getSkillId(skillIdByName, name), isRequired: true })),
      ...spec.optionalSkills.map((name) => ({ skillId: getSkillId(skillIdByName, name), isRequired: false })),
    ];

    for (const requirement of requirements) {
      await prisma.jobRequiredSkill.upsert({
        where: { jobId_skillId: { jobId: job.id, skillId: requirement.skillId } },
        update: { isRequired: requirement.isRequired },
        create: { jobId: job.id, skillId: requirement.skillId, isRequired: requirement.isRequired },
      });
    }

    console.log(`  Seeded job "${job.title}" with ${requirements.length} required/optional skills`);
  }

  console.log(`Jobs seeded: ${JOB_SPECS.length} total`);
}

async function main() {
  console.log("Seeding TRUNKS database...\n");

  console.log("Seeding skills...");
  const skillIdByName = await seedSkills();

  console.log("\nSeeding company...");
  const company = await seedCompany();

  console.log("\nSeeding recruiter...");
  const recruiter = await seedRecruiter(company.id);

  console.log("\nSeeding jobs...");
  await seedJobs(company.id, recruiter.id, skillIdByName);

  console.log("\nSeed complete.");
}

main()
  .catch((error: unknown) => {
    console.error("\nSeeding failed:");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
