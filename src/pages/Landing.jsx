import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Sparkles,
  Search,
  Users,
  ShieldCheck,
  Zap,
  Star,
  CheckCircle2,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import JobCard from '../components/JobCard'
import { companies, jobs } from '../data/mockData'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
}

const stats = [
  { value: '24k+', label: 'Active job seekers' },
  { value: '3,200+', label: 'Companies hiring' },
  { value: '89%', label: 'Interview success rate' },
  { value: '18 days', label: 'Avg. time to hire' },
]

const features = [
  {
    icon: Search,
    title: 'Smart Job Matching',
    text: 'Our matching engine surfaces roles that fit your skills, salary expectations, and career goals — not just keyword matches.',
  },
  {
    icon: Zap,
    title: 'Apply in Seconds',
    text: 'One profile, unlimited applications. Skip repetitive forms and apply to your next role in a couple of clicks.',
  },
  {
    icon: Users,
    title: 'Direct Recruiter Access',
    text: 'Message hiring managers directly, track every response, and never wonder where your application stands again.',
  },
  {
    icon: ShieldCheck,
    title: 'Verified Companies',
    text: 'Every company on TRUNKS is vetted. No ghost jobs, no spam — just real roles from real teams that are actively hiring.',
  },
]

const steps = [
  { title: 'Create your profile', text: 'Import your resume or build a profile from scratch in under 5 minutes.' },
  { title: 'Get matched', text: 'Receive curated job recommendations based on your skills and preferences.' },
  { title: 'Apply & track', text: 'Apply with one click and track every application from a single dashboard.' },
  { title: 'Land the offer', text: 'Interview, negotiate, and accept — all backed by real-time status updates.' },
]

const testimonials = [
  {
    quote:
      'I landed three interviews in my first week on TRUNKS. The matching was scary accurate — every role fit what I was actually looking for.',
    name: 'Sofia Belan',
    role: 'DevOps Engineer, hired at Northwind AI',
    initials: 'SB',
  },
  {
    quote:
      'As a recruiter, TRUNKS cut our time-to-hire almost in half. The quality of applicants is night and day compared to other boards.',
    name: 'Riya Hobson',
    role: 'Talent Partner, Fintra',
    initials: 'RH',
  },
  {
    quote:
      'The dashboard alone is worth it — I finally stopped losing track of which companies I applied to and when.',
    name: 'Diego Ramirez',
    role: 'Frontend Engineer',
    initials: 'DR',
  },
]

