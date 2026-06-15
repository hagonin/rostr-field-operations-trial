import { AlertTriangle, Pencil } from 'lucide-react'
import Link from 'next/link'
import { CoverageBar } from '@/components/shared/coverage-bar'
import type { Shift } from '@/lib/domain/types'
import type { ShiftCoverage } from '@/lib/domain/coverage'

interface CoveragePanelProps {
  shift: Shift
  coverage: ShiftCoverage
}

function DetailRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null
  return (
    <div className="flex gap-2 text-xs">
      <span className="text-text-secondary w-24 flex-shrink-0">{label}</span>
      <span className="text-text-primary">{value}</span>
    </div>
  )
}

export function CoveragePanel({ shift, coverage }: CoveragePanelProps) {
  const loc = shift.location
  const invitedCount = shift.assignments.filter(a => a.status === 'invited').length
  return (
    <div className="space-y-4">
      {/* Coverage card */}
      <div className="bg-white border border-border-rostr p-4 space-y-2 rounded-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text-primary">Shift coverage</h3>
          <span className="text-xs font-semibold tabular-nums text-text-primary">
            {coverage.acceptedTotal} of {coverage.requiredTotal} accepted
          </span>
        </div>
        <CoverageBar accepted={coverage.acceptedTotal} invited={invitedCount} required={coverage.requiredTotal} />
        {coverage.openRoles.length > 0 && (
          <div className="flex items-start gap-1.5 pt-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">
              {coverage.openRoles.join(', ')} role{coverage.openRoles.length !== 1 ? 's' : ''} open · Invite staff or adjust required count
            </p>
          </div>
        )}
      </div>

      {/* Basic shift details */}
      <div className="bg-white border border-border-rostr p-4 space-y-2 rounded-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text-primary">Basic shift details</h3>
          <Link href={`/admin/shifts/${shift.id}/edit`} className="text-indigo-action hover:text-indigo-hover">
            <Pencil className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="space-y-1.5">
          <DetailRow label="Campaign"  value={shift.campaign?.name} />
          <DetailRow label="Client"    value={shift.campaign?.clientName} />
          <DetailRow label="Role focus" value={shift.roleFocus} />
          <DetailRow label="Status"    value={shift.status} />
          <DetailRow label="Retailer"  value={loc?.retailer} />
          <DetailRow label="State"     value={loc?.state} />
          <DetailRow label="Address"   value={loc?.address} />
          <DetailRow label="Country"   value={loc?.country} />
        </div>
      </div>

      {/* Equipment */}
      {shift.equipment && (
        <div className="bg-white border border-border-rostr p-4 space-y-1 rounded-lg">
          <h3 className="text-sm font-semibold text-text-primary">Equipment required</h3>
          <p className="text-xs text-text-secondary">{shift.equipment}</p>
        </div>
      )}

      {/* Notes */}
      {shift.notes && (
        <div className="bg-white border border-border-rostr p-4 space-y-1 rounded-lg">
          <h3 className="text-sm font-semibold text-text-primary">Notes / briefing</h3>
          <p className="text-xs text-text-secondary leading-relaxed">{shift.notes}</p>
        </div>
      )}
    </div>
  )
}
