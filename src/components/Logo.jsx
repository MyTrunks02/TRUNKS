import { Link } from 'react-router-dom'

export default function Logo({ inverted = false, className = '', to = '/' }) {
  const wordColor = inverted ? 'text-white' : 'text-navy-700'
  const accentColor = 'text-teal-500'

  return (
    <Link to={to} className={`group inline-flex items-center gap-2.5 ${className}`}>
      <span className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-navy-600 shadow-card transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
        <svg viewBox="0 0 64 64" className="h-5 w-5" aria-hidden="true">
          <rect x="10" y="16" width="44" height="9" rx="2" fill="#2D9B8F" />
          <rect x="27.5" y="16" width="9" height="34" rx="2" fill="#2D9B8F" />
          <circle cx="47" cy="47" r="5.5" fill="#D4AF37" />
        </svg>
      </span>
      <span className={`font-display text-xl font-extrabold tracking-tight ${wordColor}`}>
        TRUNKS<span className={accentColor}>.</span>
      </span>
    </Link>
  )
}
