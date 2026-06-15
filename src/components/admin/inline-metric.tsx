import type { LucideIcon } from 'lucide-react'

interface InlineMetricProps {
  icon: LucideIcon
  iconClass: string
  iconBg: string
  label: string
  sublabel?: string
  value: number
}

export function InlineMetric({ icon: Icon, iconClass, iconBg, label, sublabel, value }: InlineMetricProps) {
  return (
    <div className="flex-1 bg-white border border-border-rostr px-5 py-4 flex items-center gap-3 min-w-0 rounded-lg">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg}`}>
        <Icon className={`w-4 h-4 ${iconClass}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary truncate">{label}</p>
        {sublabel && <p className="text-xs text-text-secondary truncate">{sublabel}</p>}
      </div>
      <span className="text-2xl font-bold tabular-nums text-text-primary ml-2">{value}</span>
    </div>
  )
}
