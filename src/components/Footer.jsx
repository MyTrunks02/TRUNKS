import { Link } from 'react-router-dom'
import { Globe, MessageCircle, Link2, Mail } from 'lucide-react'
import Logo from './Logo'

const columns = [
  {
    title: 'Platform',
    links: [
      { label: 'Browse Jobs', to: '/jobs' },
      { label: 'Candidate Dashboard', to: '/dashboard' },
      { label: 'Recruiter Dashboard', to: '/recruiter' },
      { label: 'Pricing', to: '/#pricing' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/#about' },
      { label: 'Careers', to: '/jobs' },
      { label: 'Blog', to: '/#' },
      { label: 'Contact', to: '/#' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Sign up', to: '/signup' },
      { label: 'Log in', to: '/login' },
      { label: 'My Profile', to: '/profile' },
      { label: 'Applications', to: '/applications' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-navy-800 bg-navy-900 text-navy-200">
      <div className="section grid grid-cols-2 gap-10 py-16 md:grid-cols-5">
        <div className="col-span-2">
          <Logo inverted />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-navy-300">
            TRUNKS connects ambitious candidates with teams building the future. Faster hiring,
            better matches, zero noise.
          </p>
          <div className="mt-6 flex gap-3">
            {[Globe, MessageCircle, Link2, Mail].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-navy-700 text-navy-300 transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-500 hover:text-teal-400"
                aria-label="social link"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              {col.title}
            </h4>
            <ul className="mt-4 space-y-3">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="text-sm text-navy-300 transition-colors hover:text-teal-400"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-navy-800">
        <div className="section flex flex-col items-center justify-between gap-4 py-6 text-xs text-navy-400 sm:flex-row">
          <p>© {new Date().getFullYear()} TRUNKS, Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-teal-400">Privacy</a>
            <a href="#" className="hover:text-teal-400">Terms</a>
            <a href="#" className="hover:text-teal-400">Security</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
