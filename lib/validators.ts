import { z } from "zod";
import { UserRole, ExperienceLevel, JobType, WorkMode, ApplicationStatus } from "./generated/prisma/enums";

// ---------- Auth ----------

export const signupSchema = z
  .object({
    email: z.email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain an uppercase letter")
      .regex(/[0-9]/, "Password must contain a number"),
    firstName: z.string().trim().min(1, "First name is required"),
    lastName: z.string().trim().min(1, "Last name is required"),
    // Admins are provisioned directly, not through public signup.
    role: z.enum([UserRole.CANDIDATE, UserRole.RECRUITER]),
    // Required for recruiters: Recruiter.companyId is non-nullable, so a
    // recruiter account can't be created without a company to attach it to.
    companyName: z.string().trim().min(1).optional(),
  })
  .refine((data) => data.role !== UserRole.RECRUITER || !!data.companyName, {
    message: "Company name is required for recruiter accounts",
    path: ["companyName"],
  });

export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ---------- Job ----------

export const jobSchema = z
  .object({
    title: z.string().trim().min(3, "Title must be at least 3 characters"),
    description: z.string().trim().min(20, "Description must be at least 20 characters"),
    jobType: z.enum(JobType),
    workMode: z.enum(WorkMode),
    location: z.string().trim().optional(),
    minSalary: z.number().int().nonnegative().optional(),
    maxSalary: z.number().int().nonnegative().optional(),
    requiredSkillIds: z.array(z.string().min(1)).min(1, "Select at least one required skill"),
    optionalSkillIds: z.array(z.string().min(1)).default([]),
  })
  .refine(
    (data) => data.minSalary === undefined || data.maxSalary === undefined || data.minSalary <= data.maxSalary,
    { message: "Minimum salary cannot exceed maximum salary", path: ["minSalary"] }
  );

export type JobInput = z.infer<typeof jobSchema>;

// ---------- Candidate profile ----------

export const candidateProfileSchema = z.object({
  title: z.string().trim().max(120).optional(),
  bio: z.string().trim().max(2000).optional(),
  location: z.string().trim().max(120).optional(),
  experience: z.enum(ExperienceLevel).optional(),
  resumeUrl: z.url().optional(),
});

export type CandidateProfileInput = z.infer<typeof candidateProfileSchema>;

export const addCandidateSkillsSchema = z.object({
  skillIds: z.array(z.string().min(1)).min(1, "Provide at least one skill id"),
});

export type AddCandidateSkillsInput = z.infer<typeof addCandidateSkillsSchema>;

// ---------- Application ----------

export const updateApplicationStatusSchema = z.object({
  status: z.enum(ApplicationStatus),
});

export type UpdateApplicationStatusInput = z.infer<typeof updateApplicationStatusSchema>;
