import type { Shift, ShiftRole, ShiftAssignment, ResponseStatus } from '@/lib/domain/types'

// ── Computed types ──────────────────────────────────────────────────────────

export interface RoleCoverage {
  role: string
  accepted: number
  headcount: number
  open: number
}

export interface ShiftCoverage {
  acceptedTotal: number
  requiredTotal: number
  percent: number
  byRole: RoleCoverage[]
  openRoles: string[] // role names with open > 0
}

// Status precedence (highest priority first):
// 1. covered          — every role at or above headcount
// 2. at_risk          — has declined assignments AND shift is still short
// 3. no_response      — none accepted, no declines (all invited/no_response)
// 4. partially_staffed — some roles short, no declines, at least one accepted
export type ComputedShiftStatus = 'covered' | 'partially_staffed' | 'at_risk' | 'no_response'

export interface DashboardKpis {
  totalUpcoming: number
  coveredCount: number
  coveredPercent: number
  partiallyStaffedCount: number // non-covered shifts needing attention
  openPositions: number         // total unfilled headcount slots across all shifts
  awaitingResponses: number
  declinedCount: number
  checkedInCount: number        // from presentational fixture liveStatus
  liveIssueCount: number        // late + issue from fixture liveStatus
}

export interface PriorityShift {
  shift: Shift
  status: ComputedShiftStatus
  coverage: ShiftCoverage
  gapCount: number // total open headcount slots
}

// ── Helpers ─────────────────────────────────────────────────────────────────

// accepted, assigned, checked_in, and completed all count toward coverage
export function isAcceptedEquivalentPublic(a: ShiftAssignment): boolean {
  if (a.status === 'accepted' || a.status === 'assigned') return true
  return a.liveStatus === 'checked_in' || a.liveStatus === 'completed'
}
function isAcceptedEquivalent(a: ShiftAssignment): boolean {
  return isAcceptedEquivalentPublic(a)
}

// 48h window: an unanswered invite this close to the shift is treated as no_response
const NO_RESPONSE_THRESHOLD_MS = 48 * 60 * 60 * 1000

// ── Pure functions ───────────────────────────────────────────────────────────

/** Upgrades 'invited' → 'no_response' when shift starts within 48 h and still no reply. */
export function deriveAssignmentStatus(
  assignment: ShiftAssignment,
  shift: Pick<Shift, 'date' | 'startTime'>,
  now: Date,
): ResponseStatus {
  if (assignment.status !== 'invited') return assignment.status
  const shiftDateTime = new Date(`${shift.date}T${shift.startTime}`)
  const msUntilShift = shiftDateTime.getTime() - now.getTime()
  if (msUntilShift >= 0 && msUntilShift <= NO_RESPONSE_THRESHOLD_MS) return 'no_response'
  return 'invited'
}

/** Per-role coverage for a single role requirement. */
export function computeRoleCoverage(
  shiftRole: ShiftRole,
  assignments: ShiftAssignment[],
): RoleCoverage {
  const forRole = assignments.filter(a => a.role === shiftRole.role)
  const accepted = forRole.filter(isAcceptedEquivalent).length
  return {
    role: shiftRole.role,
    accepted,
    headcount: shiftRole.headcount,
    open: Math.max(0, shiftRole.headcount - accepted),
  }
}

/** Aggregate coverage across all roles for a shift. */
export function computeCoverage(
  shiftRoles: ShiftRole[],
  assignments: ShiftAssignment[],
): ShiftCoverage {
  const byRole = shiftRoles.map(sr => computeRoleCoverage(sr, assignments))
  const acceptedTotal = byRole.reduce((s, r) => s + r.accepted, 0)
  const requiredTotal = byRole.reduce((s, r) => s + r.headcount, 0)
  const percent = requiredTotal > 0 ? Math.round((acceptedTotal / requiredTotal) * 100) : 0
  return {
    acceptedTotal,
    requiredTotal,
    percent,
    byRole,
    openRoles: byRole.filter(r => r.open > 0).map(r => r.role),
  }
}

/** Derive the overall status for a shift given its roles, assignments, and the current time. */
export function getShiftStatus(
  shift: Pick<Shift, 'date' | 'startTime'>,
  shiftRoles: ShiftRole[],
  assignments: ShiftAssignment[],
  now: Date,
): ComputedShiftStatus {
  const coverage = computeCoverage(shiftRoles, assignments)
  if (coverage.openRoles.length === 0) return 'covered'

  const derivedStatuses = assignments.map(a => deriveAssignmentStatus(a, shift, now))
  if (derivedStatuses.some(s => s === 'declined')) return 'at_risk'
  if (!assignments.some(isAcceptedEquivalent)) return 'no_response'
  return 'partially_staffed'
}

/** KPI rollup for the admin dashboard cards. */
export function getDashboardKpis(
  shifts: Shift[],
  rolesByShift: Record<string, ShiftRole[]>,
  assignmentsByShift: Record<string, ShiftAssignment[]>,
  now: Date,
): DashboardKpis {
  let coveredCount = 0
  let partiallyStaffedCount = 0
  let openPositions = 0
  let awaitingResponses = 0
  let declinedCount = 0
  let checkedInCount = 0
  let liveIssueCount = 0

  for (const shift of shifts) {
    const roles = rolesByShift[shift.id] ?? []
    const assignments = assignmentsByShift[shift.id] ?? []
    const status = getShiftStatus(shift, roles, assignments, now)
    const coverage = computeCoverage(roles, assignments)

    if (status === 'covered') {
      coveredCount++
    } else {
      partiallyStaffedCount++
      openPositions += coverage.byRole.reduce((s, r) => s + r.open, 0)
    }

    for (const a of assignments) {
      const derived = deriveAssignmentStatus(a, shift, now)
      if (derived === 'invited' || derived === 'no_response') awaitingResponses++
      if (derived === 'declined') declinedCount++
      if (a.liveStatus === 'checked_in') checkedInCount++
      if (a.liveStatus === 'issue' || a.liveStatus === 'late') liveIssueCount++
    }
  }

  const coveredPercent = shifts.length > 0 ? Math.round((coveredCount / shifts.length) * 100) : 0

  return {
    totalUpcoming: shifts.length,
    coveredCount,
    coveredPercent,
    partiallyStaffedCount,
    openPositions,
    awaitingResponses,
    declinedCount,
    checkedInCount,
    liveIssueCount,
  }
}

/** Under-covered shifts sorted by largest gap first — drives the Priority Shifts panel. */
export function getPriorityShifts(
  shifts: Shift[],
  rolesByShift: Record<string, ShiftRole[]>,
  assignmentsByShift: Record<string, ShiftAssignment[]>,
  now: Date,
): PriorityShift[] {
  return shifts
    .map(shift => {
      const roles = rolesByShift[shift.id] ?? []
      const assignments = assignmentsByShift[shift.id] ?? []
      const status = getShiftStatus(shift, roles, assignments, now)
      const coverage = computeCoverage(roles, assignments)
      const gapCount = coverage.byRole.reduce((s, r) => s + r.open, 0)
      return { shift, status, coverage, gapCount }
    })
    .filter(ps => ps.status !== 'covered')
    .sort((a, b) => b.gapCount - a.gapCount)
}
