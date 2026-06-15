import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { Clock, AlertTriangle, UserCircle, Package } from 'lucide-react'
import { StatusBadge } from '@/components/shared/status-badge'
import type { Shift, ShiftAssignment } from '@/lib/domain/types'

interface Props {
  assignment: ShiftAssignment
  shift: Shift
}

export function AcceptedShiftCard({ assignment, shift }: Props) {
  const dateFmt       = format(parseISO(shift.date), 'EEE d MMM')
  const timeStr       = `${shift.startTime.slice(0, 5)}–${shift.endTime.slice(0, 5)}`
  const displayStatus = assignment.liveStatus ?? assignment.status
  const isLateOrIssue = assignment.liveStatus === 'late' || assignment.liveStatus === 'issue'
  const isCompleted   = assignment.liveStatus === 'completed'
  const retailer      = shift.location?.retailer ?? ''
  const storeName     = shift.location?.storeName ?? ''
  const storeLabel    = [retailer, storeName].filter(Boolean).join(' · ')
  const address       = [shift.location?.address, shift.location?.suburb, shift.location?.state]
    .filter(Boolean).join(', ')
  const role          = assignment.role ?? shift.roleFocus ?? ''
  const equipment     = shift.equipment ?? ''

  return (
    <div className={`bg-white border border-border-rostr p-4 space-y-3 ${isCompleted ? 'opacity-70' : ''} rounded-lg`}>
      {/* Title + badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-text-primary">
            {shift.name ?? shift.campaign?.name ?? 'Shift'}
          </p>
          {storeLabel && <p className="text-xs text-text-secondary mt-0.5">{storeLabel}</p>}
          {address && <p className="text-xs text-text-secondary/70">{address}</p>}
        </div>
        <StatusBadge status={displayStatus} size="sm" />
      </div>

      {/* Date + time */}
      <div className="flex items-center gap-1.5 text-xs text-text-secondary">
        <Clock className="w-3.5 h-3.5 flex-shrink-0" />
        <span>{dateFmt} · {timeStr}</span>
      </div>

      {/* Role */}
      {role && (
        <div className="flex items-center gap-1.5 text-xs text-text-secondary">
          <UserCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{role}</span>
        </div>
      )}

      {/* Equipment */}
      {equipment && (
        <div className="flex items-center gap-1.5 text-xs text-text-secondary">
          <Package className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{equipment}</span>
        </div>
      )}

      {/* Alert banners */}
      {isLateOrIssue && (
        <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-100 px-2.5 py-2 rounded-lg">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>
            {assignment.liveStatus === 'late'
              ? 'Late arrival flagged to operations'
              : 'Issue reported · operations has been notified'}
          </span>
        </div>
      )}

      {/* View details */}
      <Link
        href={`/staff/shifts/${shift.id}`}
        className="flex items-center gap-1 text-xs text-indigo-action hover:text-indigo-hover font-medium transition-colors"
      >
        View shift details
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  )
}
