import Link from 'next/link'
import { AlertCircle, ArrowRight, CheckCircle } from 'lucide-react'
import type { PriorityShift } from '@/lib/domain/coverage'

interface PriorityShiftsProps {
  items: PriorityShift[]
}

export function PriorityShifts({ items }: PriorityShiftsProps) {
  return (
    <div className="bg-white border border-border-rostr p-4 rounded-lg">
      <div className="flex items-center gap-2 mb-3">
        <AlertCircle className="w-4 h-4 text-amber-500" />
        <h3 className="text-sm font-semibold text-text-primary">Priority shifts</h3>
      </div>

      {items.length === 0 ? (
        <p className="text-xs text-text-secondary py-2 flex items-center gap-1">
          All shifts are covered <CheckCircle className="w-3.5 h-3.5 text-green-600" />
        </p>
      ) : (
        <div className="space-y-3">
          {items.map(({ shift, coverage }) => {
            const title = shift.name ?? shift.campaign?.name ?? 'Shift'
            const suburb = shift.location?.suburb ?? ''
            const openCount = coverage.openRoles.length
            return (
              <div key={shift.id} className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-text-primary">
                    {title}{suburb ? ` · ${suburb}` : ''}
                  </p>
                  <p className="text-xs text-amber-600 mt-0.5">
                    {openCount} role{openCount !== 1 ? 's' : ''} unfilled
                  </p>
                </div>
                <Link
                  href={`/admin/shifts/${shift.id}`}
                  className="text-xs text-indigo-action hover:text-indigo-hover font-medium whitespace-nowrap flex items-center gap-0.5 flex-shrink-0"
                >
                  Assign & invite <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
