"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { APIResponse } from "@/lib/api";
import { StatusBadge } from "@/components/common";
import type { ApplicationStatus } from "@/lib/generated/prisma/enums";

interface CandidateMe {
  candidate: {
    id: string;
    trunksScore: number | null;
    subscriptionPlan: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
  stats: {
    totalApplications: number;
    shortlistedCount: number;
  };
}

interface ApplicationListItem {
  id: string;
  status: ApplicationStatus;
  matchPercentage: number | null;
  appliedAt: string;
  job: {
    title: string;
    company: { name: string };
  };
}

const RECENT_APPLICATIONS_LIMIT = 5;

export default function CandidateDashboardPage() {
  const router = useRouter();

  const [data, setData] = useState<CandidateMe | null>(null);
  const [applications, setApplications] = useState<ApplicationListItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        const [meResponse, applicationsResponse] = await Promise.all([
          fetch("/api/candidates/me"),
          fetch("/api/applications"),
        ]);
        const meResult = (await meResponse.json()) as APIResponse<CandidateMe>;

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

        const applicationsResult = (await applicationsResponse.json()) as APIResponse<ApplicationListItem[]>;
        if (!cancelled && applicationsResult.success) {
          setApplications(applicationsResult.data);
        }
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

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [router]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-navy-50 dark:bg-navy-950">
        <p className="text-sm text-navy-500 dark:text-navy-100">Loading your dashboard…</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-1 items-center justify-center bg-navy-50 dark:bg-navy-950">
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400">
          {error ?? "Something went wrong."}
        </p>
      </div>
    );
  }

  const { candidate, stats } = data;

  const statCards = [
    { label: "Applications Submitted", value: stats.totalApplications },
    { label: "Shortlisted", value: stats.shortlistedCount },
    { label: "TRUNKS Score", value: candidate.trunksScore ?? 0 },
  ] as const;

  return (
    <div className="flex-1 px-6 py-12">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <div className="animate-fade-in-up">
          <h1 className="text-2xl font-semibold text-navy-950 dark:text-white">
            Welcome back, {candidate.user.firstName}
          </h1>
          <p className="mt-1 text-sm text-navy-600 dark:text-navy-100">{candidate.user.email}</p>
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
          <h2 className="text-lg font-semibold text-navy-950 dark:text-white">Quick actions</h2>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/jobs"
              className="flex h-11 flex-1 items-center justify-center rounded-full bg-teal-500 px-6 text-sm font-medium text-white shadow-sm shadow-teal-500/30 transition-all hover:-translate-y-0.5 hover:bg-teal-600"
            >
              Browse Jobs
            </Link>
            <Link
              href="/profile"
              className="flex h-11 flex-1 items-center justify-center rounded-full border border-navy-100 px-6 text-sm font-medium text-navy-900 transition-colors hover:bg-navy-50 dark:border-navy-700 dark:text-white dark:hover:bg-navy-800"
            >
              Edit Profile
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex h-11 flex-1 items-center justify-center rounded-full border border-navy-100 px-6 text-sm font-medium text-navy-900 transition-colors hover:bg-navy-50 dark:border-navy-700 dark:text-white dark:hover:bg-navy-800"
            >
              Log Out
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-sm dark:border-navy-800 dark:bg-navy-900">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-navy-950 dark:text-white">Recent applications</h2>
            <Link href="/applications" className="text-sm font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400">
              View all
            </Link>
          </div>

          {applications.length === 0 ? (
            <p className="mt-4 text-sm text-navy-500 dark:text-navy-100">
              You haven&apos;t applied to any jobs yet.{" "}
              <Link href="/jobs" className="font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400">
                Start browsing
              </Link>
              .
            </p>
          ) : (
            <div className="mt-4 flex flex-col divide-y divide-navy-100 dark:divide-navy-800">
              {applications.slice(0, RECENT_APPLICATIONS_LIMIT).map((application) => (
                <div key={application.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-navy-950 dark:text-white">{application.job.title}</p>
                    <p className="truncate text-xs text-navy-500 dark:text-navy-100">{application.job.company.name}</p>
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
