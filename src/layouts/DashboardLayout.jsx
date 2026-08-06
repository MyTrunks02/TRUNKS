import { useState } from 'react'
import { Bell, Menu, Search, X } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import Logo from '../components/Logo'

export default function DashboardLayout({ role = 'candidate', title, subtitle, children }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-navy-50 md:flex">
      <div className="hidden md:block">
        <Sidebar role={role} />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-navy-900/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-64 animate-fade-in">
            <div className="relative h-full">
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-5 z-10 rounded-lg p-1.5 text-navy-500 hover:bg-navy-100"
              >
                <X className="h-5 w-5" />
              </button>
              <Sidebar role={role} />
            </div>
          </div>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-18 items-center justify-between gap-4 border-b border-navy-100 bg-white/90 px-5 py-3.5 backdrop-blur-lg md:px-8">
          <button
            className="rounded-lg p-2 text-navy-600 hover:bg-navy-50 md:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="md:hidden">
            <Logo />
          </div>

          <div className="relative hidden max-w-md flex-1 md:block">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-300" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-xl border-2 border-navy-100 bg-navy-50/60 py-2.5 pl-10 pr-4 text-sm text-navy-700 outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
            />
          </div>

          <div className="flex items-center gap-3">
            <button className="relative rounded-full p-2 text-navy-500 hover:bg-navy-50">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-gold-500 ring-2 ring-white" />
            </button>
            <div className="hidden h-9 w-9 items-center justify-center rounded-full bg-teal-500 text-xs font-bold text-white sm:flex">
              {role === 'recruiter' ? 'RH' : 'AS'}
            </div>
          </div>
        </header>

        <main className="px-5 py-8 md:px-8 lg:py-10">
          {(title || subtitle) && (
            <div className="mb-8 animate-fade-up">
              {title && (
                <h1 className="font-display text-2xl font-extrabold text-navy-800 sm:text-3xl">
                  {title}
                </h1>
              )}
              {subtitle && <p className="mt-1.5 text-navy-500">{subtitle}</p>}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  )
}
