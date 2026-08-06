import { Link } from 'react-router-dom'
import { MapPin, Clock, Bookmark, ArrowUpRight } from 'lucide-react'
import { useState } from 'react'

export default function JobCard({ job, style }) {
  const [saved, setSaved] = useState(false)

  return (
    <div
      className="card card-hover group relative animate-fade-up overflow-hidden p-6 opacity-0"
      style={{ animationFillMode: 'forwards', ...style }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white shadow-card ${job.color}`}
          >
            {job.logo}
          </div>
          <div className="min-w-0">
            <Link
              to={`/jobs/${job.id}`}
              className="line-clamp-1 font-display text-base font-bold text-navy-800 transition-colors group-hover:text-teal-600"
            >
              {job.title}
            </Link>
            <p className="text-sm text-navy-400">{job.company}</p>
          </div>
        </div>
        <button
          onClick={() => setSaved((s) => !s)}
          className={`shrink-0 rounded-lg p-2 transition-colors ${
            saved ? 'text-gold-500' : 'text-navy-300 hover:text-gold-500'
          }`}
          aria-label="Save job"
        >
          <Bookmark className={`h-5 w-5 ${saved ? 'fill-gold-500' : ''}`} />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-navy-400">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5" />
          {job.remote ? `${job.location} · Remote` : job.location}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          {job.posted}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {job.tags.map((tag) => (
          <span
            key={tag}
            className="badge bg-navy-50 text-navy-600 transition-colors group-hover:bg-teal-50 group-hover:text-teal-700"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-navy-100 pt-4">
        <div>
          <p className="text-sm font-bold text-navy-800">{job.salary}</p>
          <p className="text-xs text-navy-400">{job.type} · {job.level}</p>
        </div>
        <Link
          to={`/jobs/${job.id}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-teal-600 transition-all group-hover:gap-2"
        >
          View
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
