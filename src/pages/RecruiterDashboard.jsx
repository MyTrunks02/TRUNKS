import { motion } from 'framer-motion'
import {
  Users,
  Briefcase,
  CalendarClock,
  Timer,
  Eye,
  MoreHorizontal,
  Plus,
  ArrowUpRight,
} from 'lucide-react'
import DashboardLayout from '../layouts/DashboardLayout'
import StatCard from '../components/StatCard'
import {
  recruiterStats,
  recruiterJobs,
  recruiterPipeline,
  recentApplicants,
} from '../data/mockData'

const statIcons = [Briefcase, Users, CalendarClock, Timer]

const statusStyles = {
  Active: 'bg-teal-100 text-teal-700',
  Paused: 'bg-gold-100 text-gold-800',
  Closed: 'bg-navy-100 text-navy-500',
}

export default function RecruiterDashboard() {
  const maxCount = Math.max(...recruiterPipeline.map((p) => p.count))

  return (
    <DashboardLayout
      role="recruiter"
      title="Welcome back, Riya 👋"
      subtitle="Here's how your open roles are performing this week."
    >
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {recruiterStats.map((s, i) => (
          <StatCard key={s.label} {...s} icon={statIcons[i]} accent={i === 3 ? 'gold' : 'teal'} style={{ animationDelay: `${i * 80}ms` }} />
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Posted Jobs */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-navy-800">Your Job Posts</h2>
            <button className="btn-primary px-4 py-2 text-sm">
              <Plus className="h-4 w-4" /> Post a Job
            </button>
          </div>

          <div className="card mt-4 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b border-navy-100 text-xs uppercase tracking-wider text-navy-400">
                    <th className="px-5 py-3.5 font-semibold">Role</th>
                    <th className="px-5 py-3.5 font-semibold">Applicants</th>
                    <th className="px-5 py-3.5 font-semibold">Views</th>
                    <th className="px-5 py-3.5 font-semibold">Status</th>
                    <th className="px-5 py-3.5 font-semibold" />
                  </tr>
                </thead>
                <tbody>
                  {recruiterJobs.map((job, i) => (
                    <motion.tr
                      key={job.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-navy-50 transition-colors last:border-0 hover:bg-navy-50/60"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-navy-800">{job.title}</p>
                        <p className="text-xs text-navy-400">Posted {job.posted}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-semibold text-navy-700">{job.applicants}</span>
                        {job.newApplicants > 0 && (
                          <span className="ml-2 badge bg-teal-50 text-teal-700">+{job.newApplicants} new</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-navy-500">
                        <span className="inline-flex items-center gap-1.5">
                          <Eye className="h-3.5 w-3.5" /> {job.views.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`badge ${statusStyles[job.status]}`}>{job.status}</span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button className="rounded-lg p-1.5 text-navy-400 hover:bg-navy-100 hover:text-navy-600">
                          <MoreHorizontal className="h-4.5 w-4.5" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pipeline + Recent Applicants */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-display font-bold text-navy-800">Hiring Pipeline</h3>
            <div className="mt-5 space-y-4">
              {recruiterPipeline.map((p, i) => (
                <div key={p.stage}>
                  <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-navy-500">
                    <span>{p.stage}</span>
                    <span className="text-navy-700">{p.count}</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-navy-100">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(p.count / maxCount) * 100}%` }}
                      transition={{ duration: 0.9, delay: i * 0.1, ease: 'easeOut' }}
                      className="h-full rounded-full bg-gradient-to-r from-teal-400 to-navy-600"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-navy-800">Recent Applicants</h3>
              <a href="#" className="text-xs font-semibold text-teal-600 hover:text-teal-700">View all</a>
            </div>
            <div className="mt-4 space-y-4">
              {recentApplicants.map((a, i) => (
                <motion.div
                  key={a.name}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy-600 text-xs font-bold text-white">
                    {a.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-navy-800">{a.name}</p>
                    <p className="truncate text-xs text-navy-400">{a.role} · {a.appliedOn}</p>
                  </div>
                  <span
                    className={`shrink-0 text-xs font-bold ${
                      a.match >= 90 ? 'text-teal-600' : a.match >= 80 ? 'text-gold-600' : 'text-navy-400'
                    }`}
                  >
                    {a.match}%
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="card flex items-center justify-between bg-gradient-to-br from-navy-700 to-teal-700 p-6 text-white">
            <div>
              <p className="font-display font-bold">Upgrade to Pro</p>
              <p className="mt-1 text-xs text-navy-100">Unlock advanced candidate analytics</p>
            </div>
            <ArrowUpRight className="h-5 w-5" />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
