import { describe, it, expect } from 'vitest'
import type { ShiftAssignment, ShiftRole, Shift } from '@/lib/domain/types'
import {
  isAcceptedEquivalentPublic,
  deriveAssignmentStatus,
  computeRoleCoverage,
  computeCoverage,
  getShiftStatus,
  getDashboardKpis,
  getPriorityShifts,
} from '@/lib/domain/coverage'

// ── Fixture factories ────────────────────────────────────────────────────────

function mkAssignment(
  overrides: Partial<ShiftAssignment> & Pick<ShiftAssignment, 'status'>,
): ShiftAssignment {
  return {
    id: 'a1',
    shiftId: 's1',
    staffId: 'st1',
    role: 'Promoter',
    responseNote: null,
    updatedAt: '2026-06-13T00:00:00',
    ...overrides,
  }
}

function mkRole(overrides: Partial<ShiftRole> & { headcount: number }): ShiftRole {
  return {
    id: 'r1',
    shiftId: 's1',
    role: 'Promoter',
    breakMinutes: 30,
    ...overrides,
  }
}

function mkShift(overrides: Partial<Shift> & Pick<Shift, 'date' | 'startTime'>): Shift {
  return {
    id: 's1',
    campaignId: null,
    locationId: null,
    name: null,
    endTime: '17:00',
    roleFocus: null,
    notes: null,
    equipment: null,
    status: 'published',
    createdAt: '2026-06-01T00:00:00',
    shiftRoles: [],
    assignments: [],
    ...overrides,
  }
}

// Fixed reference time for deterministic tests
const NOW = new Date('2026-06-13T12:00:00')

// Shift that starts 72h after NOW — well outside 48h window
const FUTURE_SHIFT = { date: '2026-06-16', startTime: '12:00' }
// Shift that starts exactly 48h after NOW — on the boundary (<=), so no_response
const BOUNDARY_SHIFT = { date: '2026-06-15', startTime: '12:00' }
// Shift that starts 24h after NOW — inside the 48h window
const SOON_SHIFT = { date: '2026-06-14', startTime: '12:00' }
// Shift that started 1h before NOW — in the past
const PAST_SHIFT = { date: '2026-06-13', startTime: '11:00' }

// ── isAcceptedEquivalentPublic ───────────────────────────────────────────────

describe('isAcceptedEquivalentPublic', () => {
  it('returns true for accepted', () => {
    expect(isAcceptedEquivalentPublic(mkAssignment({ status: 'accepted' }))).toBe(true)
  })

  it('returns true for assigned', () => {
    expect(isAcceptedEquivalentPublic(mkAssignment({ status: 'assigned' }))).toBe(true)
  })

  it('returns false for invited', () => {
    expect(isAcceptedEquivalentPublic(mkAssignment({ status: 'invited' }))).toBe(false)
  })

  it('returns false for declined', () => {
    expect(isAcceptedEquivalentPublic(mkAssignment({ status: 'declined' }))).toBe(false)
  })

  it('returns false for no_response', () => {
    expect(isAcceptedEquivalentPublic(mkAssignment({ status: 'no_response' }))).toBe(false)
  })

  it('returns true for checked_in liveStatus even when base status is invited', () => {
    expect(
      isAcceptedEquivalentPublic(mkAssignment({ status: 'invited', liveStatus: 'checked_in' })),
    ).toBe(true)
  })

  it('returns true for completed liveStatus even when base status is invited', () => {
    expect(
      isAcceptedEquivalentPublic(mkAssignment({ status: 'invited', liveStatus: 'completed' })),
    ).toBe(true)
  })

  it('returns false for late liveStatus', () => {
    expect(
      isAcceptedEquivalentPublic(mkAssignment({ status: 'invited', liveStatus: 'late' })),
    ).toBe(false)
  })

  it('returns false for issue liveStatus', () => {
    expect(
      isAcceptedEquivalentPublic(mkAssignment({ status: 'invited', liveStatus: 'issue' })),
    ).toBe(false)
  })
})

// ── deriveAssignmentStatus ───────────────────────────────────────────────────

