"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { APIResponse } from "@/lib/api";

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

export default function CandidateDashboardPage() {
  const router = useRouter();

  const [data, setData] = useState<CandidateMe | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        const response = await fetch("/api/candidates/me");
        const result = (await response.json()) as APIResponse<CandidateMe>;

        if (cancelled) return;

        if (!result.success) {
          if (response.status === 401) {
            router.push("/login");
            return;
          }
          setError(result.error);
          return;
        }

        setData(result.data);
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
      <div className="flex flex-1 items-center justify-center bg-zinc-50 dark:bg-black">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading your dashboard…</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-1 items-center justify-center bg-zinc-50 dark:bg-black">
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
    <div className="flex-1 bg-zinc-50 px-6 py-12 dark:bg-black">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-white">
            Welcome back, {candidate.user.firstName}
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{candidate.user.email}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
            >
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{card.label}</p>
              <p className="mt-2 text-3xl font-semibold text-zinc-950 dark:text-white">{card.value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-white">Quick actions</h2>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/jobs"
              className="flex h-11 flex-1 items-center justify-center rounded-full bg-indigo-600 px-6 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
            >
              Browse Jobs
            </Link>
            <Link
              href={`/candidates/${candidate.id}`}
              className="flex h-11 flex-1 items-center justify-center rounded-full border border-zinc-300 px-6 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-900"
            >
              Edit Profile
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex h-11 flex-1 items-center justify-center rounded-full border border-zinc-300 px-6 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-900"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
