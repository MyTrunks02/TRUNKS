import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  MapPin,
  Clock,
  Briefcase,
  DollarSign,
  Bookmark,
  Share2,
  ChevronRight,
  CheckCircle2,
  Building2,
  X,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import JobCard from '../components/JobCard'
import { jobs } from '../data/mockData'

export default function JobDetail() {
  const { id } = useParams()
  const job = jobs.find((j) => String(j.id) === id)
  const [saved, setSaved] = useState(false)
  const [applied, setApplied] = useState(false)
  const [showModal, setShowModal] = useState(false)

  if (!job) {
    return (
      <div className="min-h-screen bg-navy-50">
        <Navbar />
        <div className="section flex flex-col items-center justify-center py-32 text-center">
          <h1 className="font-display text-2xl font-bold text-navy-800">Job not found</h1>
          <p className="mt-2 text-navy-500">This listing may have been closed or removed.</p>
          <Link to="/jobs" className="btn-primary mt-6 px-6 py-3">
            Browse all jobs
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const similar = jobs.filter((j) => j.id !== job.id && j.department === job.department).slice(0, 3)

  const confirmApply = () => {
    setApplied(true)
    setShowModal(false)
  }

  return (
    <div className="min-h-screen bg-navy-50">
      <Navbar />

      <div className="bg-white">
        <div className="section flex items-center gap-1.5 py-4 text-xs text-navy-400">
          <Link to="/jobs" className="hover:text-teal-600">Jobs</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-navy-400">{job.department}</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="truncate text-navy-600">{job.title}</span>
        </div>
      </div>

      <div className="border-b border-navy-100 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="section flex flex-col gap-6 pb-8 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-4">
            <div
              className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-card ${job.color}`}
            >
              {job.logo}
            </div>
            <div>
              <h1 className="font-display text-2xl font-extrabold text-navy-800 sm:text-3xl">
                {job.title}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-navy-500">
                <span className="inline-flex items-center gap-1.5 font-semibold text-navy-700">
                  <Building2 className="h-4 w-4" /> {job.company}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" /> {job.remote ? `${job.location} · Remote` : job.location}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4" /> Posted {job.posted}
                </span>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <button
              onClick={() => setSaved((s) => !s)}
              className={`flex h-11 w-11 items-center justify-center rounded-xl border-2 transition-colors ${
                saved ? 'border-gold-400 bg-gold-50 text-gold-600' : 'border-navy-100 text-navy-400 hover:border-gold-300 hover:text-gold-500'
              }`}
            >
              <Bookmark className={`h-5 w-5 ${saved ? 'fill-gold-500' : ''}`} />
            </button>
            <button className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-navy-100 text-navy-400 hover:border-navy-300 hover:text-navy-600">
              <Share2 className="h-5 w-5" />
            </button>
            <button
              disabled={applied}
              onClick={() => setShowModal(true)}
              className={applied ? 'btn-outline px-7 py-3 text-base' : 'btn-primary px-7 py-3 text-base'}
            >
              {applied ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-teal-500" /> Applied
                </>
              ) : (
                'Apply Now'
              )}
            </button>
          </div>
        </motion.div>
      </div>

      <div className="section grid gap-10 py-12 lg:grid-cols-[1fr_320px]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-10"
        >
          <section>
            <h2 className="font-display text-lg font-bold text-navy-800">About this role</h2>
            <p className="mt-3 leading-relaxed text-navy-600">{job.description}</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-navy-800">Responsibilities</h2>
            <ul className="mt-3 space-y-2.5">
              {job.responsibilities.map((r) => (
                <li key={r} className="flex items-start gap-3 text-navy-600">
                  <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-teal-500" />
                  {r}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-navy-800">Requirements</h2>
            <ul className="mt-3 space-y-2.5">
              {job.requirements.map((r) => (
                <li key={r} className="flex items-start gap-3 text-navy-600">
                  <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-teal-500" />
                  {r}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-navy-800">Benefits &amp; Perks</h2>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-2">
              {job.benefits.map((b) => (
                <div key={b} className="flex items-center gap-2.5 rounded-xl bg-teal-50/70 px-4 py-3 text-sm font-medium text-teal-800">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-500" />
                  {b}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-navy-800">Skills &amp; Tags</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {job.tags.map((t) => (
                <span key={t} className="badge bg-navy-100 text-navy-700">{t}</span>
              ))}
            </div>
          </section>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <div className="card sticky top-24 p-6">
            <h3 className="font-display font-bold text-navy-800">Job Overview</h3>
            <div className="mt-4 space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                  <DollarSign className="h-4.5 w-4.5" />
                </span>
                <div>
                  <p className="text-xs text-navy-400">Salary</p>
                  <p className="font-semibold text-navy-800">{job.salary}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-50 text-navy-600">
                  <Briefcase className="h-4.5 w-4.5" />
                </span>
                <div>
                  <p className="text-xs text-navy-400">Job Type</p>
                  <p className="font-semibold text-navy-800">{job.type} · {job.level}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-50 text-gold-700">
                  <MapPin className="h-4.5 w-4.5" />
                </span>
                <div>
                  <p className="text-xs text-navy-400">Location</p>
                  <p className="font-semibold text-navy-800">{job.location}{job.remote ? ' (Remote OK)' : ''}</p>
                </div>
              </div>
            </div>
            <button
              disabled={applied}
              onClick={() => setShowModal(true)}
              className={applied ? 'btn-outline mt-6 w-full py-3' : 'btn-primary mt-6 w-full py-3'}
            >
              {applied ? 'Application Submitted' : 'Apply Now'}
            </button>
          </div>

          <div className="card p-6">
            <h3 className="font-display font-bold text-navy-800">About {job.company}</h3>
            <div className="mt-4 flex items-center gap-3">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl text-sm font-bold text-white ${job.color}`}>
                {job.logo}
              </div>
              <div>
                <p className="text-sm font-bold text-navy-800">{job.company}</p>
                <p className="text-xs text-navy-400">{job.department} · 200-500 employees</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-navy-500">
              {job.company} is a fast-growing company building modern tools trusted by teams
              worldwide. Join a team that values craft, ownership, and impact.
            </p>
          </div>
        </motion.aside>
      </div>

      {similar.length > 0 && (
        <div className="section pb-20">
          <h2 className="font-display text-xl font-bold text-navy-800">Similar Roles</h2>
          <div className="mt-5 grid gap-6 md:grid-cols-3">
            {similar.map((j, i) => (
              <JobCard key={j.id} job={j} style={{ animationDelay: `${i * 90}ms` }} />
            ))}
          </div>
        </div>
      )}

      <Footer />

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/50 p-6"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-2xl bg-white p-7 shadow-card-hover"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute right-4 top-4 rounded-lg p-1.5 text-navy-400 hover:bg-navy-50"
              >
                <X className="h-5 w-5" />
              </button>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-sm font-bold text-white ${job.color}`}>
                {job.logo}
              </div>
              <h3 className="mt-4 font-display text-xl font-bold text-navy-800">
                Apply to {job.title}
              </h3>
              <p className="mt-1.5 text-sm text-navy-500">
                We'll send your TRUNKS profile and resume to {job.company}. You can track this
                application from your dashboard afterward.
              </p>
              <div className="mt-6 flex gap-3">
                <button onClick={() => setShowModal(false)} className="btn-ghost flex-1 py-2.5 text-sm">
                  Cancel
                </button>
                <button onClick={confirmApply} className="btn-primary flex-1 py-2.5 text-sm">
                  Confirm &amp; Apply
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