describe('deriveAssignmentStatus', () => {
  it('passes through accepted unchanged', () => {
    expect(deriveAssignmentStatus(mkAssignment({ status: 'accepted' }), FUTURE_SHIFT, NOW)).toBe(
      'accepted',
    )
  })

  it('passes through declined unchanged', () => {
    expect(deriveAssignmentStatus(mkAssignment({ status: 'declined' }), FUTURE_SHIFT, NOW)).toBe(
      'declined',
    )
  })

  it('passes through assigned unchanged', () => {
    expect(deriveAssignmentStatus(mkAssignment({ status: 'assigned' }), FUTURE_SHIFT, NOW)).toBe(
      'assigned',
    )
  })

  it('keeps invited when shift is more than 48h away', () => {
    expect(deriveAssignmentStatus(mkAssignment({ status: 'invited' }), FUTURE_SHIFT, NOW)).toBe(
      'invited',
    )
  })

  it('upgrades invited to no_response at exactly the 48h boundary', () => {
    expect(deriveAssignmentStatus(mkAssignment({ status: 'invited' }), BOUNDARY_SHIFT, NOW)).toBe(
      'no_response',
    )
  })

  it('upgrades invited to no_response when shift is less than 48h away', () => {
    expect(deriveAssignmentStatus(mkAssignment({ status: 'invited' }), SOON_SHIFT, NOW)).toBe(
      'no_response',
    )
  })

  it('keeps invited (not no_response) for a past shift — unanswered past invite stays invited', () => {
    // msUntilShift < 0 branch — pin documented behaviour
    expect(deriveAssignmentStatus(mkAssignment({ status: 'invited' }), PAST_SHIFT, NOW)).toBe(
      'invited',
    )
  })
})

// ── computeRoleCoverage ──────────────────────────────────────────────────────

describe('computeRoleCoverage', () => {
  it('counts accepted assignments for the matching role', () => {
    const role = mkRole({ headcount: 2 })
    const assignments = [
      mkAssignment({ status: 'accepted', role: 'Promoter' }),
      mkAssignment({ id: 'a2', status: 'accepted', role: 'Promoter' }),
    ]
    const result = computeRoleCoverage(role, assignments)
    expect(result.accepted).toBe(2)
    expect(result.open).toBe(0)
  })

  it('ignores assignments for other roles', () => {
    const role = mkRole({ headcount: 2 })
    const assignments = [mkAssignment({ status: 'accepted', role: 'Supervisor' })]
    const result = computeRoleCoverage(role, assignments)
    expect(result.accepted).toBe(0)
    expect(result.open).toBe(2)
  })

  it('clamps open to 0 when over-accepted', () => {
    const role = mkRole({ headcount: 1 })
    const assignments = [
      mkAssignment({ status: 'accepted', role: 'Promoter' }),
      mkAssignment({ id: 'a2', status: 'accepted', role: 'Promoter' }),
    ]
    const result = computeRoleCoverage(role, assignments)
    expect(result.open).toBe(0)
  })

  it('returns accepted 0 and open = headcount with no assignments', () => {
    const role = mkRole({ headcount: 3 })
    const result = computeRoleCoverage(role, [])
    expect(result.accepted).toBe(0)
    expect(result.open).toBe(3)
  })
})

// ── computeCoverage ──────────────────────────────────────────────────────────

describe('computeCoverage', () => {
  it('aggregates acceptedTotal and requiredTotal across roles', () => {
    const roles = [mkRole({ headcount: 2 }), mkRole({ id: 'r2', role: 'Supervisor', headcount: 1 })]
    const assignments = [
      mkAssignment({ status: 'accepted', role: 'Promoter' }),
      mkAssignment({ id: 'a2', status: 'accepted', role: 'Supervisor' }),
    ]
    const result = computeCoverage(roles, assignments)
    expect(result.acceptedTotal).toBe(2)
    expect(result.requiredTotal).toBe(3)
  })

  it('rounds percent correctly (1 of 3 → 33)', () => {
    const roles = [mkRole({ headcount: 3 })]
    const assignments = [mkAssignment({ status: 'accepted', role: 'Promoter' })]
    const result = computeCoverage(roles, assignments)
    expect(result.percent).toBe(33)
  })

  it('returns percent 0 when requiredTotal is 0 — no divide-by-zero', () => {
    const result = computeCoverage([], [])
    expect(result.percent).toBe(0)
    expect(result.requiredTotal).toBe(0)
  })

  it('lists only roles with open > 0 in openRoles', () => {
    const roles = [mkRole({ headcount: 1 }), mkRole({ id: 'r2', role: 'Supervisor', headcount: 1 })]
    const assignments = [mkAssignment({ status: 'accepted', role: 'Promoter' })]
    const result = computeCoverage(roles, assignments)
    expect(result.openRoles).toEqual(['Supervisor'])
  })
})

// ── getShiftStatus ───────────────────────────────────────────────────────────

