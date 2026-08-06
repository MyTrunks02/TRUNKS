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
    <div className="flex min-h-screen flex-col bg-navy-50 dark:bg-navy-950">
      <nav className="sticky top-0 z-10 border-b border-navy-100 bg-white/80 backdrop-blur dark:border-navy-800 dark:bg-navy-950/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <Link
              href="/recruiter/dashboard"
              className="flex items-center gap-2 text-lg font-bold tracking-tight text-navy-700 dark:text-white"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-700 text-sm font-black text-gold-400 dark:bg-teal-500 dark:text-navy-950">
                T
              </span>
              TRUNKS
              <span className="rounded-full bg-gold-100 px-2 py-0.5 text-xs font-medium text-gold-700 dark:bg-gold-500/10 dark:text-gold-400">
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
                        ? "bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400"
                        : "text-navy-600 hover:bg-navy-50 hover:text-navy-900 dark:text-navy-100 dark:hover:bg-navy-900 dark:hover:text-white"
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
            className="rounded-full border border-navy-100 px-4 py-2 text-sm font-medium text-navy-900 transition-colors hover:bg-navy-50 dark:border-navy-700 dark:text-white dark:hover:bg-navy-900"
          >
            Log Out
          </button>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto border-t border-navy-100 px-6 py-2 sm:hidden dark:border-navy-800">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400"
                    : "text-navy-600 hover:bg-navy-50 hover:text-navy-900 dark:text-navy-100 dark:hover:bg-navy-900 dark:hover:text-white"
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
