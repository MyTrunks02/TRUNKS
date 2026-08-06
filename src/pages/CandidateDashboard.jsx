import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FileText,
  Calendar,
  Award,
  Eye,
  Search,
  UserCog,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react'
import DashboardLayout from '../layouts/DashboardLayout'
import StatCard from '../components/StatCard'
import JobCard from '../components/JobCard'
import {
  candidateStats,
  applications,
  recommendedJobs,
  candidateProfile,
  statusStyles,
} from '../data/mockData'

const statIcons = [FileText, Calendar, Award, Eye]

const quickActions = [
  { to: '/jobs', label: 'Browse Jobs', icon: Search, accent: 'bg-teal-500' },
  { to: '/profile', label: 'Update Resume', icon: FileText, accent: 'bg-navy-600' },
  { to: '/profile', label: 'Edit Profile', icon: UserCog, accent: 'bg-gold-500' },
  { to: '/applications', label: 'My Applications', icon: Calendar, accent: 'bg-teal-700' },
]

export default function CandidateDashboard() {
  return (
    <DashboardLayout
      role="candidate"
      title={`Welcome back, ${candidateProfile.name.split(' ')[0]} 👋`}
      subtitle="Here's what's happening with your job search today."
    >
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {candidateStats.map((s, i) => (
          <StatCard key={s.label} {...s} icon={statIcons[i]} style={{ animationDelay: `${i * 80}ms` }} />
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((a, i) => (
          <Link
            key={a.label}
            to={a.to}
            className="card card-hover group flex animate-fade-up items-center gap-4 p-5 opacity-0"
            style={{ animationDelay: `${300 + i * 80}ms`, animationFillMode: 'forwards' }}
          >
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white transition-transform duration-300 group-hover:scale-110 ${a.accent}`}
            >
              <a.icon className="h-5 w-5" />
            </span>
            <span className="text-sm font-bold text-navy-800">{a.label}</span>
            <ArrowUpRight className="ml-auto h-4 w-4 text-navy-300 transition-all group-hover:translate-x-0.5 group-hover:text-teal-500" />
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-navy-800">Recent Applications</h2>
            <Link to="/applications" className="text-sm font-semibold text-teal-600 hover:text-teal-700">
              View all
            </Link>
          </div>

          <div className="card mt-4 divide-y divide-navy-100">
            {applications.slice(0, 4).map((app, i) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-4 p-5 transition-colors hover:bg-navy-50/60"
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white ${app.color}`}
                >
                  {app.logo}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-navy-800">{app.title}</p>
                  <p className="text-xs text-navy-400">
                    {app.company} · Applied {new Date(app.appliedOn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <span className={`badge shrink-0 ${statusStyles[app.status]}`}>{app.status}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-display text-lg font-bold text-navy-800">Profile Strength</h2>
          <div className="card mt-4 p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-navy-700 font-display text-sm font-bold text-white">
                {candidateProfile.avatarInitials}
              </div>
              <span className="badge bg-gold-100 text-gold-800">
                <Sparkles className="h-3 w-3" />
                {candidateProfile.profileStrength}%
              </span>
            </div>
            <p className="mt-4 text-sm font-bold text-navy-800">{candidateProfile.name}</p>
            <p className="text-xs text-navy-400">{candidateProfile.title}</p>

            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-navy-100">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${candidateProfile.profileStrength}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                className="h-full rounded-full bg-gradient-to-r from-teal-400 to-teal-600"
              />
            </div>
            <p className="mt-2 text-xs text-navy-400">
              Add a portfolio link to reach 100% and get 3x more recruiter views.
            </p>
            <Link to="/profile" className="btn-outline mt-5 w-full py-2.5 text-sm">
              Complete your profile
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-navy-800">Recommended for You</h2>
          <Link to="/jobs" className="text-sm font-semibold text-teal-600 hover:text-teal-700">
            View all jobs
          </Link>
        </div>
        <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {recommendedJobs.map((job, i) => (
            <JobCard key={job.id} job={job} style={{ animationDelay: `${i * 90}ms` }} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