describe('getShiftStatus', () => {
  it('returns covered when all roles are filled', () => {
    const roles = [mkRole({ headcount: 1 })]
    const assignments = [mkAssignment({ status: 'accepted' })]
    expect(getShiftStatus(FUTURE_SHIFT, roles, assignments, NOW)).toBe('covered')
  })

  it('returns covered even when a declined assignment exists, if all headcount is met', () => {
    const roles = [mkRole({ headcount: 1 })]
    const assignments = [
      mkAssignment({ status: 'accepted' }),
      mkAssignment({ id: 'a2', status: 'declined' }),
    ]
    expect(getShiftStatus(FUTURE_SHIFT, roles, assignments, NOW)).toBe('covered')
  })

  it('returns at_risk when shift is short and has a declined assignment', () => {
    const roles = [mkRole({ headcount: 2 })]
    const assignments = [mkAssignment({ status: 'declined' })]
    expect(getShiftStatus(FUTURE_SHIFT, roles, assignments, NOW)).toBe('at_risk')
  })

  it('returns no_response when short and no accepted, no declines (all invited)', () => {
    const roles = [mkRole({ headcount: 2 })]
    const assignments = [mkAssignment({ status: 'invited' })]
    expect(getShiftStatus(FUTURE_SHIFT, roles, assignments, NOW)).toBe('no_response')
  })

  it('returns partially_staffed when short, some accepted, no declines', () => {
    const roles = [mkRole({ headcount: 3 })]
    const assignments = [
      mkAssignment({ status: 'accepted' }),
      mkAssignment({ id: 'a2', status: 'invited' }),
    ]
    expect(getShiftStatus(FUTURE_SHIFT, roles, assignments, NOW)).toBe('partially_staffed')
  })

  it('worksheet: headcount 3, {1 accepted, 1 declined, 1 invited} → at_risk', () => {
    const roles = [mkRole({ headcount: 3 })]
    const assignments = [
      mkAssignment({ status: 'accepted' }),
      mkAssignment({ id: 'a2', status: 'declined' }),
      mkAssignment({ id: 'a3', status: 'invited' }),
    ]
    expect(getShiftStatus(FUTURE_SHIFT, roles, assignments, NOW)).toBe('at_risk')
  })
})

// ── getDashboardKpis ─────────────────────────────────────────────────────────

describe('getDashboardKpis', () => {
  it('returns all-zero KPIs for empty shifts', () => {
    const kpis = getDashboardKpis([], {}, {}, NOW)
    expect(kpis.totalUpcoming).toBe(0)
    expect(kpis.coveredCount).toBe(0)
    expect(kpis.coveredPercent).toBe(0)
    expect(kpis.openPositions).toBe(0)
    expect(kpis.awaitingResponses).toBe(0)
    expect(kpis.declinedCount).toBe(0)
    expect(kpis.checkedInCount).toBe(0)
    expect(kpis.liveIssueCount).toBe(0)
  })

  it('counts coveredCount and rounds coveredPercent', () => {
    const covered = mkShift({ id: 's1', date: '2026-06-16', startTime: '12:00' })
    const short = mkShift({ id: 's2', date: '2026-06-16', startTime: '12:00' })
    const short2 = mkShift({ id: 's3', date: '2026-06-16', startTime: '12:00' })
    const rolesByShift: Record<string, ShiftRole[]> = {
      s1: [mkRole({ shiftId: 's1', headcount: 1 })],
      s2: [mkRole({ id: 'r2', shiftId: 's2', headcount: 1 })],
      s3: [mkRole({ id: 'r3', shiftId: 's3', headcount: 1 })],
    }
    const assignmentsByShift: Record<string, ShiftAssignment[]> = {
      s1: [mkAssignment({ shiftId: 's1', status: 'accepted' })],
      s2: [],
      s3: [],
    }
    const kpis = getDashboardKpis([covered, short, short2], rolesByShift, assignmentsByShift, NOW)
    expect(kpis.coveredCount).toBe(1)
    expect(kpis.coveredPercent).toBe(33)
  })

  it('accumulates openPositions only from non-covered shifts', () => {
    const covered = mkShift({ id: 's1', date: '2026-06-16', startTime: '12:00' })
    const short = mkShift({ id: 's2', date: '2026-06-16', startTime: '12:00' })
    const rolesByShift: Record<string, ShiftRole[]> = {
      s1: [mkRole({ shiftId: 's1', headcount: 1 })],
      s2: [mkRole({ id: 'r2', shiftId: 's2', headcount: 2 })],
    }
    const assignmentsByShift: Record<string, ShiftAssignment[]> = {
      s1: [mkAssignment({ shiftId: 's1', status: 'accepted' })],
      s2: [],
    }
    const kpis = getDashboardKpis([covered, short], rolesByShift, assignmentsByShift, NOW)
    expect(kpis.openPositions).toBe(2)
  })

  it('counts awaitingResponses and declinedCount via derived status', () => {
    const shift = mkShift({ id: 's1', date: '2026-06-16', startTime: '12:00' })
    const rolesByShift = { s1: [mkRole({ shiftId: 's1', headcount: 3 })] }
    const assignmentsByShift = {
      s1: [
        mkAssignment({ id: 'a1', shiftId: 's1', status: 'invited' }),
        mkAssignment({ id: 'a2', shiftId: 's1', status: 'no_response' }),
        mkAssignment({ id: 'a3', shiftId: 's1', status: 'declined' }),
      ],
    }
    const kpis = getDashboardKpis([shift], rolesByShift, assignmentsByShift, NOW)
    expect(kpis.awaitingResponses).toBe(2)
    expect(kpis.declinedCount).toBe(1)
  })

  it('counts checkedInCount and liveIssueCount from liveStatus', () => {
    const shift = mkShift({ id: 's1', date: '2026-06-16', startTime: '12:00' })
    const rolesByShift = { s1: [mkRole({ shiftId: 's1', headcount: 4 })] }
    const assignmentsByShift = {
      s1: [
        mkAssignment({ id: 'a1', shiftId: 's1', status: 'accepted', liveStatus: 'checked_in' }),
        mkAssignment({ id: 'a2', shiftId: 's1', status: 'accepted', liveStatus: 'late' }),
        mkAssignment({ id: 'a3', shiftId: 's1', status: 'accepted', liveStatus: 'issue' }),
        mkAssignment({ id: 'a4', shiftId: 's1', status: 'accepted' }),
      ],
    }
    const kpis = getDashboardKpis([shift], rolesByShift, assignmentsByShift, NOW)
    expect(kpis.checkedInCount).toBe(1)
    expect(kpis.liveIssueCount).toBe(2)
  })

  it('treats missing keys in rolesByShift and assignmentsByShift as empty arrays — no throw', () => {
    const shift = mkShift({ id: 's1', date: '2026-06-16', startTime: '12:00' })
    expect(() => getDashboardKpis([shift], {}, {}, NOW)).not.toThrow()
  })
})

