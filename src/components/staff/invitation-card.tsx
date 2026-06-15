import { format, parseISO } from 'date-fns'
import { MapPin, CalendarDays, Clock, UserCircle, Package } from 'lucide-react'
import { StatusBadge } from '@/components/shared/status-badge'
import { InvitationActions } from './invitation-actions'
import type { Shift, ShiftAssignment } from '@/lib/domain/types'

interface Props {
  assignment: ShiftAssignment
  shift: Shift
}

export function InvitationCard({ assignment, shift }: Props) {
  const dateFmt   = format(parseISO(shift.date), 'EEE, d MMM')
  const timeStr   = `${shift.startTime.slice(0, 5)}–${shift.endTime.slice(0, 5)}`
  const retailer  = shift.location?.retailer ?? ''
  const storeName = shift.location?.storeName ?? ''
  const address   = [shift.location?.address, shift.location?.suburb, shift.location?.state]
    .filter(Boolean).join(', ')
  const storeLabel = [retailer, storeName].filter(Boolean).join(' · ')
  const role      = assignment.role ?? shift.roleFocus ?? ''
  const equipment = shift.equipment ?? ''

  return (
    <div className="bg-white border border-border-rostr overflow-hidden rounded-lg">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-border-rostr flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] tracking-widest uppercase font-semibold text-text-secondary mb-1.5">
            You have been invited to
          </p>
          <h2 className="text-xl font-bold text-text-primary">
            {shift.name ?? shift.campaign?.name ?? 'Shift'}
          </h2>
        </div>
        <StatusBadge status="invited" size="md" />
      </div>

      {/* Facts */}
      <div className="px-5 py-4 grid grid-cols-2 gap-x-6 gap-y-4">
        {storeLabel && (
          <div>
            <p className="text-[10px] tracking-wider uppercase text-text-secondary font-semibold mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Store
            </p>
            <p className="text-sm font-medium text-text-primary">{storeLabel}</p>
            {address && <p className="text-xs text-text-secondary mt-0.5">{address}</p>}
          </div>
        )}
        <div>
          <p className="text-[10px] tracking-wider uppercase text-text-secondary font-semibold mb-1 flex items-center gap-1">
            <CalendarDays className="w-3 h-3" /> Date
          </p>
          <p className="text-sm font-medium text-text-primary">{dateFmt}</p>
        </div>
        <div>
          <p className="text-[10px] tracking-wider uppercase text-text-secondary font-semibold mb-1 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Time
          </p>
          <p className="text-sm font-bold text-text-primary">{timeStr}</p>
        </div>
        {role && (
          <div>
            <p className="text-[10px] tracking-wider uppercase text-text-secondary font-semibold mb-1 flex items-center gap-1">
              <UserCircle className="w-3 h-3" /> Role
            </p>
            <p className="text-sm font-medium text-text-primary">{role}</p>
          </div>
        )}
        {equipment && (
          <div className="col-span-2 flex items-start gap-2 text-sm text-text-secondary pt-1">
            <Package className="w-4 h-4 flex-shrink-0 mt-0.5 text-text-secondary" />
            <span>
              <span className="font-semibold text-text-primary text-[10px] uppercase tracking-wider">Equipment required: </span>
              {equipment}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-5 pb-5">
        <InvitationActions assignmentId={assignment.id} shiftId={shift.id} />
      </div>
    </div>
  )
}
