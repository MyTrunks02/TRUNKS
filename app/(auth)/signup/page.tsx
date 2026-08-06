"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserRole } from "@/lib/generated/prisma/enums";
import type { APIResponse } from "@/lib/api";

type Role = typeof UserRole.CANDIDATE | typeof UserRole.RECRUITER;

interface SignupResult {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export default function SignupPage() {
  const router = useRouter();

  const [role, setRole] = useState<Role>(UserRole.CANDIDATE);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          role,
          ...(role === UserRole.RECRUITER ? { companyName } : {}),
        }),
      });

      const result = (await response.json()) as APIResponse<SignupResult>;

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.push(result.data.role === UserRole.CANDIDATE ? "/dashboard" : "/recruiter/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClasses =
    "rounded-lg border border-navy-100 px-3 py-2 text-sm text-navy-950 outline-none transition-colors focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-navy-700 dark:bg-navy-950 dark:text-white";
  const labelClasses = "text-sm font-medium text-navy-700 dark:text-navy-100";

  return (
    <div className="flex flex-1 items-center justify-center bg-navy-50 px-6 py-16 dark:bg-navy-950">
      <div className="w-full max-w-md animate-fade-in-up rounded-2xl border border-navy-100 bg-white p-8 shadow-sm dark:border-navy-800 dark:bg-navy-900">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-navy-700 dark:text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-700 text-sm font-black text-gold-400 dark:bg-teal-500 dark:text-navy-950">
            T
          </span>
          TRUNKS
        </Link>

        <h1 className="mt-6 text-2xl font-semibold text-navy-950 dark:text-white">Create your account</h1>
        <p className="mt-1 text-sm text-navy-600 dark:text-navy-100">Join TRUNKS as a candidate or recruiter.</p>

        <div className="mt-6 grid grid-cols-2 gap-2 rounded-full bg-navy-50 p-1 dark:bg-navy-950">
          <button
            type="button"
            onClick={() => setRole(UserRole.CANDIDATE)}
            className={`rounded-full py-2 text-sm font-medium transition-colors ${
              role === UserRole.CANDIDATE
                ? "bg-white text-navy-950 shadow-sm dark:bg-navy-800 dark:text-white"
                : "text-navy-500 hover:text-navy-800 dark:text-navy-100 dark:hover:text-white"
            }`}
          >
            I&apos;m a Candidate
          </button>
          <button
            type="button"
            onClick={() => setRole(UserRole.RECRUITER)}
            className={`rounded-full py-2 text-sm font-medium transition-colors ${
              role === UserRole.RECRUITER
                ? "bg-white text-navy-950 shadow-sm dark:bg-navy-800 dark:text-white"
                : "text-navy-500 hover:text-navy-800 dark:text-navy-100 dark:hover:text-white"
            }`}
          >
            I&apos;m a Recruiter
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="firstName" className={labelClasses}>
                First name
              </label>
              <input
                id="firstName"
                type="text"
                required
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                className={inputClasses}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="lastName" className={labelClasses}>
                Last name
              </label>
              <input
                id="lastName"
                type="text"
                required
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                className={inputClasses}
              />
            </div>
          </div>

          {role === UserRole.RECRUITER && (
            <div className="flex flex-col gap-1 animate-fade-in">
              <label htmlFor="companyName" className={labelClasses}>
                Company name
              </label>
              <input
                id="companyName"
                type="text"
                required
                value={companyName}
                onChange={(event) => setCompanyName(event.target.value)}
                className={inputClasses}
              />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label htmlFor="email" className={labelClasses}>
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={inputClasses}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className={labelClasses}>
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={inputClasses}
            />
            <p className="text-xs text-navy-500 dark:text-navy-100/70">
              At least 8 characters, with an uppercase letter and a number.
            </p>
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
            {isSubmitting ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-navy-600 dark:text-navy-100">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
