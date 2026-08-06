"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const STATS = [
  { value: "3 days", label: "Avg. time to first match" },
  { value: "92%", label: "Candidates matched to relevant roles" },
  { value: "10,000+", label: "Active job seekers" },
  { value: "500+", label: "Hiring teams on TRUNKS" },
] as const;

const FEATURES = [
  {
    num: "01",
    title: "Matching that reads the whole picture",
    copy: "TRUNKS looks at skills, experience and trajectory, not just keywords on a resume, so candidates surface for roles they're actually right for.",
  },
  {
    num: "02",
    title: "Built for recruiters",
    copy: "Screen a shortlist of qualified candidates first. Spend your time on conversations, not sifting through applications that never fit.",
  },
  {
    num: "03",
    title: "Built for candidates",
    copy: "Get matched to roles that fit what you've actually done, not whichever buzzwords made it onto your resume.",
  },
  {
    num: "04",
    title: "Faster from first look to offer",
    copy: "Less back-and-forth, fewer dead-end interviews. TRUNKS surfaces the matches worth a conversation on both sides.",
  },
] as const;

const FAQS = [
  {
    q: "How does TRUNKS match candidates and jobs?",
    a: "TRUNKS' AI reads a candidate's full experience and a role's real requirements, then ranks matches by fit rather than keyword overlap.",
  },
  {
    q: "Is TRUNKS free for job seekers?",
    a: "Yes. Creating a profile and getting matched is free for candidates, always.",
  },
  {
    q: "How do recruiters get started?",
    a: "Request a demo and our team will set up your team account, post your open roles, and walk you through your first matches.",
  },
  {
    q: "What kinds of roles does TRUNKS support?",
    a: "TRUNKS covers full-time, contract and hybrid roles across most industries, with the deepest coverage in tech, operations and sales.",
  },
] as const;

