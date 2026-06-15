import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { ArrowLeft, MapPin, CalendarDays, Clock, UserCircle, Package, ChevronRight } from 'lucide-react'
import { getShift } from '@/lib/data/repository'
import { StatusBadge } from '@/components/shared/status-badge'
import { ResponseButtons } from '@/components/staff/response-buttons'
import { CheckInPanel } from '@/components/staff/check-in-panel'

interface Props { params: Promise<{ id: string }> }

export default async function StaffShiftDetailPage({ params }: Props) {
  const cookieStore = await cookies()
  const staffId = cookieStore.get('currentStaffId')?.value
  if (!staffId) redirect('/')

  const { id } = await params
  const shift = await getShift(id).catch(() => null)
  if (!shift) notFound()

  const assignment = shift.assignments.find(a => a.staffId === staffId)
  if (!assignment) notFound()

  const isInvited    = assignment.status === 'invited' || assignment.status === 'no_response'
  const displayBadge = assignment.liveStatus ?? (isInvited ? 'invited' : assignment.status)
  const dateLong     = format(parseISO(shift.date), 'EEEE, d MMM')
  const dateShort    = format(parseISO(shift.date), 'EEEE')
  const timeStr      = `${shift.startTime.slice(0, 5)}–${shift.endTime.slice(0, 5)}`
  const retailer     = shift.location?.retailer ?? ''
  const storeName    = shift.location?.storeName ?? ''
  const storeLabel   = [retailer, storeName].filter(Boolean).join(' · ')
  const address      = [shift.location?.address, shift.location?.suburb, shift.location?.state, shift.location?.country]
    .filter(Boolean).join(', ')
  const role         = assignment.role ?? shift.roleFocus ?? ''
  const equipment    = shift.equipment ?? ''
  const notes        = shift.notes ?? ''
  const shiftTitle   = shift.name ?? shift.campaign?.name ?? 'Shift'

  const statusDescription =
    assignment.liveStatus === 'checked_in' ? 'Checked in · Your location has been confirmed.' :
    assignment.liveStatus === 'late'        ? 'Late · Your late arrival has been flagged to operations.' :
    assignment.liveStatus === 'issue'       ? 'Issue reported · Operations team has been notified.' :
    assignment.liveStatus === 'completed'   ? 'Completed · Great work today!' :
    'Accepted · Check in when you arrive at the store.'

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">

      {/* Breadcrumb / back nav */}
      {isInvited ? (
        <Link href="/staff" className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" /> My shifts
        </Link>
      ) : (
        <nav className="flex items-center gap-1.5 text-sm text-text-secondary">
          <Link href="/staff" className="hover:text-text-primary transition-colors">My shifts</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-text-primary font-medium truncate">{shiftTitle}</span>
        </nav>
      )}

      {/* Eyebrow + title + badge */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] tracking-widest uppercase font-semibold text-text-secondary mb-1.5">
            {isInvited ? 'Shift invitation' : 'Shift detail'}
          </p>
          <h1 className="text-2xl font-bold text-text-primary">{shiftTitle}</h1>
        </div>
        <div className="flex-shrink-0 mt-1">
          <StatusBadge status={displayBadge} size="md" />
        </div>
      </div>

      {/* Fact card */}
      {isInvited ? (
        /* Invitation: 2×2 grid — single col on xs */
        <div className="bg-white border border-border-rostr p-5 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
          <div>
            <p className="text-[10px] tracking-wider uppercase text-text-secondary font-semibold mb-1.5 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Retailer / Store
            </p>
            <p className="text-sm font-semibold text-text-primary">{storeLabel || '—'}</p>
            {address && <p className="text-xs text-text-secondary mt-0.5">{address}</p>}
          </div>
          <div>
            <p className="text-[10px] tracking-wider uppercase text-text-secondary font-semibold mb-1.5 flex items-center gap-1">
              <CalendarDays className="w-3 h-3" /> Date
            </p>
            <p className="text-sm font-semibold text-text-primary">{dateLong}</p>
          </div>
          <div>
            <p className="text-[10px] tracking-wider uppercase text-text-secondary font-semibold mb-1.5 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Time
            </p>
            <p className="text-sm font-bold text-text-primary">{timeStr}</p>
          </div>
          <div>
            <p className="text-[10px] tracking-wider uppercase text-text-secondary font-semibold mb-1.5 flex items-center gap-1">
              <UserCircle className="w-3 h-3" /> Role
            </p>
            <p className="text-sm font-bold text-text-primary">{role || '—'}</p>
          </div>
        </div>
      ) : (
        /* Accepted: 4-col horizontal on desktop, single col on mobile */
        <div className="bg-white border border-border-rostr p-5 grid grid-cols-1 sm:grid-cols-4 gap-x-6 gap-y-5">
          <div className="col-span-1">
            <p className="text-[10px] tracking-wider uppercase text-text-secondary font-semibold mb-1.5 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Retailer / Store
            </p>
            <p className="text-sm font-semibold text-text-primary">{storeLabel || '—'}</p>
            {address && <p className="text-xs text-text-secondary mt-0.5">{address}</p>}
          </div>
          <div>
            <p className="text-[10px] tracking-wider uppercase text-text-secondary font-semibold mb-1.5 flex items-center gap-1">
              <CalendarDays className="w-3 h-3" /> Date
            </p>
            <p className="text-sm font-semibold text-text-primary">{dateShort}</p>
          </div>
          <div>
            <p className="text-[10px] tracking-wider uppercase text-text-secondary font-semibold mb-1.5 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Time
            </p>
            <p className="text-sm font-bold text-text-primary">{timeStr}</p>
          </div>
          <div>
            <p className="text-[10px] tracking-wider uppercase text-text-secondary font-semibold mb-1.5 flex items-center gap-1">
              <UserCircle className="w-3 h-3" /> Role
            </p>
            <p className="text-sm font-bold text-text-primary">{role || '—'}</p>
          </div>
        </div>
      )}

      {isInvited ? (
        <>
          {/* Shift briefing card */}
          {(notes || equipment) && (
            <div className="bg-white border border-border-rostr p-5 space-y-3">
              <h2 className="text-base font-semibold text-text-primary">Shift briefing</h2>
              {notes && <p className="text-sm text-text-secondary leading-relaxed">{notes}</p>}
              {equipment && (
                <div className="flex items-start gap-2 text-sm text-text-secondary border-t border-border-rostr pt-3">
                  <Package className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>
                    <span className="font-medium text-text-primary">Equipment required:</span>{' '}
                    {equipment}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Response CTA card */}
          <div className="bg-white border border-border-rostr p-5 space-y-4">
            <div>
              <h2 className="text-base font-semibold text-text-primary">Can you work this shift?</h2>
              <p className="text-sm text-text-secondary mt-1">
                Your response is sent immediately to the operations team.
              </p>
            </div>
            <ResponseButtons assignmentId={assignment.id} shiftId={shift.id} />
            <p className="text-xs text-text-secondary flex items-center gap-1.5">
              <span className="text-text-secondary/60">ⓘ</span>
              After responding, this invitation updates to Accepted or Declined.
            </p>
          </div>
        </>
      ) : (
        <>
          {/* Shift status card — badge on the right */}
          <div className="bg-white border border-border-rostr p-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-text-primary">Shift status</p>
              <p className="text-xs text-text-secondary mt-0.5">{statusDescription}</p>
            </div>
            <div className="flex-shrink-0">
              <StatusBadge status={displayBadge} size="md" />
            </div>
          </div>

          {/* Briefing + What to bring — side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {notes && (
              <div className="bg-white border border-border-rostr p-5">
                <h2 className="text-sm font-semibold text-text-primary mb-2">Shift briefing</h2>
                <p className="text-sm text-text-secondary leading-relaxed">{notes}</p>
              </div>
            )}
            {equipment && (
              <div className="bg-white border border-border-rostr p-5">
                <h2 className="text-sm font-semibold text-text-primary mb-3">
                  What to bring
                </h2>
                <ul className="space-y-1.5">
                  {equipment.split(/[,·]/).map(s => s.trim()).filter(Boolean).map((item, i) => (
                    <li key={i} className="text-sm text-text-secondary">{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {assignment.liveStatus !== 'completed' && <CheckInPanel />}
        </>
      )}
    </div>
  )
}
