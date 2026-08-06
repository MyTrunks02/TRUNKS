import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  User,
  LogOut,
  Users,
  BarChart3,
  Plus,
} from 'lucide-react'
import Logo from './Logo'

const candidateLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/jobs', label: 'Browse Jobs', icon: Briefcase },
  { to: '/applications', label: 'Applications', icon: FileText },
  { to: '/profile', label: 'My Profile', icon: User },
]

const recruiterLinks = [
  { to: '/recruiter', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/jobs', label: 'Job Board', icon: Briefcase },
  { to: '/recruiter', label: 'Candidates', icon: Users },
  { to: '/recruiter', label: 'Analytics', icon: BarChart3 },
]

export default function Sidebar({ role = 'candidate' }) {
  const navigate = useNavigate()
  const links = role === 'recruiter' ? recruiterLinks : candidateLinks

  return (
    <aside className="sticky top-0 flex h-screen w-64 flex-col border-r border-navy-100 bg-white">
      <div className="flex h-18 items-center border-b border-navy-100 px-6 py-5">
        <Logo />
      </div>

      {role === 'recruiter' && (
        <div className="px-4 pt-5">
          <button className="btn-primary w-full py-2.5 text-sm">
            <Plus className="h-4 w-4" />
            Post a Job
          </button>
        </div>
      )}

      <nav className="flex-1 space-y-1 px-4 py-6">
        {links.map((l, i) => (
          <NavLink
            key={l.label + i}
            to={l.to}
            end
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-teal-50 text-teal-700'
                  : 'text-navy-500 hover:bg-navy-50 hover:text-navy-800'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <l.icon
                  className={`h-4.5 w-4.5 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'text-teal-600' : 'text-navy-400'
                  }`}
                />
                {l.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-navy-100 p-4">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-600 text-xs font-bold text-white">
            {role === 'recruiter' ? 'RH' : 'AS'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-navy-800">
              {role === 'recruiter' ? 'Riya Hobson' : 'Aanya Sharma'}
            </p>
            <p className="truncate text-xs text-navy-400">
              {role === 'recruiter' ? 'Talent Partner' : 'Product Designer'}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/')}
          className="mt-2 flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-navy-400 transition-colors hover:bg-rose-50 hover:text-rose-500"
        >
          <LogOut className="h-4.5 w-4.5" />
          Log out
        </button>
      </div>
    </aside>
  )
}
