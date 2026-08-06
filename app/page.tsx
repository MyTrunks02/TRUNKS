import Link from "next/link";

const STATS = [
  { value: "10,000+", label: "Verified Candidates" },
  { value: "500+", label: "Companies Hiring" },
  { value: "92%", label: "Match Accuracy" },
  { value: "48hrs", label: "Avg. Time to Shortlist" },
] as const;

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

const STEPS = [
  { step: "01", title: "Create your profile", description: "Candidates list skills and experience; recruiters verify their company." },
  { step: "02", title: "Get matched", description: "Our scoring engine ranks every candidate against a job's required skills." },
  { step: "03", title: "Hire with confidence", description: "Move top matches through shortlisting, offers, and onboarding — all in one place." },
] as const;

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-white dark:bg-navy-950">
      <nav className="sticky top-0 z-20 border-b border-navy-100 bg-white/80 backdrop-blur dark:border-navy-800 dark:bg-navy-950/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-navy-700 dark:text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-700 text-sm font-black text-gold-400 dark:bg-teal-500 dark:text-navy-950">
              T
            </span>
            TRUNKS
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-full px-4 py-2 text-sm font-medium text-navy-700 transition-colors hover:bg-navy-50 dark:text-white dark:hover:bg-navy-900"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-teal-500 px-5 py-2 text-sm font-medium text-white shadow-sm shadow-teal-500/30 transition-all hover:-translate-y-0.5 hover:bg-teal-600 hover:shadow-md hover:shadow-teal-500/40"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden bg-navy-950">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-teal-500/20 blur-3xl" />
          <div className="absolute top-1/3 right-0 h-80 w-80 rounded-full bg-gold-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-24 text-center sm:py-32">
          <span className="animate-fade-in-up rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1 text-sm font-medium text-gold-400">
            TRUNKS
          </span>
          <h1 className="animate-fade-in-up animate-delay-100 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Find the right job.{" "}
            <span className="bg-gradient-to-r from-teal-400 to-gold-400 bg-clip-text text-transparent">
              Find the right hire.
            </span>
          </h1>
          <p className="animate-fade-in-up animate-delay-200 max-w-xl text-lg leading-8 text-navy-100">
            TRUNKS matches candidates and recruiters using verified skills, not just keywords — so every
            application is a signal worth acting on.
          </p>
          <div className="animate-fade-in-up animate-delay-300 mt-4 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="flex h-12 items-center justify-center rounded-full bg-teal-500 px-8 text-base font-medium text-white shadow-lg shadow-teal-500/30 transition-all hover:-translate-y-0.5 hover:bg-teal-400 hover:shadow-xl hover:shadow-teal-500/40"
            >
              Find Your Next Role
            </Link>
            <Link
              href="/signup"
              className="flex h-12 items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 text-base font-medium text-white backdrop-blur transition-all hover:-translate-y-0.5 hover:border-gold-500/50 hover:bg-white/10"
            >
              Post a Job
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-navy-100 bg-navy-50 dark:border-navy-800 dark:bg-navy-900">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-6 py-14 sm:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center text-center">
              <p className="text-3xl font-bold text-navy-700 sm:text-4xl dark:text-teal-400">{stat.value}</p>
              <p className="mt-1 text-sm text-navy-600 dark:text-navy-100">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-navy-950 dark:text-white">Built for signal, not noise</h2>
          <p className="mt-3 text-base text-navy-600 dark:text-navy-100">
            Every feature in TRUNKS exists to cut through resume keyword-stuffing and get the right people talking.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="group flex flex-col gap-3 rounded-2xl border border-navy-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-teal-500/40 hover:shadow-lg hover:shadow-teal-500/10 dark:border-navy-800 dark:bg-navy-900"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-2xl transition-transform group-hover:scale-110 dark:bg-teal-500/10">
                {feature.icon}
              </span>
              <h3 className="text-lg font-semibold text-navy-950 dark:text-white">{feature.title}</h3>
              <p className="text-sm leading-6 text-navy-600 dark:text-navy-100">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-navy-100 bg-navy-50 dark:border-navy-800 dark:bg-navy-900">
        <div className="mx-auto max-w-5xl px-6 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-navy-950 dark:text-white">How it works</h2>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {STEPS.map((item) => (
              <div key={item.step} className="relative flex flex-col gap-2 rounded-2xl bg-white p-6 shadow-sm dark:bg-navy-950">
                <span className="text-sm font-bold text-gold-600 dark:text-gold-400">{item.step}</span>
                <h3 className="text-lg font-semibold text-navy-950 dark:text-white">{item.title}</h3>
                <p className="text-sm leading-6 text-navy-600 dark:text-navy-100">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-navy-950">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-teal-500/20 blur-3xl" />
        </div>
        <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-20 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Ready to make your next move?</h2>
          <p className="max-w-xl text-base text-navy-100">
            Join thousands of candidates and recruiters already matching on verified skills.
          </p>
          <Link
            href="/signup"
            className="flex h-12 items-center justify-center rounded-full bg-gold-500 px-8 text-base font-medium text-navy-950 shadow-lg shadow-gold-500/20 transition-all hover:-translate-y-0.5 hover:bg-gold-400 hover:shadow-xl hover:shadow-gold-500/30"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      <footer className="border-t border-navy-800 bg-navy-950 px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <span className="flex items-center gap-2 text-sm font-bold text-white">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-teal-500 text-xs font-black text-navy-950">
              T
            </span>
            TRUNKS
          </span>
          <p className="text-xs text-navy-100">© {new Date().getFullYear()} TRUNKS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
