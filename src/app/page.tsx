import Link from 'next/link'
import { LayoutGrid, CheckCircle, ArrowRight } from 'lucide-react'
import { AppLogo } from '@/components/shared/app-logo'
import { getShifts, getAllStaff } from '@/lib/data/repository'
import { getDashboardKpis, getShiftStatus, computeCoverage } from '@/lib/domain/coverage'
import { StaffSelectionDropdown } from '@/components/home/staff-selection-dropdown'
import type { Shift, ShiftRole, ShiftAssignment, Staff } from '@/lib/domain/types'

export default async function HomePage() {
  let shifts: Shift[] = []
  let staff: Staff[] = []
  try {
    ;[shifts, staff] = await Promise.all([getShifts(), getAllStaff()])
  } catch { /* DB not yet configured — render with empty data */ }

  const now = new Date()
  const rolesByShift: Record<string, ShiftRole[]> = {}
  const assignmentsByShift: Record<string, ShiftAssignment[]> = {}
  for (const s of shifts) {
    rolesByShift[s.id] = s.shiftRoles
    assignmentsByShift[s.id] = s.assignments
  }

  const kpis = getDashboardKpis(shifts, rolesByShift, assignmentsByShift, now)

  // Pending invites per staff member
  const pendingByStaff: Record<string, number> = {}
  for (const shift of shifts) {
    for (const a of shift.assignments) {
      if (a.status === 'invited' || a.status === 'no_response') {
        pendingByStaff[a.staffId] = (pendingByStaff[a.staffId] ?? 0) + 1
      }
    }
  }

  const fieldStaff = staff.filter(s => s.roleTitle !== 'Operations admin')

  return (
    <main className="min-h-screen bg-page flex flex-col">
      <header className="px-8 py-4 flex items-center justify-between border-b border-border-rostr bg-white">
        <AppLogo />
        <span className="text-[11px] tracking-widest text-text-secondary uppercase font-medium">Sydney Operations</span>
      </header>

      <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-12 px-6 py-4 max-w-6xl mx-auto w-full">
        <div className="text-center md:text-left md:max-w-xs lg:max-w-sm">
          <p className="text-[11px] tracking-widest uppercase font-semibold text-indigo-action mb-3">Field Operations</p>
          <h1 className="text-3xl lg:text-4xl font-bold text-text-primary mb-3">Where are you working today?</h1>
          <p className="text-text-secondary text-sm lg:text-base">
            Manage campaign coverage or respond to your upcoming in-store shifts.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-5 w-full md:flex-1">
          {/* Admin card */}
          <div className="bg-navy rounded-2xl p-5 flex flex-col gap-4 flex-1">
            <div className="w-10 h-10 rounded-xl bg-navy-hover flex items-center justify-center">
              <LayoutGrid className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Admin / Operations</h2>
              <p className="text-sm text-navy-inactive mt-1">
                See coverage, resolve gaps and coordinate every campaign shift from one workspace.
              </p>
            </div>
            <ul className="space-y-2 flex-1">
              <li className="flex items-center gap-2 text-sm text-white/80">
                <CheckCircle className="w-4 h-4 text-white/60 flex-shrink-0" />
                {kpis.totalUpcoming} upcoming shifts
              </li>
              <li className="flex items-center gap-2 text-sm text-white/80">
                <CheckCircle className="w-4 h-4 text-white/60 flex-shrink-0" />
                {kpis.partiallyStaffedCount} coverage gap{kpis.partiallyStaffedCount !== 1 ? 's' : ''} need attention
              </li>
            </ul>
            <Link
              href="/admin"
              className="mt-2 bg-indigo-action hover:bg-indigo-hover text-white rounded-lg px-4 py-3 text-center text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              Enter operations <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Staff card */}
          <div className="bg-white rounded-2xl border border-border-rostr p-5 flex flex-col gap-3 flex-1">
            <div>
              <h2 className="text-xl font-bold text-text-primary">Enter as field staff</h2>
              <p className="text-sm text-text-secondary mt-1">Choose your name to view and respond to shifts.</p>
            </div>

            <StaffSelectionDropdown staff={fieldStaff} pendingByStaff={pendingByStaff} />

            <p className="text-xs text-text-secondary text-center pt-2 border-t border-border-rostr mt-auto">
              Demo mode · choose a role to explore the workflow
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
