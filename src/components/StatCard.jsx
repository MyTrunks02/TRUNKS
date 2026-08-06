import { TrendingUp } from 'lucide-react'

export default function StatCard({ label, value, delta, icon: Icon, accent = 'teal', style }) {
  const accents = {
    teal: 'bg-teal-50 text-teal-600',
    navy: 'bg-navy-50 text-navy-600',
    gold: 'bg-gold-50 text-gold-700',
  }

  return (
    <div
      className="card card-hover animate-fade-up p-6 opacity-0"
      style={{ animationFillMode: 'forwards', ...style }}
    >
      <div className="flex items-start justify-between">
        <p className="text-sm font-semibold text-navy-400">{label}</p>
        {Icon && (
          <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${accents[accent]}`}>
            <Icon className="h-4.5 w-4.5" />
          </span>
        )}
      </div>
      <p className="mt-3 font-display text-3xl font-extrabold text-navy-800">{value}</p>
      {delta && (
        <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-teal-600">
          <TrendingUp className="h-3.5 w-3.5" />
          {delta}
        </p>
      )}
    </div>
  )
}
