"use client";

import Link from "next/link";

const FEATURES = [
  {
    title: "AI-Powered Matching",
    description:
      "TRUNKS scores every application against a job's required skills, so candidates and recruiters both see match quality instantly.",
    icon: "🎯",
  },
  {
    title: "Verified Companies",
    description:
      "Every employer goes through a verification pipeline before their listings go live, cutting down on fake or low-quality postings.",
    icon: "✅",
  },
  {
    title: "Skill Assessments",
    description:
      "Candidates prove what they know with scored skill assessments, turning a resume claim into evidence recruiters can trust.",
    icon: "📊",
  },
] as const;

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-24 text-center sm:py-32">
          <span className="rounded-full bg-indigo-100 px-4 py-1 text-sm font-medium text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400">
            TRUNKS
          </span>
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-zinc-950 sm:text-5xl dark:text-white">
            Find the right job. Find the right hire.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            TRUNKS matches candidates and recruiters using verified skills, not just keywords — so every
            application is a signal worth acting on.
          </p>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="flex h-12 items-center justify-center rounded-full bg-indigo-600 px-8 text-base font-medium text-white transition-colors hover:bg-indigo-500"
            >
              Find Your Next Role
            </Link>
            <Link
              href="/signup"
              className="flex h-12 items-center justify-center rounded-full border border-zinc-300 px-8 text-base font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-900"
            >
              Post a Job
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 py-20">
        <div className="grid gap-8 sm:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
            >
              <span className="text-3xl" aria-hidden="true">
                {feature.icon}
              </span>
              <h2 className="text-lg font-semibold text-zinc-950 dark:text-white">{feature.title}</h2>
              <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
