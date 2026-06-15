import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  value: number | string
  label: string
  sublabel: string
  icon?: LucideIcon
  iconClass?: string
}

// Rendered as a flex child inside a single bordered panel (admin/page.tsx wraps these)
export function StatCard({ value, label, sublabel, icon: Icon, iconClass }: StatCardProps) {
  return (
    <div className="flex-1 bg-white border border-border-rostr p-5 flex flex-col gap-1 min-w-0 rounded-lg" aria-label={`${value} — ${label}`}>
      <div className="flex items-start justify-between gap-2">
        <span className="text-4xl font-bold tabular-nums text-text-primary leading-none">{value}</span>
        {Icon && (
          <div className="mt-0.5 p-1.5 rounded-lg bg-gray-50">
            <Icon className={`w-4 h-4 ${iconClass ?? 'text-text-secondary'}`} />
          </div>
        )}
      </div>
      <p className="text-sm font-medium text-text-primary mt-1">{label}</p>
      <p className="text-xs text-text-secondary">{sublabel}</p>
    </div>
  )
}
