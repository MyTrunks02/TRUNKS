import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, MapPin, SlidersHorizontal, X, SearchX } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import JobCard from '../components/JobCard'
import { jobs } from '../data/mockData'

const departments = ['Design', 'Engineering', 'Data', 'Marketing']
const types = ['Full-time', 'Contract']
const levels = ['Junior', 'Mid-level', 'Senior', 'Lead']

export default function JobsBrowse() {
  const [query, setQuery] = useState('')
  const [remoteOnly, setRemoteOnly] = useState(false)
  const [dept, setDept] = useState([])
  const [type, setType] = useState([])
  const [level, setLevel] = useState([])
  const [sort, setSort] = useState('recent')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const toggle = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val])

  const filtered = useMemo(() => {
    let result = jobs.filter((job) => {
      const matchesQuery =
        !query ||
        job.title.toLowerCase().includes(query.toLowerCase()) ||
        job.company.toLowerCase().includes(query.toLowerCase()) ||
        job.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      const matchesRemote = !remoteOnly || job.remote
      const matchesDept = dept.length === 0 || dept.includes(job.department)
      const matchesType = type.length === 0 || type.includes(job.type)
      const matchesLevel = level.length === 0 || level.includes(job.level)
      return matchesQuery && matchesRemote && matchesDept && matchesType && matchesLevel
    })
    if (sort === 'salary') {
      result = [...result].sort((a, b) => parseInt(b.salary.replace(/\D/g, '')) - parseInt(a.salary.replace(/\D/g, '')))
    }
    return result
  }, [query, remoteOnly, dept, type, level, sort])

  const activeFilterCount = dept.length + type.length + level.length + (remoteOnly ? 1 : 0)

  const clearAll = () => {
    setDept([])
    setType([])
    setLevel([])
    setRemoteOnly(false)
  }

  const FilterGroup = ({ title, options, active, onToggle }) => (
    <div className="border-b border-navy-100 py-5 first:pt-0 last:border-0">
      <p className="text-sm font-bold text-navy-800">{title}</p>
      <div className="mt-3 space-y-2.5">
        {options.map((opt) => (
          <label key={opt} className="flex cursor-pointer items-center gap-2.5 text-sm text-navy-600">
            <input
              type="checkbox"
              checked={active.includes(opt)}
              onChange={() => onToggle(opt)}
              className="h-4 w-4 rounded border-navy-300 text-teal-500 focus:ring-teal-500"
            />
            {opt}
          </label>
        ))}
      </div>
    </div>
  )

  const FiltersPanel = (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-display font-bold text-navy-800">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </h3>
        {activeFilterCount > 0 && (
          <button onClick={clearAll} className="text-xs font-semibold text-teal-600 hover:text-teal-700">
            Clear all
          </button>
        )}
      </div>

      <div className="border-b border-navy-100 py-5">
        <label className="flex cursor-pointer items-center justify-between">
          <span className="text-sm font-bold text-navy-800">Remote only</span>
          <button
            role="switch"
            aria-checked={remoteOnly}
            onClick={() => setRemoteOnly((r) => !r)}
            className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${
              remoteOnly ? 'bg-teal-500' : 'bg-navy-200'
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
                remoteOnly ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </label>
      </div>

      <FilterGroup title="Department" options={departments} active={dept} onToggle={(v) => toggle(dept, setDept, v)} />
      <FilterGroup title="Job Type" options={types} active={type} onToggle={(v) => toggle(type, setType, v)} />
      <FilterGroup title="Experience Level" options={levels} active={level} onToggle={(v) => toggle(level, setLevel, v)} />
    </div>
  )

  return (
    <div className="min-h-screen bg-navy-50">
      <Navbar />

      <div className="bg-navy-800 py-14">
        <div className="section">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-display text-3xl font-extrabold text-white sm:text-4xl"
          >
            Find your next opportunity
          </motion.h1>
          <p className="mt-2 text-navy-300">{jobs.length} open roles from vetted companies</p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 flex flex-col gap-3 rounded-2xl bg-white p-2.5 shadow-card-hover sm:flex-row"
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-300" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Job title, company, or skill"
                className="h-12 w-full rounded-xl border-0 pl-11 pr-4 text-navy-800 outline-none placeholder:text-navy-300 focus:ring-2 focus:ring-teal-500/30"
              />
            </div>
            <div className="relative sm:w-56">
              <MapPin className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-300" />
              <input
                placeholder="Location"
                className="h-12 w-full rounded-xl border-0 bg-navy-50/60 pl-11 pr-4 text-navy-800 outline-none placeholder:text-navy-300 focus:ring-2 focus:ring-teal-500/30 sm:bg-transparent"
              />
            </div>
            <button className="btn-primary h-12 px-8">Search</button>
          </motion.div>
        </div>
      </div>

      <div className="section py-10">
        <div className="mb-5 flex items-center justify-between lg:hidden">
          <button
            onClick={() => setFiltersOpen(true)}
            className="btn-outline gap-2 px-4 py-2 text-sm"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <div className="hidden lg:block">{FiltersPanel}</div>

          {filtersOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-navy-900/40" onClick={() => setFiltersOpen(false)} />
              <div className="absolute inset-y-0 right-0 w-full max-w-xs overflow-y-auto bg-navy-50 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <p className="font-display font-bold text-navy-800">Filters</p>
                  <button onClick={() => setFiltersOpen(false)} className="rounded-lg p-1.5 hover:bg-navy-100">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                {FiltersPanel}
                <button onClick={() => setFiltersOpen(false)} className="btn-primary mt-4 w-full py-3">
                  Show {filtered.length} results
                </button>
              </div>
            </div>
          )}

          <div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-navy-500">
                Showing <span className="font-bold text-navy-800">{filtered.length}</span> of {jobs.length} jobs
              </p>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-lg border-2 border-navy-100 bg-white px-3 py-2 text-sm font-semibold text-navy-600 outline-none focus:border-teal-500"
              >
                <option value="recent">Most recent</option>
                <option value="salary">Highest salary</option>
              </select>
            </div>

            {filtered.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-2">
                {filtered.map((job, i) => (
                  <JobCard key={job.id} job={job} style={{ animationDelay: `${Math.min(i, 8) * 70}ms` }} />
                ))}
              </div>
            ) : (
              <div className="card flex flex-col items-center justify-center py-20 text-center">
                <SearchX className="h-10 w-10 text-navy-300" />
                <p className="mt-4 font-display font-bold text-navy-800">No jobs match your filters</p>
                <p className="mt-1 text-sm text-navy-400">Try adjusting your search or clearing filters.</p>
                <button
                  onClick={() => {
                    clearAll()
                    setQuery('')
                  }}
                  className="btn-outline mt-5 px-5 py-2 text-sm"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
