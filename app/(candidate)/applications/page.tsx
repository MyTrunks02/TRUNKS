"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { APIResponse } from "@/lib/api";
import { StatusBadge } from "@/components/common";
import type { ApplicationStatus } from "@/lib/generated/prisma/enums";

interface ApplicationListItem {
  id: string;
  status: ApplicationStatus;
  matchPercentage: number | null;
  appliedAt: string;
  job: {
    id: string;
    title: string;
    location: string | null;
    company: { id: string; name: string; location: string | null };
  };
}

export default function ApplicationsPage() {
  const router = useRouter();

  const [applications, setApplications] = useState<ApplicationListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch("/api/applications");
        const result = (await response.json()) as APIResponse<ApplicationListItem[]>;

        if (cancelled) return;

        if (!result.success) {
          if (response.status === 401) {
            router.push("/login");
            return;
          }
          setError(result.error);
          return;
        }

        setApplications(result.data);
      } catch {
        if (!cancelled) {
          setError("Failed to load your applications. Please try again.");
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

  return (
    <div className="flex-1 px-6 py-12">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <div className="animate-fade-in-up">
          <h1 className="text-2xl font-semibold text-navy-950 dark:text-white">Your Applications</h1>
          <p className="mt-1 text-sm text-navy-600 dark:text-navy-100">
            Track the status of every job you&apos;ve applied to.
          </p>
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400">
            {error}
          </p>
        )}

        {isLoading ? (
          <p className="text-sm text-navy-500 dark:text-navy-100">Loading applications…</p>
        ) : applications.length === 0 ? (
          <div className="rounded-2xl border border-navy-100 bg-white p-8 text-center shadow-sm dark:border-navy-800 dark:bg-navy-900">
            <p className="text-sm text-navy-500 dark:text-navy-100">You haven&apos;t applied to any jobs yet.</p>
            <Link
              href="/jobs"
              className="mt-4 inline-flex h-10 items-center justify-center rounded-full bg-teal-500 px-6 text-sm font-medium text-white shadow-sm shadow-teal-500/30 transition-all hover:-translate-y-0.5 hover:bg-teal-600"
            >
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {applications.map((application) => (
              <div
                key={application.id}
                className="flex flex-col gap-3 rounded-2xl border border-navy-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-teal-500/10 sm:flex-row sm:items-center sm:justify-between dark:border-navy-800 dark:bg-navy-900"
              >
                <div className="min-w-0">
                  <Link
                    href={`/jobs/${application.job.id}`}
                    className="text-base font-semibold text-navy-950 hover:text-teal-600 dark:text-white dark:hover:text-teal-400"
                  >
                    {application.job.title}
                  </Link>
                  <p className="text-sm text-navy-600 dark:text-navy-100">
                    {application.job.company.name}
                    {application.job.location ? ` · ${application.job.location}` : ""}
                  </p>
                  <p className="mt-1 text-xs text-navy-500 dark:text-navy-100/70">
                    Applied {new Date(application.appliedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  {application.matchPercentage !== null && (
                    <span className="text-sm font-semibold text-gold-600 dark:text-gold-400">
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
  );
}
