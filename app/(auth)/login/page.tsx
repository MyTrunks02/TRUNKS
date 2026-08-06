"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserRole } from "@/lib/generated/prisma/enums";
import type { APIResponse } from "@/lib/api";

interface LoginResult {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

function destinationForRole(role: UserRole): string {
  if (role === UserRole.CANDIDATE) return "/dashboard";
  if (role === UserRole.RECRUITER) return "/recruiter/dashboard";
  return "/";
}

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = (await response.json()) as APIResponse<LoginResult>;

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.push(destinationForRole(result.data.role));
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-navy-50 px-6 py-16 dark:bg-navy-950">
      <div className="w-full max-w-md animate-fade-in-up rounded-2xl border border-navy-100 bg-white p-8 shadow-sm dark:border-navy-800 dark:bg-navy-900">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-navy-700 dark:text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-700 text-sm font-black text-gold-400 dark:bg-teal-500 dark:text-navy-950">
            T
          </span>
          TRUNKS
        </Link>

        <h1 className="mt-6 text-2xl font-semibold text-navy-950 dark:text-white">Welcome back</h1>
        <p className="mt-1 text-sm text-navy-600 dark:text-navy-100">Log in to your TRUNKS account.</p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium text-navy-700 dark:text-navy-100">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="rounded-lg border border-navy-100 px-3 py-2 text-sm text-navy-950 outline-none transition-colors focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-navy-700 dark:bg-navy-950 dark:text-white"
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium text-navy-700 dark:text-navy-100">
                Password
              </label>
            </div>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-lg border border-navy-100 px-3 py-2 text-sm text-navy-950 outline-none transition-colors focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-navy-700 dark:bg-navy-950 dark:text-white"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 flex h-11 items-center justify-center rounded-full bg-teal-500 text-sm font-medium text-white shadow-sm shadow-teal-500/30 transition-all hover:-translate-y-0.5 hover:bg-teal-600 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {isSubmitting ? "Logging in…" : "Log In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-navy-600 dark:text-navy-100">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
