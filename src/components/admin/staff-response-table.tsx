import { CheckCircle, Circle } from 'lucide-react'
import { StatusBadge } from '@/components/shared/status-badge'
import type { ShiftAssignment } from '@/lib/domain/types'

interface StaffResponseTableProps {
  assignments: ShiftAssignment[]
  acceptedCount: number
  openSlots: number
}

const PAGE_SIZE = 8

export function StaffResponseTable({ assignments, acceptedCount, openSlots }: StaffResponseTableProps) {
  const page = assignments.slice(0, PAGE_SIZE)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">Staff responses</h3>
          <p className="text-xs text-text-secondary mt-0.5">
            {acceptedCount} accepted · {openSlots} open slot{openSlots !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto border border-border-rostr rounded-lg">
        <table className="w-full text-xs min-w-[600px]">
          <thead>
            <tr className="bg-gray-50 border-b border-border-rostr">
              {['STAFF MEMBER', 'HOURS', 'LIVE STATUS', 'TIME', 'LOCATION'].map(h => (
                <th key={h} className="px-3 py-2.5 text-left text-[11px] font-semibold text-text-secondary tracking-wide whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {page.map(a => {
              const name = a.staff?.fullName ?? 'Unknown'
              const displayStatus = a.liveStatus ?? a.status
              const locationConfirmed = a.liveStatus === 'checked_in' || a.liveStatus === 'completed'
              return (
                <tr key={a.id} className="border-b border-border-rostr last:border-0">
                  <td className="px-3 py-3 whitespace-nowrap">
                    <p className="font-medium text-text-primary">{name}</p>
                    <p className="text-[11px] text-text-secondary">{a.role ?? '—'}</p>
                  </td>
                  <td className="px-3 py-3 text-text-secondary tabular-nums">{a.hours ?? '—'}</td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <StatusBadge status={displayStatus} showIcon={false} />
                  </td>
                  <td className="px-3 py-3 text-text-secondary tabular-nums">{a.checkInTime ?? '—'}</td>
                  <td className="px-3 py-3">
                    {locationConfirmed
                      ? <CheckCircle className="w-4 h-4 text-green-500" />
                      : <Circle      className="w-4 h-4 text-gray-300" />
                    }
                  </td>
                </tr>
              )
            })}
            {assignments.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-xs text-text-secondary">
                  No staff assigned yet. Use &quot;Assign staff&quot; to invite people.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-text-secondary">
        Showing 1–{Math.min(PAGE_SIZE, assignments.length)} of {assignments.length} staff
      </p>
    </div>
  )
}
