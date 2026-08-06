import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, X, Calendar, MessageSquare, ExternalLink, Inbox } from 'lucide-react'
import DashboardLayout from '../layouts/DashboardLayout'
import { applications, stageSteps, statusStyles } from '../data/mockData'

const tabs = ['All', 'Applied', 'Under Review', 'Interview', 'Offer', 'Rejected']

function Stepper({ status, stage }) {
  const rejected = status === 'Rejected'
  return (
    <div className="flex items-center">
      {stageSteps.map((step, i) => {
        const idx = i + 1
        const isDone = idx < stage || (idx === stage && !rejected)
        const isCurrent = idx === stage
        const isFailedHere = rejected && idx === stage
        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition-colors ${
                  isFailedHere
                    ? 'bg-rose-500 text-white'
                    : isDone
                    ? 'bg-teal-500 text-white'
                    : isCurrent
                    ? 'bg-teal-100 text-teal-600 ring-2 ring-teal-400'
                    : 'bg-navy-100 text-navy-400'
                }`}
              >
                {isFailedHere ? <X className="h-3.5 w-3.5" /> : isDone ? <Check className="h-3.5 w-3.5" /> : idx}
              </div>
              <span className={`hidden text-[10px] font-medium sm:block ${isDone || isCurrent ? 'text-navy-600' : 'text-navy-300'}`}>
                {step}
              </span>
            </div>
            {i < stageSteps.length - 1 && (
              <div className={`mx-1.5 h-0.5 w-6 sm:w-10 ${idx < stage ? 'bg-teal-400' : 'bg-navy-100'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function Applications() {
  const [tab, setTab] = useState('All')

  const filtered = useMemo(
    () => (tab === 'All' ? applications : applications.filter((a) => a.status === tab)),
    [tab]
  )

  const counts = useMemo(() => {
    const c = { All: applications.length }
    tabs.slice(1).forEach((t) => (c[t] = applications.filter((a) => a.status === t).length))
    return c
  }, [])

  return (
    <DashboardLayout
      role="candidate"
      title="My Applications"
      subtitle="Track every application from submission to offer, all in one place."
    >
      <div className="flex flex-wrap gap-2 border-b border-navy-100 pb-4">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
              tab === t
                ? 'bg-navy-700 text-white shadow-card'
                : 'bg-white text-navy-500 hover:bg-navy-100'
            }`}
          >
            {t} <span className="opacity-70">({counts[t]})</span>
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="mt-6 space-y-4">
          {filtered.map((app, i) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="card card-hover p-6"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white ${app.color}`}>
                    {app.logo}
                  </div>
                  <div>
                    <Link to={`/jobs/${app.jobId}`} className="font-display font-bold text-navy-800 hover:text-teal-600">
                      {app.title}
                    </Link>
                    <p className="text-sm text-navy-400">{app.company}</p>
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-navy-400">
                      <Calendar className="h-3.5 w-3.5" />
                      Applied {new Date(app.appliedOn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <Stepper status={app.status} stage={app.stage} />
                  <span className={`badge shrink-0 ${statusStyles[app.status]}`}>{app.status}</span>
                </div>
              </div>

              {app.notes && (
                <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-navy-50/70 p-3.5 text-sm text-navy-600">
                  <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-navy-400" />
                  {app.notes}
                </div>
              )}

              <div className="mt-4 flex justify-end">
                <Link
                  to={`/jobs/${app.jobId}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-teal-700"
                >
                  View job details <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="card mt-6 flex flex-col items-center justify-center py-20 text-center">
          <Inbox className="h-10 w-10 text-navy-300" />
          <p className="mt-4 font-display font-bold text-navy-800">No applications here yet</p>
          <p className="mt-1 text-sm text-navy-400">Applications with this status will show up here.</p>
          <Link to="/jobs" className="btn-primary mt-5 px-5 py-2.5 text-sm">
            Browse jobs
          </Link>
        </div>
      )}
    </DashboardLayout>
  )
}
