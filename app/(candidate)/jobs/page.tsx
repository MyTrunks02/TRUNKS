"use client";

import { useEffect, useState, type FormEvent } from "react";
import { JobType } from "@/lib/generated/prisma/enums";
import type { APIResponse } from "@/lib/api";

interface JobSkill {
  isRequired: boolean;
  skill: { id: string; name: string };
}

interface JobListing {
  id: string;
  title: string;
  description: string;
  jobType: string;
  workMode: string;
  location: string | null;
  minSalary: number | null;
  maxSalary: number | null;
  company: { id: string; name: string; location: string | null };
  requiredSkills: JobSkill[];
}

interface JobsResponse {
  jobs: JobListing[];
  total: number;
  page: number;
  limit: number;
}

const JOB_TYPE_OPTIONS = [
  { value: "", label: "All job types" },
  { value: JobType.FULL_TIME, label: "Full-time" },
  { value: JobType.PART_TIME, label: "Part-time" },
  { value: JobType.CONTRACT, label: "Contract" },
  { value: JobType.INTERNSHIP, label: "Internship" },
  { value: JobType.FREELANCE, label: "Freelance" },
] as const;

function formatSalary(min: number | null, max: number | null): string | null {
  if (min === null && max === null) return null;
  if (min !== null && max !== null) return `$${min.toLocaleString()} – $${max.toLocaleString()}`;
  return `$${(min ?? max)!.toLocaleString()}+`;
}

export default function CandidateJobsPage() {
  const [locationInput, setLocationInput] = useState("");
  const [jobTypeInput, setJobTypeInput] = useState("");
  const [filters, setFilters] = useState({ location: "", jobType: "" });
  const [page, setPage] = useState(1);

  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(20);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);
  const [applyErrors, setApplyErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;

    async function loadJobs() {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({ page: String(page) });
      if (filters.location) params.set("location", filters.location);
      if (filters.jobType) params.set("jobType", filters.jobType);

      try {
        const response = await fetch(`/api/jobs?${params.toString()}`);
        const result = (await response.json()) as APIResponse<JobsResponse>;

        if (cancelled) return;

        if (!result.success) {
          setError(result.error);
          return;
        }

        setJobs(result.data.jobs);
        setTotal(result.data.total);
        setLimit(result.data.limit);
      } catch {
        if (!cancelled) {
          setError("Failed to load jobs. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadJobs();

    return () => {
      cancelled = true;
    };
  }, [filters, page]);

  function handleFilterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);
    setFilters({ location: locationInput, jobType: jobTypeInput });
  }

  async function handleApply(jobId: string) {
    setApplyingJobId(jobId);
    setApplyErrors((previous) => ({ ...previous, [jobId]: "" }));

    try {
      const response = await fetch(`/api/jobs/${jobId}/apply`, { method: "POST" });
      const result = (await response.json()) as APIResponse<unknown>;

      if (!result.success) {
        setApplyErrors((previous) => ({ ...previous, [jobId]: result.error }));
        return;
      }

      setAppliedJobIds((previous) => new Set(previous).add(jobId));
    } catch {
      setApplyErrors((previous) => ({ ...previous, [jobId]: "Failed to apply. Please try again." }));
    } finally {
      setApplyingJobId(null);
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="flex-1 bg-zinc-50 px-6 py-12 dark:bg-black">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-white">Browse Jobs</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {total} open role{total === 1 ? "" : "s"} matching your filters.
          </p>
        </div>

        <form
          onSubmit={handleFilterSubmit}
          className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end dark:border-zinc-800 dark:bg-zinc-950"
        >
          <div className="flex flex-1 flex-col gap-1">
            <label htmlFor="location" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Location
            </label>
            <input
              id="location"
              type="text"
              placeholder="e.g. Remote, New York"
              value={locationInput}
              onChange={(event) => setLocationInput(event.target.value)}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-950 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
            />
          </div>

          <div className="flex flex-1 flex-col gap-1">
            <label htmlFor="jobType" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Job type
            </label>
            <select
              id="jobType"
              value={jobTypeInput}
              onChange={(event) => setJobTypeInput(event.target.value)}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-950 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
            >
              {JOB_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="flex h-10 items-center justify-center rounded-full bg-indigo-600 px-6 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
          >
            Search
          </button>
        </form>

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400">
            {error}
          </p>
        )}

        {isLoading ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading jobs…</p>
        ) : jobs.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">No jobs match your filters.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {jobs.map((job) => {
              const salary = formatSalary(job.minSalary, job.maxSalary);
              const hasApplied = appliedJobIds.has(job.id);
              const applyError = applyErrors[job.id];

              return (
                <div
                  key={job.id}
                  className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                    <div>
                      <h2 className="text-lg font-semibold text-zinc-950 dark:text-white">{job.title}</h2>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {job.company.name}
                        {job.location ? ` · ${job.location}` : ""}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleApply(job.id)}
                      disabled={hasApplied || applyingJobId === job.id}
                      className="flex h-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 px-6 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {hasApplied ? "Applied" : applyingJobId === job.id ? "Applying…" : "Apply"}
                    </button>
                  </div>

                  <p className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">{job.description}</p>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full bg-zinc-100 px-3 py-1 font-medium text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                      {job.jobType.replace("_", " ")}
                    </span>
                    <span className="rounded-full bg-zinc-100 px-3 py-1 font-medium text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                      {job.workMode}
                    </span>
                    {salary && (
                      <span className="rounded-full bg-zinc-100 px-3 py-1 font-medium text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                        {salary}
                      </span>
                    )}
                    {job.requiredSkills.map(({ skill, isRequired }) => (
                      <span
                        key={skill.id}
                        className={`rounded-full px-3 py-1 font-medium ${
                          isRequired
                            ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400"
                            : "bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                        }`}
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>

                  {applyError && <p className="text-sm text-red-600 dark:text-red-400">{applyError}</p>}
                </div>
              );
            })}
          </div>
        )}

        {!isLoading && jobs.length > 0 && (
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page <= 1}
              className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-900"
            >
              Previous
            </button>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={page >= totalPages}
              className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-900"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
