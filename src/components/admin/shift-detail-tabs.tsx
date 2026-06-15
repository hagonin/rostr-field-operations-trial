'use client'
import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import { StaffResponseTable } from '@/components/admin/staff-response-table'
import { CoveragePanel } from '@/components/admin/coverage-panel'
import { InviteDrawer } from '@/components/admin/invite-drawer'
import { RecentActivity } from '@/components/admin/recent-activity'
import type { Shift, Staff, ActivityEvent } from '@/lib/domain/types'
import type { ShiftCoverage } from '@/lib/domain/coverage'
import { isAcceptedEquivalentPublic } from '@/lib/domain/coverage'

type Tab = 'coverage' | 'details' | 'activity'

interface ShiftDetailTabsProps {
  shift: Shift
  coverage: ShiftCoverage
  allStaff: Staff[]
  activity: ActivityEvent[]
}

export function ShiftDetailTabs({ shift, coverage, allStaff, activity }: ShiftDetailTabsProps) {
  const [tab, setTab] = useState<Tab>('coverage')
  const [drawerOpen, setDrawerOpen] = useState(false)

  const acceptedCount = shift.assignments.filter(isAcceptedEquivalentPublic).length
  const openSlots = Math.max(0, coverage.requiredTotal - coverage.acceptedTotal)

  const tabCls = (t: Tab) =>
    `px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${
      tab === t
        ? 'border-indigo-action text-indigo-action'
        : 'border-transparent text-text-secondary hover:text-text-primary'
    }`

  return (
    <>
      {/* Tab bar */}
      <div className="flex border-b border-border-rostr mb-5 gap-1">
        <button className={tabCls('coverage')} onClick={() => setTab('coverage')}>Coverage &amp; staff</button>
        <button className={tabCls('details')}  onClick={() => setTab('details')}>Shift details</button>
        <button className={tabCls('activity')} onClick={() => setTab('activity')}>Activity</button>
      </div>

      {/* Coverage & staff */}
      {tab === 'coverage' && (
        <div className="flex flex-col xl:flex-row gap-5 items-start">
          <div className="flex-1 min-w-0 space-y-4">
            <div className="flex items-center justify-between">
              <div />
              <button
                onClick={() => setDrawerOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-indigo-action hover:bg-indigo-hover text-white text-xs font-medium transition-colors rounded-lg"
              >
                <UserPlus className="w-3.5 h-3.5" /> Assign staff
              </button>
            </div>
            <StaffResponseTable
              assignments={shift.assignments}
              acceptedCount={acceptedCount}
              openSlots={openSlots}
            />
          </div>
          <div className="w-full xl:w-72 xl:flex-shrink-0">
            <CoveragePanel shift={shift} coverage={coverage} />
          </div>
        </div>
      )}

      {/* Shift details */}
      {tab === 'details' && (
        <div className="max-w-lg space-y-4">
          <CoveragePanel shift={shift} coverage={coverage} />
        </div>
      )}

      {/* Activity */}
      {tab === 'activity' && (
        <div className="max-w-sm">
          <RecentActivity events={activity} />
        </div>
      )}

      <InviteDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        shift={shift}
        allStaff={allStaff}
        coverage={coverage}
      />
    </>
  )
}