export default function Home() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [email, setEmail] = useState("");

  function toggleFaq(i: number) {
    setOpenFaq((current) => (current === i ? null : i));
  }

  function handleSignup(e: FormEvent) {
    e.preventDefault();
    router.push(email ? `/signup?email=${encodeURIComponent(email)}` : "/signup");
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-navy-950 text-white">
      <nav className="sticky top-0 z-20 border-b border-white/10 bg-navy-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-10">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-500 text-sm font-black text-navy-950">
              T
            </span>
            TRUNKS
          </Link>
          <div className="hidden items-center gap-8 text-sm text-navy-100 sm:flex">
            <a href="#product" className="transition-colors hover:text-teal-400">
              Product
            </a>
            <a href="#recruiters" className="transition-colors hover:text-teal-400">
              For recruiters
            </a>
            <a href="#faq" className="transition-colors hover:text-teal-400">
              FAQ
            </a>
          </div>
          <Link
            href="/signup"
            className="rounded-full bg-gold-500 px-5 py-2 text-sm font-semibold text-navy-950 transition-colors hover:bg-gold-400"
          >
            Get started
          </Link>
        </div>
      </nav>

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 right-[-10%] h-[32rem] w-[32rem] rounded-full bg-teal-500/20 blur-3xl" />
          <div className="absolute top-1/3 left-[-15%] h-96 w-96 rounded-full bg-gold-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-32">
          <h1 className="animate-fade-in-up max-w-3xl text-[clamp(2.75rem,6.4vw,5.25rem)] font-bold leading-[1.1] tracking-tight opacity-0">
            <span className="block">Hiring that finally fits.</span>
            <span className="block">For both sides of the table.</span>
          </h1>
          <p className="animate-fade-in-up animate-delay-100 mt-6 max-w-xl text-lg leading-8 text-navy-100 opacity-0">
            TRUNKS uses AI to match job seekers with roles they&apos;re actually right for, and
            recruiters with candidates worth their time — so the search takes hours, not weeks.
          </p>
          <div className="animate-fade-in-up animate-delay-200 mt-8 flex flex-wrap gap-4 opacity-0">
            <Link
              href="/signup"
              className="flex h-12 items-center justify-center rounded-full bg-gold-500 px-8 text-base font-semibold text-navy-950 shadow-lg shadow-gold-500/20 transition-all hover:-translate-y-0.5 hover:bg-gold-400 hover:shadow-xl hover:shadow-gold-500/30"
            >
              Get started free
            </Link>
            <a
              href="#recruiters"
              className="flex h-12 items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 text-base font-medium text-white backdrop-blur transition-all hover:-translate-y-0.5 hover:border-teal-400/50 hover:bg-white/10"
            >
              For recruiters
            </a>
          </div>
        </div>
      </section>

      <section aria-label="TRUNKS, by the numbers" className="bg-navy-900">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-14 sm:grid-cols-4 sm:px-10">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <p className="text-[clamp(2.25rem,3.6vw,3.25rem)] font-bold leading-[1.1] text-white">
                {stat.value}
              </p>
              <p className="mt-2 text-xs uppercase tracking-wider text-navy-100/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
        <section id="product" className="py-16 sm:py-24">
          <span className="mb-4 block text-sm font-semibold uppercase tracking-wider text-teal-400">
            Why TRUNKS
          </span>
          <div>
            {FEATURES.map((item) => (
              <div
                key={item.num}
                className="grid grid-cols-1 gap-4 border-t border-white/10 py-7 sm:grid-cols-[minmax(64px,160px)_minmax(0,420px)_minmax(0,1fr)] sm:items-baseline sm:gap-x-12"
              >
                <p className="text-sm font-semibold text-teal-400">{item.num}</p>
                <h2 className="text-2xl font-semibold tracking-tight text-white">{item.title}</h2>
                <p className="max-w-[52ch] text-[15.5px] leading-relaxed text-navy-100/80">
                  {item.copy}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="faq" className="py-14 sm:py-16">
          <span className="mb-4 block text-sm font-semibold uppercase tracking-wider text-teal-400">
            FAQ
          </span>
          <div>
            {FAQS.map((item, i) => (
              <div key={item.q} className="border-t border-white/10">
                <button
                  type="button"
                  onClick={() => toggleFaq(i)}
                  aria-expanded={openFaq === i}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left font-semibold text-white"
                >
                  <span>{item.q}</span>
                  <span className="flex-none text-xl leading-none text-teal-400">
                    {openFaq === i ? "−" : "+"}
                  </span>
                </button>
                {openFaq === i && (
                  <p className="max-w-[60ch] pb-5 text-[15.5px] leading-relaxed text-navy-100/80">
                    {item.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        <hr className="border-white/10" />

        <section id="recruiters" className="py-14 sm:py-16">
          <h3 className="text-2xl font-semibold tracking-tight text-white">
            Ready to find your match?
          </h3>
          <p className="mt-3 max-w-xl text-[15.5px] leading-relaxed text-navy-100/80">
            Get started free as a candidate, or bring your team on board — recruiters get a demo
            before they commit.
          </p>
          <form onSubmit={handleSignup} className="mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              aria-label="Email address"
              className="min-h-11 flex-1 rounded-lg border border-white/15 bg-navy-900 px-3 text-sm text-white placeholder:text-navy-100/50 focus:border-teal-400 focus:outline-none"
            />
            <button
              type="submit"
              className="min-h-11 rounded-lg bg-gold-500 px-6 text-sm font-semibold text-navy-950 transition-colors hover:bg-gold-400"
            >
              Get started
            </button>
          </form>
          <p className="mt-4">
            <a href="#recruiters" className="text-sm text-teal-400 hover:text-teal-300">
              Hiring? Request a recruiter demo →
            </a>
          </p>
        </section>

        <footer className="border-t border-white/10 py-10 text-xs text-navy-100/60">
          © {new Date().getFullYear()} TRUNKS. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