export default function Landing() {
  return (
    <div className="overflow-x-hidden bg-white">
      <Navbar />

      {/* HERO */}
      <section className="relative isolate">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-navy-50 via-white to-white" />
        <div
          className="absolute -top-24 right-[-10%] -z-10 h-[36rem] w-[36rem] rounded-full bg-teal-200/40 blur-3xl"
          aria-hidden
        />
        <div
          className="absolute top-40 left-[-15%] -z-10 h-[30rem] w-[30rem] rounded-full bg-gold-200/30 blur-3xl"
          aria-hidden
        />

        <div className="section grid items-center gap-16 pb-20 pt-16 lg:grid-cols-2 lg:pb-32 lg:pt-24">
          <div>
            <motion.div
              initial="hidden"
              animate="show"
              custom={0}
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5 text-sm font-semibold text-teal-700"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Hiring, reimagined for 2026
            </motion.div>

            <motion.h1
              initial="hidden"
              animate="show"
              custom={1}
              variants={fadeUp}
              className="mt-6 font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-navy-800 sm:text-5xl lg:text-6xl"
            >
              Where great talent meets{' '}
              <span className="relative whitespace-nowrap text-teal-600">
                great teams
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 12"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 9C48 3 152 3 198 9"
                    stroke="#D4AF37"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </motion.h1>

            <motion.p
              initial="hidden"
              animate="show"
              custom={2}
              variants={fadeUp}
              className="mt-6 max-w-lg text-lg leading-relaxed text-navy-500"
            >
              TRUNKS connects ambitious candidates with companies building the future. Smarter
              matching, faster applications, and a hiring process that respects your time.
            </motion.p>

            <motion.div
              initial="hidden"
              animate="show"
              custom={3}
              variants={fadeUp}
              className="mt-9 flex flex-col gap-4 sm:flex-row"
            >
              <Link to="/signup" className="btn-primary px-7 py-3.5 text-base">
                Find your next role
                <ArrowRight className="h-4.5 w-4.5" />
              </Link>
              <Link to="/signup" className="btn-outline px-7 py-3.5 text-base">
                Hire top talent
              </Link>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="show"
              custom={4}
              variants={fadeUp}
              className="mt-10 flex items-center gap-4"
            >
              <div className="flex -space-x-3">
                {['AS', 'DR', 'PN', 'WC'].map((initials) => (
                  <div
                    key={initials}
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-navy-600 text-[11px] font-bold text-white"
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <p className="text-sm text-navy-500">
                Joined by <span className="font-bold text-navy-800">24,000+</span> professionals
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="relative mx-auto max-w-md rounded-3xl border border-navy-100 bg-white p-6 shadow-card-hover">
              <div className="flex items-center justify-between">
                <p className="font-display text-sm font-bold text-navy-800">Your matches today</p>
                <span className="badge bg-teal-50 text-teal-700">Live</span>
              </div>
              <div className="mt-5 space-y-3">
                {jobs.slice(0, 3).map((job, i) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.15, duration: 0.5 }}
                    className="flex items-center gap-3 rounded-xl border border-navy-100 p-3 transition-colors hover:border-teal-200 hover:bg-teal-50/40"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white ${job.color}`}
                    >
                      {job.logo}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-navy-800">{job.title}</p>
                      <p className="text-xs text-navy-400">{job.company} · {job.location}</p>
                    </div>
                    <span className="shrink-0 text-xs font-bold text-teal-600">
                      {92 - i * 4}% match
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -right-6 -top-6 hidden items-center gap-2 rounded-2xl border border-navy-100 bg-white px-4 py-3 shadow-card-hover sm:flex"
            >
              <CheckCircle2 className="h-5 w-5 text-teal-500" />
              <div>
                <p className="text-xs font-bold text-navy-800">Offer accepted!</p>
                <p className="text-[11px] text-navy-400">Northwind AI</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="absolute -bottom-8 -left-6 hidden items-center gap-2 rounded-2xl border border-navy-100 bg-white px-4 py-3 shadow-card-hover sm:flex"
            >
              <Star className="h-5 w-5 fill-gold-400 text-gold-400" />
              <div>
                <p className="text-xs font-bold text-navy-800">92% profile match</p>
                <p className="text-[11px] text-navy-400">Updated live</p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Logo marquee */}
        <div className="border-y border-navy-100 bg-navy-50/50 py-8">
          <p className="section mb-5 text-center text-xs font-bold uppercase tracking-widest text-navy-400">
            Trusted by teams at
          </p>
          <div className="relative flex overflow-hidden">
            <div className="flex shrink-0 animate-marquee items-center gap-16 pr-16">
              {[...companies, ...companies].map((c, i) => (
                <div key={i} className="flex shrink-0 items-center gap-2.5 opacity-60 grayscale">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-[10px] font-bold text-white ${c.color}`}
                  >
                    {c.logo}
                  </div>
                  <span className="whitespace-nowrap font-display text-lg font-bold text-navy-600">
                    {c.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-navy-800">
        <div className="section grid grid-cols-2 gap-8 py-14 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <p className="font-display text-3xl font-extrabold text-white sm:text-4xl">
                {s.value}
              </p>
              <p className="mt-1.5 text-sm text-navy-300">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="about" className="section py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-sm font-bold uppercase tracking-widest text-teal-600">Why TRUNKS</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-navy-800 sm:text-4xl">
            Everything you need to hire (or get hired) faster
          </h2>
        </motion.div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card card-hover group p-7"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600 transition-all duration-300 group-hover:bg-teal-500 group-hover:text-white">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-lg font-bold text-navy-800">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-500">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-navy-50/70 py-24">
        <div className="section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl text-center"
          >
            <p className="text-sm font-bold uppercase tracking-widest text-teal-600">
              How it works
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-navy-800 sm:text-4xl">
              From sign up to signed offer
            </h2>
          </motion.div>

          <div className="relative mt-16 grid gap-10 md:grid-cols-4">
            <div
              className="absolute left-0 right-0 top-6 hidden h-0.5 bg-navy-100 md:block"
              aria-hidden
            />
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative text-center md:text-left"
              >
                <div className="relative z-10 mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-navy-700 font-display text-lg font-bold text-white shadow-card md:mx-0">
                  {i + 1}
                </div>
                <h3 className="mt-5 font-display text-lg font-bold text-navy-800">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-500">{s.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED JOBS */}
      <section className="section py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-bold uppercase tracking-widest text-teal-600">
              Fresh opportunities
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-navy-800 sm:text-4xl">
              Featured roles this week
            </h2>
          </motion.div>
          <Link to="/jobs" className="link-underline flex items-center gap-1.5 font-semibold text-teal-600">
            View all jobs <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.slice(0, 6).map((job, i) => (
            <JobCard key={job.id} job={job} style={{ animationDelay: `${i * 90}ms` }} />
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-navy-900 py-24">
        <div className="section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl text-center"
          >
            <p className="text-sm font-bold uppercase tracking-widest text-gold-400">
              Success stories
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-white sm:text-4xl">
              Loved by candidates and recruiters alike
            </h2>
          </motion.div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="rounded-2xl border border-navy-700 bg-navy-800 p-7 transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="flex gap-1 text-gold-400">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="h-4 w-4 fill-gold-400" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-navy-200">"{t.quote}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-500 text-xs font-bold text-white">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{t.name}</p>
                    <p className="text-xs text-navy-400">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-700 via-navy-600 to-teal-700 px-8 py-16 text-center sm:px-16"
        >
          <div
            className="absolute -right-10 -top-16 h-64 w-64 rounded-full bg-gold-400/20 blur-3xl"
            aria-hidden
          />
          <div
            className="absolute -bottom-16 -left-10 h-64 w-64 rounded-full bg-teal-300/20 blur-3xl"
            aria-hidden
          />
          <h2 className="relative font-display text-3xl font-extrabold text-white sm:text-4xl">
            Your next chapter starts here
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-navy-100">
            Join thousands of candidates and recruiters who trust TRUNKS to make hiring feel
            human again.
          </p>
          <div className="relative mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link to="/signup" className="btn-gold px-7 py-3.5 text-base">
              Create your free account
              <ArrowRight className="h-4.5 w-4.5" />
            </Link>
            <Link to="/jobs" className="btn-white px-7 py-3.5 text-base">
              Browse open roles
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  )
}
