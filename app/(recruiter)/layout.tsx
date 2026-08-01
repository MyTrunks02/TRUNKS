"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

// Prefixed with /recruiter/... rather than /dashboard, /jobs, etc. — route
// groups like (recruiter) and (candidate) are invisible in the URL, so
// unprefixed leaf names here would collide with the (candidate) group's
// /dashboard and /jobs routes. Pages under this layout should live at
// app/(recruiter)/recruiter/<segment>/page.tsx to match.
const NAV_LINKS = [
  { label: "Dashboard", href: "/recruiter/dashboard" },
  { label: "Job Postings", href: "/recruiter/jobs" },
  { label: "Post a Job", href: "/recruiter/jobs/new" },
  { label: "Applications", href: "/recruiter/applications" },
] as const;

export default function RecruiterLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <nav className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-black/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <Link
              href="/recruiter/dashboard"
              className="flex items-center gap-2 text-lg font-bold tracking-tight text-zinc-950 dark:text-white"
            >
              TRUNKS
              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400">
                Recruiter
              </span>
            </Link>
            <div className="hidden items-center gap-1 sm:flex">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400"
                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-900"
          >
            Log Out
          </button>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto border-t border-zinc-200 px-6 py-2 sm:hidden dark:border-zinc-800">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {children}
    </div>
  );
}
