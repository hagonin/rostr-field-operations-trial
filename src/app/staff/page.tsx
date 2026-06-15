import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { AlertCircle } from 'lucide-react'
import { getShifts, getStaffById } from '@/lib/data/repository'
import { InvitationCard } from '@/components/staff/invitation-card'
import { AcceptedShiftCard } from '@/components/staff/accepted-shift-card'
import { AvailabilityDropdown } from '@/components/staff/availability-dropdown'

export default async function StaffPage() {
  const cookieStore = await cookies()
  const staffId = cookieStore.get('currentStaffId')?.value
  if (!staffId) redirect('/')

  const [shifts, currentStaff] = await Promise.all([
    getShifts().catch(() => []),
    getStaffById(staffId).catch(() => null),
  ])
  if (!currentStaff) redirect('/')

  // Collect this staff member's assignments with their parent shift attached
  const myAssignments = shifts.flatMap(shift =>
    shift.assignments
      .filter(a => a.staffId === staffId)
      .map(a => ({ ...a, shift }))
  )

  const pending  = myAssignments.filter(a => a.status === 'invited' || a.status === 'no_response')
  const accepted = myAssignments.filter(a =>
    a.status === 'accepted' || a.status === 'assigned' ||
    a.liveStatus === 'checked_in' || a.liveStatus === 'late' ||
    a.liveStatus === 'issue'    || a.liveStatus === 'completed'
  )
  const liveCount = accepted.filter(a => a.liveStatus).length

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Page header */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-text-primary">My shifts</h1>
        <AvailabilityDropdown staffId={staffId} currentStatus={currentStaff.availabilityStatus} />
      </div>

      {pending.length > 0 && (
        <p role="alert" className="flex items-center gap-1.5 text-sm text-amber-600 mb-6">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {pending.length} invitation{pending.length !== 1 ? 's' : ''} need{pending.length === 1 ? 's' : ''} your response
        </p>
      )}

      {/* Invitation cards */}
      <div className="space-y-4">
        {pending.map(a => (
          <InvitationCard key={a.id} assignment={a} shift={a.shift} />
        ))}
      </div>

      {/* Accepted shifts */}
      {accepted.length > 0 && (
        <section className={pending.length > 0 ? 'mt-10' : 'mt-4'}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-text-primary">Accepted shifts</h2>
            {liveCount > 0 && (
              <span className="text-xs text-text-secondary">{liveCount} live state{liveCount !== 1 ? 's' : ''}</span>
            )}
          </div>
          <div className="space-y-3">
            {accepted.map(a => (
              <AcceptedShiftCard key={a.id} assignment={a} shift={a.shift} />
            ))}
          </div>
        </section>
      )}

      {pending.length === 0 && accepted.length === 0 && (
        <p className="mt-12 text-center text-sm text-text-secondary">
          You&apos;re all caught up — no upcoming shifts.
        </p>
      )}
    </div>
  )
}
