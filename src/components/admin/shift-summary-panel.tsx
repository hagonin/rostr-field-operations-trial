import { CalendarDays, MapPin, Users, Package, CheckCircle, Circle } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { eligibleStaffNotice } from '@/lib/data/presentational-fixtures'
import type { RoleRow } from '@/components/admin/staffing-requirements-table'

interface ShiftSummaryPanelProps {
  name: string
  date: string
  startTime: string
  endTime: string
  storeName: string
  storeAddress: string
  retailer: string
  storeState: string
  storeCountry: string
  equipment: string
  roles: RoleRow[]
}

export function ShiftSummaryPanel({
  name, date, startTime, endTime,
  storeName, storeAddress, retailer, storeState, storeCountry,
  equipment, roles,
}: ShiftSummaryPanelProps) {
  const totalStaff  = roles.reduce((s, r) => s + r.headcount, 0)
  const hasDetails  = !!(name && date && startTime && endTime)
  const hasStaffing = roles.length > 0 && totalStaff > 0

  const dateFmt = date ? (() => { try { return format(parseISO(date), 'EEE, d MMM yyyy') } catch { return date } })() : null
  const timeLine = (startTime || endTime) ? `${startTime || '—'} – ${endTime || '—'}` : null
  const locationMeta = [retailer, storeCountry, storeState].filter(Boolean).join(' · ')

  return (
    <div className="sticky top-6 bg-white border border-border-rostr rounded-lg overflow-hidden">
      {/* Card header */}
      <div className="px-4 py-3 border-b border-border-rostr">
        <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Shift summary</h2>
      </div>

      {/* Shift overview */}
      <div className="px-4 py-4 space-y-2">
        <p className="font-semibold text-sm text-text-primary">
          {name || <span className="italic font-normal text-text-secondary">Shift name</span>}
        </p>

        {(dateFmt || timeLine) && (
          <div className="flex items-center gap-1.5 text-xs text-text-secondary">
            <CalendarDays className="w-3.5 h-3.5 flex-shrink-0" />
            <span>
              {dateFmt ?? '—'}
              {timeLine && <span className="ml-1">· {timeLine}</span>}
            </span>
          </div>
        )}

        {storeName && (
          <div className="flex items-center gap-1.5 text-xs text-text-secondary">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{storeName}</span>
          </div>
        )}

        {totalStaff > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-text-secondary">
            <Users className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{totalStaff} staff required</span>
          </div>
        )}
      </div>

      {/* Role breakdown */}
      <div className="border-t border-border-rostr px-4 py-3 space-y-1.5">
        {roles.length > 0 ? roles.map((r, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <span className="text-text-secondary">{r.role}</span>
            <span className="font-semibold tabular-nums text-text-primary">{r.headcount}</span>
          </div>
        )) : (
          <p className="text-xs text-text-secondary italic">No roles added yet</p>
        )}
      </div>

      {/* Location + equipment */}
      <div className="border-t border-border-rostr px-4 py-3 space-y-1 text-xs text-text-secondary">
        {locationMeta
          ? <p className="font-medium text-text-primary">{locationMeta}</p>
          : <p className="italic">No location selected</p>
        }
        {storeAddress && <p>{storeAddress}</p>}
        {equipment && (
          <div className="flex items-start gap-1.5 pt-1">
            <Package className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            <span>{equipment}</span>
          </div>
        )}
      </div>

      {/* Ready to publish */}
      <div className="border-t border-border-rostr px-4 py-3 space-y-2">
        <p className="text-xs font-semibold text-text-primary">Ready to publish</p>
        <ChecklistItem done={hasDetails}  label="Shift details complete" />
        <ChecklistItem done={hasStaffing} label="Staffing requirements set" />
        <ChecklistItem done={false}       label="Notify eligible staff" />
        <ChecklistItem done={false}       label="Manager approval · Roadmap" muted />
        {totalStaff > 0 && (
          <p className="text-[11px] text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-2 mt-1 rounded-lg">
            Publishing will notify {eligibleStaffNotice} eligible staff members.
          </p>
        )}
      </div>
    </div>
  )
}

function ChecklistItem({ done, label, muted }: { done: boolean; label: string; muted?: boolean }) {
  return (
    <div className={`flex items-center gap-2 text-xs ${muted ? 'opacity-40' : ''}`}>
      {done
        ? <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
        : <Circle      className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />}
      <span className={done ? 'text-text-primary' : 'text-text-secondary'}>{label}</span>
    </div>
  )
}
