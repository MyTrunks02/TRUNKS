"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { APIResponse } from "@/lib/api";

interface JobSkill {
  isRequired: boolean;
  skill: { id: string; name: string };
}

interface JobDetail {
  id: string;
  title: string;
  description: string;
  jobType: string;
  workMode: string;
  location: string | null;
  minSalary: number | null;
  maxSalary: number | null;
  postedDate: string;
  isActive: boolean;
  company: {
    id: string;
    name: string;
    location: string | null;
    industry: string | null;
    website: string | null;
    description: string | null;
  };
  requiredSkills: JobSkill[];
}

function formatSalary(min: number | null, max: number | null): string | null {
  if (min === null && max === null) return null;
  if (min !== null && max !== null) return `$${min.toLocaleString()} – $${max.toLocaleString()}`;
  return `$${(min ?? max)!.toLocaleString()}+`;
}

export default function JobDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const jobId = params.id;

  const [job, setJob] = useState<JobDetail | null>(null);
  const [matchPercentage, setMatchPercentage] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [hasApplied, setHasApplied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadJob() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/jobs/${jobId}`);
        const result = (await response.json()) as APIResponse<JobDetail>;

        if (cancelled) return;

        if (!result.success) {
          setError(result.error);
          return;
        }

        setJob(result.data);

        try {
          const matchResponse = await fetch(`/api/jobs/${jobId}/matching`);
          const matchResult = (await matchResponse.json()) as APIResponse<{ matchPercentage: number }>;
          if (!cancelled && matchResult.success) {
            setMatchPercentage(matchResult.data.matchPercentage);
          }
        } catch {
          // Match percentage is a nice-to-have; ignore failures (e.g. not signed in as a candidate).
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load this job. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    if (jobId) loadJob();

    return () => {
      cancelled = true;
    };
  }, [jobId]);

  async function handleApply() {
    setIsApplying(true);
    setApplyError(null);

    try {
      const response = await fetch(`/api/jobs/${jobId}/apply`, { method: "POST" });
      const result = (await response.json()) as APIResponse<unknown>;

      if (!result.success) {
        if (response.status === 401) {
          router.push("/login");
          return;
        }
        setApplyError(result.error);
        return;
      }

      setHasApplied(true);
    } catch {
      setApplyError("Failed to apply. Please try again.");
    } finally {
      setIsApplying(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-navy-500 dark:text-navy-100">Loading job…</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="flex flex-1 items-center justify-center px-6">
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400">
          {error ?? "Job not found."}
        </p>
      </div>
    );
  }

  const salary = formatSalary(job.minSalary, job.maxSalary);
  const requiredSkills = job.requiredSkills.filter((entry) => entry.isRequired);
  const optionalSkills = job.requiredSkills.filter((entry) => !entry.isRequired);

  return (
    <div className="flex-1 px-6 py-12">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <Link href="/jobs" className="w-fit text-sm font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400">
          ← Back to jobs
        </Link>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-6 lg:col-span-2">
            <div className="animate-fade-in-up rounded-2xl border border-navy-100 bg-white p-6 shadow-sm dark:border-navy-800 dark:bg-navy-900">
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                <div>
                  <h1 className="text-2xl font-semibold text-navy-950 dark:text-white">{job.title}</h1>
                  <p className="mt-1 text-sm text-navy-600 dark:text-navy-100">
                    {job.company.name}
                    {job.location ? ` · ${job.location}` : ""}
                  </p>
                </div>
                {!job.isActive && (
                  <span className="shrink-0 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700 dark:bg-red-500/10 dark:text-red-400">
                    Closed
                  </span>
                )}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-navy-50 px-3 py-1 font-medium text-navy-700 dark:bg-navy-800 dark:text-navy-100">
                  {job.jobType.replace("_", " ")}
                </span>
                <span className="rounded-full bg-navy-50 px-3 py-1 font-medium text-navy-700 dark:bg-navy-800 dark:text-navy-100">
                  {job.workMode}
                </span>
                {salary && (
                  <span className="rounded-full bg-gold-50 px-3 py-1 font-medium text-gold-700 dark:bg-gold-500/10 dark:text-gold-400">
                    {salary}
                  </span>
                )}
                <span className="rounded-full bg-navy-50 px-3 py-1 font-medium text-navy-700 dark:bg-navy-800 dark:text-navy-100">
                  Posted {new Date(job.postedDate).toLocaleDateString()}
                </span>
              </div>

              {matchPercentage !== null && (
                <div className="mt-6 flex items-center gap-4 rounded-xl border border-gold-500/30 bg-gold-50 p-4 dark:bg-gold-500/10">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gold-500 text-sm font-bold text-navy-950">
                    {Math.round(matchPercentage)}%
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy-950 dark:text-white">Your match score</p>
                    <p className="text-xs text-navy-600 dark:text-navy-100">Based on skills TRUNKS has verified on your profile.</p>
                  </div>
                </div>
              )}

              <div className="mt-6">
                <h2 className="text-sm font-semibold text-navy-950 dark:text-white">About this role</h2>
                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-navy-600 dark:text-navy-100">
                  {job.description}
                </p>
              </div>

              {requiredSkills.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-sm font-semibold text-navy-950 dark:text-white">Required skills</h2>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {requiredSkills.map(({ skill }) => (
                      <span
                        key={skill.id}
                        className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700 dark:bg-teal-500/10 dark:text-teal-400"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {optionalSkills.length > 0 && (
                <div className="mt-4">
                  <h2 className="text-sm font-semibold text-navy-950 dark:text-white">Nice to have</h2>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {optionalSkills.map(({ skill }) => (
                      <span
                        key={skill.id}
                        className="rounded-full bg-navy-50 px-3 py-1 text-xs font-medium text-navy-700 dark:bg-navy-800 dark:text-navy-100"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {job.company.description && (
              <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-sm dark:border-navy-800 dark:bg-navy-900">
                <h2 className="text-sm font-semibold text-navy-950 dark:text-white">About {job.company.name}</h2>
                <p className="mt-2 text-sm leading-6 text-navy-600 dark:text-navy-100">{job.company.description}</p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <div className="sticky top-24 flex flex-col gap-4 rounded-2xl border border-navy-100 bg-white p-6 shadow-sm dark:border-navy-800 dark:bg-navy-900">
              <button
                type="button"
                onClick={handleApply}
                disabled={hasApplied || isApplying || !job.isActive}
                className="flex h-11 items-center justify-center rounded-full bg-teal-500 px-6 text-sm font-medium text-white shadow-sm shadow-teal-500/30 transition-all hover:-translate-y-0.5 hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {hasApplied ? "Applied" : isApplying ? "Applying…" : job.isActive ? "Apply Now" : "No longer accepting applications"}
              </button>
              {applyError && <p className="text-sm text-red-600 dark:text-red-400">{applyError}</p>}

              <div className="flex flex-col gap-2 border-t border-navy-100 pt-4 text-sm dark:border-navy-800">
                <div className="flex justify-between">
                  <span className="text-navy-500 dark:text-navy-100">Company</span>
                  <span className="font-medium text-navy-950 dark:text-white">{job.company.name}</span>
                </div>
                {job.company.industry && (
                  <div className="flex justify-between">
                    <span className="text-navy-500 dark:text-navy-100">Industry</span>
                    <span className="font-medium text-navy-950 dark:text-white">{job.company.industry}</span>
                  </div>
                )}
                {job.company.location && (
                  <div className="flex justify-between">
                    <span className="text-navy-500 dark:text-navy-100">Location</span>
                    <span className="font-medium text-navy-950 dark:text-white">{job.company.location}</span>
                  </div>
                )}
                {job.company.website && (
                  <div className="flex justify-between gap-2">
                    <span className="shrink-0 text-navy-500 dark:text-navy-100">Website</span>
                    <a
                      href={job.company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400"
                    >
                      {job.company.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
