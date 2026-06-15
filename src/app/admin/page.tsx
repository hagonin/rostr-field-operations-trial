import { Suspense } from 'react'
import { Clock, XCircle, CheckCircle, AlertTriangle, Plus } from 'lucide-react'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { getShifts, getActivityFeed } from '@/lib/data/repository'
import {
  getDashboardKpis, getPriorityShifts, getShiftStatus, computeCoverage,
} from '@/lib/domain/coverage'
import { StatCard } from '@/components/admin/stat-card'
import { InlineMetric } from '@/components/admin/inline-metric'
import { PriorityShifts } from '@/components/admin/priority-shifts'
import { RecentActivity } from '@/components/admin/recent-activity'
import ShiftTableClient, { type ShiftRow } from '@/components/admin/shift-table-client'
import { LocationFilterDropdown, type LocationOption } from '@/components/admin/location-filter-dropdown'
import type { Shift, ShiftRole, ShiftAssignment } from '@/lib/domain/types'

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ location?: string }>
}) {
  const sp = await searchParams
  const locationParam = sp.location ?? ''
  let allShifts: Shift[] = []
  try {
    allShifts = await getShifts()
  } catch { /* DB not yet configured */ }

  const shifts = locationParam
    ? allShifts.filter(s => s.location?.storeName === locationParam)
    : allShifts

  const now = new Date()

  const rolesByShift: Record<string, ShiftRole[]> = {}
  const assignmentsByShift: Record<string, ShiftAssignment[]> = {}
  for (const s of shifts) {
    rolesByShift[s.id] = s.shiftRoles
    assignmentsByShift[s.id] = s.assignments
  }

  const kpis          = getDashboardKpis(shifts, rolesByShift, assignmentsByShift, now)
  const priorityItems = getPriorityShifts(shifts, rolesByShift, assignmentsByShift, now)
  const activity      = getActivityFeed()
  const atRiskCount   = priorityItems.filter(p => p.status === 'at_risk').length

  const tableRows: ShiftRow[] = shifts.map(shift => ({
    shift,
    coverage: computeCoverage(shift.shiftRoles, shift.assignments),
    status:   getShiftStatus(shift, shift.shiftRoles, shift.assignments, now),
  }))

  const uniqueLocations: LocationOption[] = [...new Map(
    allShifts
      .filter(s => s.location?.storeName)
      .map(s => [s.location!.storeName, { storeName: s.location!.storeName, retailer: s.location!.retailer ?? '' }])
  ).values()].sort((a, b) => a.storeName.localeCompare(b.storeName))

  // Week label derived from shift date range
  const dates   = allShifts.map(s => s.date).sort()
  const weekLabel = dates.length > 0
    ? `Week of ${format(parseISO(dates[0]), 'd MMM')}–${format(parseISO(dates[dates.length - 1]), 'd MMM yyyy')}`
    : 'Upcoming shifts'

  return (
    <div className="p-6 space-y-5">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Operations overview</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            {weekLabel} · {locationParam || 'All locations'}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Suspense fallback={
            <div className="flex items-center gap-2 px-4 py-2 border border-border-rostr text-sm font-medium bg-white text-text-primary rounded-lg">
              All locations
            </div>
          }>
            <LocationFilterDropdown locations={uniqueLocations} />
          </Suspense>
          <Link href="/admin/shifts/new" className="flex items-center gap-1.5 px-3 py-2 bg-indigo-action hover:bg-indigo-hover text-white text-sm font-medium transition-colors duration-150 rounded-lg">
            <Plus className="w-3.5 h-3.5" /> Create shift
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="flex flex-col sm:flex-row gap-3">
        <StatCard
          value={kpis.totalUpcoming}
          label="Total upcoming shifts"
          sublabel="Next 14 days"
        />
        <StatCard
          value={kpis.coveredCount}
          label="Covered shifts"
          sublabel={`${kpis.coveredPercent}% fully staffed`}
          icon={CheckCircle}
          iconClass="text-blue-500"
        />
        <StatCard
          value={kpis.partiallyStaffedCount}
          label="Partially staffed shifts"
          sublabel={`${kpis.openPositions} open position${kpis.openPositions !== 1 ? 's' : ''} · ${atRiskCount > 0 ? `${atRiskCount} urgent` : 'no urgent risk'}`}
          icon={AlertTriangle}
          iconClass="text-amber-500"
        />
      </div>

      {/* Inline metrics strip */}
      <div className="flex flex-col sm:flex-row gap-3">
        <InlineMetric icon={Clock}         iconClass="text-blue-500"  iconBg="bg-blue-50"   label="Awaiting staff responses" sublabel="Invited & no response" value={kpis.awaitingResponses} />
        <InlineMetric icon={XCircle}       iconClass="text-red-500"   iconBg="bg-red-50"    label="Declined invitations"     sublabel={`Across ${kpis.declinedCount} shift${kpis.declinedCount !== 1 ? 's' : ''}`} value={kpis.declinedCount} />
        <InlineMetric icon={CheckCircle}   iconClass="text-green-500" iconBg="bg-green-50"  label="Staff checked in"         value={kpis.checkedInCount} />
        <InlineMetric icon={AlertTriangle} iconClass="text-amber-500" iconBg="bg-amber-50"  label="Live issues"              value={kpis.liveIssueCount} />
      </div>

      {/* Table + right panels */}
      <div className="flex flex-col lg:flex-row gap-5 items-start">
        <div className="flex-1 min-w-0 bg-white border border-border-rostr p-4 rounded-lg">
          <Suspense fallback={<div className="py-8 text-center text-sm text-text-secondary">Loading shifts…</div>}>
            <ShiftTableClient rows={tableRows} />
          </Suspense>
        </div>

        <div className="w-full lg:w-80 lg:flex-shrink-0 space-y-4">
          <PriorityShifts items={priorityItems} />
          <RecentActivity events={activity} />
        </div>
      </div>
    </div>
  )
}