// ── getPriorityShifts ────────────────────────────────────────────────────────

describe('getPriorityShifts', () => {
  it('excludes covered shifts', () => {
    const shift = mkShift({ id: 's1', date: '2026-06-16', startTime: '12:00' })
    const rolesByShift = { s1: [mkRole({ shiftId: 's1', headcount: 1 })] }
    const assignmentsByShift = { s1: [mkAssignment({ shiftId: 's1', status: 'accepted' })] }
    const result = getPriorityShifts([shift], rolesByShift, assignmentsByShift, NOW)
    expect(result).toHaveLength(0)
  })

  it('sorts non-covered shifts by gapCount descending', () => {
    const s1 = mkShift({ id: 's1', date: '2026-06-16', startTime: '12:00' })
    const s2 = mkShift({ id: 's2', date: '2026-06-16', startTime: '12:00' })
    const rolesByShift: Record<string, ShiftRole[]> = {
      s1: [mkRole({ shiftId: 's1', headcount: 3 })],
      s2: [mkRole({ id: 'r2', shiftId: 's2', headcount: 1 })],
    }
    const assignmentsByShift: Record<string, ShiftAssignment[]> = {
      s1: [],
      s2: [],
    }
    const result = getPriorityShifts([s1, s2], rolesByShift, assignmentsByShift, NOW)
    expect(result[0].shift.id).toBe('s1')
    expect(result[0].gapCount).toBe(3)
    expect(result[1].shift.id).toBe('s2')
    expect(result[1].gapCount).toBe(1)
  })

  it('gapCount equals summed open slots for the shift', () => {
    const shift = mkShift({ id: 's1', date: '2026-06-16', startTime: '12:00' })
    const rolesByShift = {
      s1: [
        mkRole({ shiftId: 's1', headcount: 2 }),
        mkRole({ id: 'r2', shiftId: 's1', role: 'Supervisor', headcount: 1 }),
      ],
    }
    const assignmentsByShift = {
      s1: [mkAssignment({ shiftId: 's1', status: 'accepted', role: 'Promoter' })],
    }
    const result = getPriorityShifts([shift], rolesByShift, assignmentsByShift, NOW)
    expect(result[0].gapCount).toBe(2) // 1 open Promoter + 1 open Supervisor
  })
})
