import type { LiveStatus, ActivityEvent } from '@/lib/domain/types'

// IDs are stable — must stay in sync with supabase/seed.sql

// Live ops state per assignment (checked_in/late/issue/completed)
// The real DB status column only holds: invited | accepted | declined | no_response | assigned
export const liveStatusByAssignmentId: Record<string, { status: LiveStatus; hours?: string; checkInTime?: string }> = {
  // Shift 1: In-store Sampling (Jun 17, current week — live now)
  'ff000000-0000-0000-0000-000000000001': { status: 'checked_in', checkInTime: '9:47', hours: '7h 20m' },
  'ff000000-0000-0000-0000-000000000002': { status: 'late' },
  'ff000000-0000-0000-0000-000000000003': { status: 'issue' },
  'ff000000-0000-0000-0000-000000000005': { status: 'checked_in' },
  // Shift 2: Morning service (Jun 16) — completed
  'ff000000-0000-0000-0000-000000000006': { status: 'completed', hours: '4h', checkInTime: '9:02' },
  'ff000000-0000-0000-0000-000000000007': { status: 'completed', hours: '4h', checkInTime: '8:58' },
  'ff000000-0000-0000-0000-000000000008': { status: 'completed', hours: '4h', checkInTime: '9:05' },
  // Shift 9: Morning Activation (Jun 9, past) — all completed
  'ff000000-0000-0000-0000-000000000026': { status: 'completed', hours: '5h', checkInTime: '10:04' },
  'ff000000-0000-0000-0000-000000000027': { status: 'completed', hours: '5h', checkInTime: '10:01' },
  'ff000000-0000-0000-0000-000000000028': { status: 'completed', hours: '5h', checkInTime: '10:09' },
  // Shift 10: Midweek Sampling (Jun 11, past) — one staff reported an incident mid-shift
  'ff000000-0000-0000-0000-000000000029': { status: 'completed', hours: '8h', checkInTime: '9:02' },
  'ff000000-0000-0000-0000-000000000030': { status: 'issue' },
  'ff000000-0000-0000-0000-000000000031': { status: 'completed', hours: '8h', checkInTime: '9:05' },
  'ff000000-0000-0000-0000-000000000032': { status: 'completed', hours: '8h', checkInTime: '9:10' },
}

// Distance in km from staff home suburb to shift location — deterministic stub
export const distanceKmByStaffId: Record<string, number> = {
  'aa000000-0000-0000-0000-000000000002': 1.2,   // Sarah Chen
  'aa000000-0000-0000-0000-000000000003': 2.4,   // Tom Lee
  'aa000000-0000-0000-0000-000000000004': 3.1,   // Mai Nguyen
  'aa000000-0000-0000-0000-000000000005': 0.8,   // Ana Torres
  'aa000000-0000-0000-0000-000000000006': 5.2,   // Joel Martin
  'aa000000-0000-0000-0000-000000000007': 1.9,   // Priya Shah
  'aa000000-0000-0000-0000-000000000008': 2.8,   // Noah Williams
  'aa000000-0000-0000-0000-000000000009': 4.3,   // Sofia Rossi
  'aa000000-0000-0000-0000-000000000010': 6.1,   // Emma Clarke
  'aa000000-0000-0000-0000-000000000011': 3.7,   // Chloe Bennett
  'aa000000-0000-0000-0000-000000000012': 7.2,   // Aisha Khan
  'aa000000-0000-0000-0000-000000000013': 2.1,   // Jordan Kim
  'aa000000-0000-0000-0000-000000000014': 4.8,   // Marcus Reed
  'aa000000-0000-0000-0000-000000000015': 3.3,   // Leo Martin
  'aa000000-0000-0000-0000-000000000016': 1.5,   // Daniel Wu
  'aa000000-0000-0000-0000-000000000017': 2.6,   // Liam Park
  'aa000000-0000-0000-0000-000000000018': 3.9,   // Olivia Brown
  'aa000000-0000-0000-0000-000000000019': 5.5,   // Isabella Green
  'aa000000-0000-0000-0000-000000000020': 8.2,   // Ryan Thompson
}

export const activityFeed: ActivityEvent[] = [
  { actor: 'Ana Torres',    message: 'accepted Morning service',                          relativeTime: '4 min ago'  },
  { actor: 'System',        message: 'Albany Hydration Sampling has no invites — 10 days to shift', relativeTime: '12 min ago' },
  { actor: 'System',        message: 'Sydney Metro Activation published',                 relativeTime: '18 min ago' },
  { actor: 'Olivia Brown',  message: 'declined Sydney Metro Activation',                  relativeTime: '34 min ago' },
  { actor: 'Joel Martin',   message: 'withdrew from Dispatch',                            relativeTime: '40 min ago' },
  { actor: 'System',        message: 'Roster forecast recalculated',                      relativeTime: '1 hr ago'   },
  { actor: 'Priya Shah',    message: 'accepted Auckland Roadshow Kick-off',               relativeTime: '2 hr ago'   },
  { actor: 'System',        message: '3 staff have not responded to Weekend Randwick',    relativeTime: '3 hr ago'   },
  { actor: 'Leo Martin',    message: 'reported an issue on Midweek Sampling',             relativeTime: 'Yesterday'  },
  { actor: 'System',        message: 'Morning Activation completed — 3 staff checked out', relativeTime: '4 days ago' },
]

export const eligibleStaffNotice = 24
