"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { APIResponse } from "@/lib/api";
import { StatusBadge } from "@/components/common";
import type { ApplicationStatus, VerificationStatus } from "@/lib/generated/prisma/enums";

interface RecruiterMe {
  recruiter: {
    id: string;
    title: string | null;
    user: { firstName: string; lastName: string; email: string };
    company: { id: string; name: string; verificationStatus: VerificationStatus };
  };
  stats: { activeJobCount: number; totalApplications: number };
}

interface RecruiterJob {
  id: string;
  title: string;
  jobType: string;
  workMode: string;
  isActive: boolean;
  postedDate: string;
  company: { name: string };
  _count: { applications: number };
}

interface RecruiterApplication {
  id: string;
  status: ApplicationStatus;
  matchPercentage: number | null;
  appliedAt: string;
  job: { id: string; title: string };
  candidate: { user: { firstName: string; lastName: string; email: string } };
}

const VERIFICATION_LABEL: Record<VerificationStatus, string> = {
  PENDING: "Verification pending",
  VERIFIED: "Verified",
  REJECTED: "Verification rejected",
};

const RECENT_APPLICANTS_LIMIT = 6;

export default function RecruiterDashboardPage() {
  const router = useRouter();

  const [data, setData] = useState<RecruiterMe | null>(null);
  const [jobs, setJobs] = useState<RecruiterJob[]>([]);
  const [applications, setApplications] = useState<RecruiterApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [meResponse, jobsResponse, applicationsResponse] = await Promise.all([
          fetch("/api/recruiter/me"),
          fetch("/api/recruiter/jobs"),
          fetch("/api/applications"),
        ]);
        const meResult = (await meResponse.json()) as APIResponse<RecruiterMe>;

        if (cancelled) return;

        if (!meResult.success) {
          if (meResponse.status === 401) {
            router.push("/login");
            return;
          }
          setError(meResult.error);
          return;
        }

        setData(meResult.data);

        const jobsResult = (await jobsResponse.json()) as APIResponse<RecruiterJob[]>;
        if (!cancelled && jobsResult.success) setJobs(jobsResult.data);

        const applicationsResult = (await applicationsResponse.json()) as APIResponse<RecruiterApplication[]>;
        if (!cancelled && applicationsResult.success) setApplications(applicationsResult.data);
      } catch {
        if (!cancelled) {
          setError("Failed to load your dashboard. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-navy-500 dark:text-navy-100">Loading your dashboard…</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-1 items-center justify-center px-6">
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400">
          {error ?? "Something went wrong."}
        </p>
      </div>
    );
  }

  const { recruiter, stats } = data;
  const shortlistedCount = applications.filter((application) => application.status === "SHORTLISTED").length;

  const statCards = [
    { label: "Active Job Postings", value: stats.activeJobCount },
    { label: "Total Applicants", value: stats.totalApplications },
    { label: "Shortlisted", value: shortlistedCount },
  ] as const;

  return (
    <div className="flex-1 px-6 py-12">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <div className="animate-fade-in-up flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-navy-950 dark:text-white">
              Welcome back, {recruiter.user.firstName}
            </h1>
            <p className="mt-1 text-sm text-navy-600 dark:text-navy-100">{recruiter.company.name}</p>
          </div>
          <span
            className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
              recruiter.company.verificationStatus === "VERIFIED"
                ? "bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400"
                : recruiter.company.verificationStatus === "REJECTED"
                  ? "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                  : "bg-gold-50 text-gold-700 dark:bg-gold-500/10 dark:text-gold-400"
            }`}
          >
            {VERIFICATION_LABEL[recruiter.company.verificationStatus]}
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {statCards.map((card, index) => (
            <div
              key={card.label}
              className={`animate-fade-in-up animate-delay-${(index + 1) * 100} rounded-2xl border border-navy-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-teal-500/10 dark:border-navy-800 dark:bg-navy-900`}
            >
              <p className="text-sm font-medium text-navy-500 dark:text-navy-100">{card.label}</p>
              <p className="mt-2 text-3xl font-semibold text-navy-950 dark:text-white">{card.value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-sm dark:border-navy-800 dark:bg-navy-900">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-navy-950 dark:text-white">Posted jobs</h2>
            <Link href="/recruiter/jobs/new" className="text-sm font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400">
              Post a job
            </Link>
          </div>

          {jobs.length === 0 ? (
            <p className="mt-4 text-sm text-navy-500 dark:text-navy-100">You haven&apos;t posted any jobs yet.</p>
          ) : (
            <div className="mt-4 flex flex-col divide-y divide-navy-100 dark:divide-navy-800">
              {jobs.map((job) => (
                <div key={job.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-navy-950 dark:text-white">{job.title}</p>
                    <p className="text-xs text-navy-500 dark:text-navy-100">
                      {job.jobType.replace("_", " ")} · {job.workMode} · Posted{" "}
                      {new Date(job.postedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">
                      {job._count.applications} applicant{job._count.applications === 1 ? "" : "s"}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        job.isActive
                          ? "bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400"
                          : "bg-navy-100 text-navy-700 dark:bg-navy-800 dark:text-navy-100"
                      }`}
                    >
                      {job.isActive ? "Active" : "Closed"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-sm dark:border-navy-800 dark:bg-navy-900">
          <h2 className="text-lg font-semibold text-navy-950 dark:text-white">Recent applicants</h2>

          {applications.length === 0 ? (
            <p className="mt-4 text-sm text-navy-500 dark:text-navy-100">No applications yet.</p>
          ) : (
            <div className="mt-4 flex flex-col divide-y divide-navy-100 dark:divide-navy-800">
              {applications.slice(0, RECENT_APPLICANTS_LIMIT).map((application) => (
                <div key={application.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-navy-950 dark:text-white">
                      {application.candidate.user.firstName} {application.candidate.user.lastName}
                    </p>
                    <p className="truncate text-xs text-navy-500 dark:text-navy-100">{application.job.title}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    {application.matchPercentage !== null && (
                      <span className="text-xs font-semibold text-gold-600 dark:text-gold-400">
                        {Math.round(application.matchPercentage)}% match
                      </span>
                    )}
                    <StatusBadge status={application.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
