import {
  CheckCircle, AlertCircle, AlertTriangle, Clock, XCircle,
  Send, UserCheck, CheckCheck, HelpCircle, MapPin,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type BadgeStatus =
  // Computed shift status (coverage.ts)
  | 'covered' | 'partially_staffed' | 'at_risk' | 'under_covered'
  // Assignment response status (DB)
  | 'invited' | 'accepted' | 'declined' | 'no_response' | 'assigned'
  // Presentational live status (fixtures)
  | 'checked_in' | 'late' | 'issue' | 'completed'
  // Staff availability
  | 'available' | 'unavailable' | 'maybe'

interface BadgeConfig {
  icon: LucideIcon
  label: string
  bg: string
  text: string
}

const CONFIG: Record<BadgeStatus, BadgeConfig> = {
  covered:           { icon: CheckCircle,   label: 'Covered',          bg: 'bg-green-50',  text: 'text-green-700' },
  partially_staffed: { icon: AlertCircle,   label: 'Partially staffed',bg: 'bg-amber-50',  text: 'text-amber-700' },
  at_risk:           { icon: AlertTriangle, label: 'At risk',           bg: 'bg-red-50',    text: 'text-red-700' },
  under_covered:     { icon: AlertTriangle, label: 'Under-covered',     bg: 'bg-amber-50',  text: 'text-amber-700' },
  no_response:       { icon: Clock,         label: 'No response',       bg: 'bg-gray-100',  text: 'text-gray-600' },
  invited:           { icon: Send,          label: 'Invited',           bg: 'bg-blue-50',   text: 'text-blue-700' },
  accepted:          { icon: CheckCircle,   label: 'Accepted',          bg: 'bg-green-50',  text: 'text-green-700' },
  declined:          { icon: XCircle,       label: 'Declined',          bg: 'bg-red-50',    text: 'text-red-700' },
  assigned:          { icon: UserCheck,     label: 'Assigned',          bg: 'bg-blue-50',   text: 'text-blue-700' },
  checked_in:        { icon: MapPin,        label: 'Checked in',        bg: 'bg-green-50',  text: 'text-green-700' },
  late:              { icon: Clock,         label: 'Late',              bg: 'bg-amber-50',  text: 'text-amber-700' },
  issue:             { icon: AlertTriangle, label: 'Issue',             bg: 'bg-red-50',    text: 'text-red-700' },
  completed:         { icon: CheckCheck,    label: 'Completed',         bg: 'bg-green-50',  text: 'text-green-700' },
  available:         { icon: CheckCircle,   label: 'Available',         bg: 'bg-green-50',  text: 'text-green-700' },
  unavailable:       { icon: XCircle,       label: 'Unavailable',       bg: 'bg-gray-100',  text: 'text-gray-600' },
  maybe:             { icon: HelpCircle,    label: 'Maybe',             bg: 'bg-amber-50',  text: 'text-amber-700' },
}

interface StatusBadgeProps {
  status: string
  size?: 'sm' | 'md'
  showIcon?: boolean
}

export function StatusBadge({ status, size = 'sm', showIcon = true }: StatusBadgeProps) {
  const cfg = CONFIG[status as BadgeStatus]
  if (!cfg) return <span className="text-xs text-gray-400">{status}</span>
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm'
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'
  const Icon = cfg.icon
  return (
    <span className={`inline-flex items-center ${showIcon ? 'gap-1' : ''} px-2 py-1 font-medium rounded-full ${cfg.bg} ${cfg.text} ${textSize} whitespace-nowrap`}>
      {showIcon && <Icon className={iconSize} />}
      {cfg.label}
    </span>
  )
}
