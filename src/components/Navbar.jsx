import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Logo from './Logo'

const links = [
  { to: '/jobs', label: 'Browse Jobs' },
  { to: '/dashboard', label: 'Candidates' },
  { to: '/recruiter', label: 'For Recruiters' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? 'bg-white/85 shadow-soft backdrop-blur-lg' : 'bg-transparent'
      }`}
    >
      <nav className="section flex h-18 items-center justify-between py-3.5">
        <Logo />

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `link-underline text-sm font-semibold transition-colors ${
                  isActive ? 'text-teal-600' : 'text-navy-600 hover:text-navy-900'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <button onClick={() => navigate('/login')} className="btn-ghost px-4 py-2 text-sm">
            Log in
          </button>
          <button onClick={() => navigate('/signup')} className="btn-primary px-5 py-2.5 text-sm">
            Get Started
          </button>
        </div>

        <button
          className="inline-flex items-center justify-center rounded-lg p-2 text-navy-700 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <div
        className={`overflow-hidden bg-white shadow-soft transition-[max-height] duration-300 ease-in-out md:hidden ${
          open ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="flex flex-col gap-1 px-6 pb-6 pt-2">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-semibold text-navy-700 hover:bg-navy-50"
            >
              {l.label}
            </Link>
          ))}
          <div className="mt-3 flex gap-3">
            <Link to="/login" onClick={() => setOpen(false)} className="btn-outline flex-1 py-2.5 text-sm">
              Log in
            </Link>
            <Link to="/signup" onClick={() => setOpen(false)} className="btn-primary flex-1 py-2.5 text-sm">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
