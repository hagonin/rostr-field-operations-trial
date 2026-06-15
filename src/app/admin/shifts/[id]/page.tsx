import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { ChevronRight } from 'lucide-react'
import { getShift, getAllStaff, getActivityFeed } from '@/lib/data/repository'
import { computeCoverage, getShiftStatus } from '@/lib/domain/coverage'
import { StatusBadge } from '@/components/shared/status-badge'
import { ShiftDetailTabs } from '@/components/admin/shift-detail-tabs'
import { ShiftActionsMenu } from './shift-actions-menu'

interface Props { params: Promise<{ id: string }> }

export default async function ShiftDetailPage({ params }: Props) {
  const { id } = await params

  let shift = null
  try { shift = await getShift(id) } catch { /* DB not configured */ }
  if (!shift) notFound()

  const allStaff = await getAllStaff().catch(() => [])
  const activity  = getActivityFeed()
  const now       = new Date()
  const coverage  = computeCoverage(shift.shiftRoles, shift.assignments)
  const status    = getShiftStatus(shift, shift.shiftRoles, shift.assignments, now)

  const title      = shift.name ?? shift.campaign?.name ?? `Shift`
  const storeName  = shift.location?.storeName ?? ''
  const displayTitle = [title, storeName].filter(Boolean).join(' · ')
  const shiftRef   = `SHIFT #${shift.id.slice(0, 4).toUpperCase()} · ${format(parseISO(shift.date), 'EEE dd MMM yyyy').toUpperCase()}`
  // Use "Under-covered" label in detail header vs "Partially staffed" in the dashboard table
  const headerBadgeStatus = (status === 'partially_staffed' || status === 'at_risk') ? 'under_covered' : status
  const startFmt   = shift.startTime.slice(0, 5)
  const endFmt     = shift.endTime.slice(0, 5)
  const dateFmt    = format(parseISO(shift.date), 'EEE, d MMM')
  const totalRequired = shift.shiftRoles.reduce((s, r) => s + r.headcount, 0)

  return (
    <div className="p-6 space-y-5">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-text-secondary">
        <Link href="/admin" className="hover:text-text-primary">All shifts</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-text-primary">{displayTitle}</span>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-text-primary">{displayTitle}</h1>
            <StatusBadge status={headerBadgeStatus} size="md" showIcon={false} />
          </div>
          <p className="text-xs text-text-secondary mt-1 font-mono tracking-wide">{shiftRef}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <ShiftActionsMenu shiftId={id} />
        </div>
      </div>

      {/* Fact row */}
      <div className="bg-white border border-border-rostr rounded-lg flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-border-rostr overflow-hidden">
        {[
          { label: 'DATE',             value: dateFmt },
          { label: 'START TIME',       value: startFmt },
          { label: 'END TIME',         value: endFmt },
          { label: 'STORE / LOCATION', value: [shift.location?.storeName, shift.location?.country].filter(Boolean).join(' · ') },
          { label: 'REQUIRED STAFF',   value: `${totalRequired} staff` },
        ].map(({ label, value }) => (
          <div key={label} className="px-5 py-4 flex-1 min-w-[120px]">
            <p className="text-[11px] font-medium text-text-secondary tracking-wider">{label}</p>
            <p className="text-sm font-semibold font-mono text-text-primary mt-1.5">{value || '—'}</p>
          </div>
        ))}
      </div>

      {/* Tabbed content */}
      <ShiftDetailTabs
        shift={shift}
        coverage={coverage}
        allStaff={allStaff}
        activity={activity}
      />
    </div>
  )
}
