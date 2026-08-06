import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Briefcase,
  UserRound,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  Quote,
} from 'lucide-react'
import Logo from '../components/Logo'

const roles = [
  {
    id: 'candidate',
    title: "I'm a Candidate",
    text: 'Looking for my next opportunity',
    icon: UserRound,
  },
  {
    id: 'recruiter',
    title: "I'm a Recruiter",
    text: 'Hiring for my team or company',
    icon: Briefcase,
  },
]

const perks = [
  'Personalized job matches, curated weekly',
  'One-click applications across every company',
  'Direct messages with hiring managers',
  'Full visibility into every application stage',
]

export default function Signup() {
  const navigate = useNavigate()
  const [role, setRole] = useState('candidate')
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Full name is required'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email address'
    if (form.password.length < 8) errs.password = 'Password must be at least 8 characters'
    if (form.confirm !== form.password) errs.confirm = 'Passwords do not match'
    return errs
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length === 0) {
      setSubmitted(true)
      setTimeout(() => {
        navigate(role === 'recruiter' ? '/recruiter' : '/dashboard')
      }, 1100)
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left branding panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-navy-800 via-navy-700 to-teal-800 p-12 text-white lg:flex">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-teal-400/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-10 h-80 w-80 rounded-full bg-gold-400/10 blur-3xl" />

        <Logo inverted className="relative" />

        <div className="relative">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-4xl font-extrabold leading-tight"
          >
            Join 24,000+ professionals moving their careers forward.
          </motion.h2>

          <div className="mt-8 space-y-4">
            {perks.map((perk, i) => (
              <motion.div
                key={perk}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <CheckCircle2 className="h-5 w-5 shrink-0 text-teal-300" />
                <span className="text-navy-100">{perk}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
        >
          <Quote className="h-6 w-6 text-gold-400" />
          <p className="mt-3 text-sm leading-relaxed text-navy-100">
            "I landed three interviews in my first week on TRUNKS. The matching was scary
            accurate."
          </p>
          <p className="mt-4 text-sm font-bold text-white">Sofia Belan</p>
          <p className="text-xs text-navy-300">DevOps Engineer, hired at Northwind AI</p>
        </motion.div>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center bg-navy-50 px-6 py-12 sm:px-12">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card p-10 text-center"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 text-teal-500">
                  <CheckCircle2 className="h-9 w-9" />
                </div>
                <h2 className="mt-5 font-display text-xl font-bold text-navy-800">
                  Welcome to TRUNKS!
                </h2>
                <p className="mt-2 text-sm text-navy-500">
                  Your account is ready. Redirecting you to your dashboard...
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4 }}
              >
                <h1 className="font-display text-2xl font-extrabold text-navy-800 sm:text-3xl">
                  Create your account
                </h1>
                <p className="mt-2 text-navy-500">
                  Already have one?{' '}
                  <Link to="/login" className="font-semibold text-teal-600 hover:text-teal-700">
                    Log in
                  </Link>
                </p>

                <div className="mt-7 grid grid-cols-2 gap-3">
                  {roles.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      className={`relative rounded-2xl border-2 p-4 text-left transition-all duration-200 ${
                        role === r.id
                          ? 'border-teal-500 bg-teal-50 shadow-glow'
                          : 'border-navy-100 bg-white hover:border-navy-200'
                      }`}
                    >
                      {role === r.id && (
                        <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-teal-500 text-white">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </span>
                      )}
                      <r.icon
                        className={`h-6 w-6 ${role === r.id ? 'text-teal-600' : 'text-navy-400'}`}
                      />
                      <p className="mt-2.5 text-sm font-bold text-navy-800">{r.title}</p>
                      <p className="mt-0.5 text-xs text-navy-400">{r.text}</p>
                    </button>
                  ))}
                </div>

                <form onSubmit={onSubmit} className="mt-7 space-y-4" noValidate>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-navy-700">
                      Full name
                    </label>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-navy-300" />
                      <input
                        name="name"
                        value={form.name}
                        onChange={onChange}
                        placeholder="Aanya Sharma"
                        className="input-field pl-11"
                      />
                    </div>
                    {errors.name && <p className="mt-1.5 text-xs font-medium text-rose-500">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-navy-700">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-navy-300" />
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={onChange}
                        placeholder="you@example.com"
                        className="input-field pl-11"
                      />
                    </div>
                    {errors.email && <p className="mt-1.5 text-xs font-medium text-rose-500">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-navy-700">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-navy-300" />
                      <input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={form.password}
                        onChange={onChange}
                        placeholder="At least 8 characters"
                        className="input-field pl-11 pr-11"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-navy-300 hover:text-navy-500"
                      >
                        {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1.5 text-xs font-medium text-rose-500">{errors.password}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-navy-700">
                      Confirm password
                    </label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-navy-300" />
                      <input
                        name="confirm"
                        type={showPassword ? 'text' : 'password'}
                        value={form.confirm}
                        onChange={onChange}
                        placeholder="Re-enter your password"
                        className="input-field pl-11"
                      />
                    </div>
                    {errors.confirm && (
                      <p className="mt-1.5 text-xs font-medium text-rose-500">{errors.confirm}</p>
                    )}
                  </div>

                  <button type="submit" className="btn-primary w-full py-3.5 text-base">
                    Create {role === 'recruiter' ? 'recruiter' : 'candidate'} account
                    <ArrowRight className="h-4.5 w-4.5" />
                  </button>

                  <p className="text-center text-xs text-navy-400">
                    By signing up, you agree to TRUNKS'{' '}
                    <a href="#" className="underline hover:text-teal-600">Terms</a> and{' '}
                    <a href="#" className="underline hover:text-teal-600">Privacy Policy</a>.
                  </p>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
