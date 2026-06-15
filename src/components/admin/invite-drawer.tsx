'use client'
import { useState, useMemo, useTransition } from 'react'
import { Search, X, ChevronDown, Globe, ChevronDown as ChevronDownSm, AlertTriangle } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet'
import { StatusBadge } from '@/components/shared/status-badge'
import { CoverageBar } from '@/components/shared/coverage-bar'
import { inviteStaff } from '@/lib/data/actions'
import type { Shift, Staff, AvailabilityStatus } from '@/lib/domain/types'
import type { ShiftCoverage } from '@/lib/domain/coverage'

interface InviteDrawerProps {
  open: boolean
  onClose: () => void
  shift: Shift
  allStaff: Staff[]
  coverage: ShiftCoverage
}

const STATUS_OPTIONS: { label: string; value: AvailabilityStatus | '' }[] = [
  { label: 'All statuses', value: '' },
  { label: 'Available',    value: 'available' },
  { label: 'Maybe',        value: 'maybe' },
  { label: 'Unavailable',  value: 'unavailable' },
]

const AVATAR_COLORS = [
  'bg-blue-100 text-blue-700',
  'bg-emerald-100 text-emerald-700',
  'bg-violet-100 text-violet-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-cyan-100 text-cyan-700',
  'bg-orange-100 text-orange-700',
  'bg-teal-100 text-teal-700',
]

function avatarColor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash + name.charCodeAt(i)) % AVATAR_COLORS.length
  return AVATAR_COLORS[hash]
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase()
}

function countryFromEmail(email: string) {
  if (email.endsWith('.com.au') || email.endsWith('.net.au') || email.endsWith('.org.au')) return 'Australia'
  if (email.endsWith('.co.nz') || email.endsWith('.nz')) return 'New Zealand'
  return 'Other'
}

const INITIAL_SHOW = 10

export function InviteDrawer({ open, onClose, shift, allStaff, coverage }: InviteDrawerProps) {
  const [q,            setQ]            = useState('')
  const [statusFilter, setStatusFilter] = useState<AvailabilityStatus | ''>('')
  const [countryFilter,setCountryFilter]= useState('')
  const [selected,     setSelected]     = useState<Set<string>>(new Set())
  const [isPending,    startTransition] = useTransition()
  const [statusOpen,   setStatusOpen]   = useState(false)
  const [countryOpen,  setCountryOpen]  = useState(false)
  const [expanded,     setExpanded]     = useState(false)

  const assignedIds = useMemo(() => new Set(shift.assignments.map(a => a.staffId)), [shift.assignments])
  const requiredRoles = useMemo(() => new Set(coverage.byRole.map(r => r.role)), [coverage])

  const countryOptions = useMemo(() => {
    const countries = [...new Set(allStaff.map(s => countryFromEmail(s.email ?? '')).filter(Boolean))]
    return ['', ...countries.sort()]
  }, [allStaff])

  const eligible = useMemo(() => {
    let list = allStaff.filter(s => !assignedIds.has(s.id))
    if (q)             list = list.filter(s => s.fullName.toLowerCase().includes(q.toLowerCase()))
    if (statusFilter)  list = list.filter(s => s.availabilityStatus === statusFilter)
    if (countryFilter) list = list.filter(s => countryFromEmail(s.email ?? '') === countryFilter)
    list.sort((a, b) => {
      if (a.distanceKm == null && b.distanceKm == null) return 0
      if (a.distanceKm == null) return 1
      if (b.distanceKm == null) return -1
      return a.distanceKm - b.distanceKm
    })
    return list
  }, [allStaff, assignedIds, q, statusFilter, countryFilter])

  const visible      = expanded ? eligible : eligible.slice(0, INITIAL_SHOW)
  const hiddenCount  = eligible.length - INITIAL_SHOW

  const eligibleSelectable = eligible.filter(s => s.availabilityStatus !== 'unavailable')
  const allEligibleSelected = eligibleSelectable.length > 0 && eligibleSelectable.every(s => selected.has(s.id))

  function toggle(id: string) {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  function toggleAllEligible() {
    if (allEligibleSelected) {
      setSelected(prev => { const n = new Set(prev); eligibleSelectable.forEach(s => n.delete(s.id)); return n })
    } else {
      setSelected(prev => { const n = new Set(prev); eligibleSelectable.forEach(s => n.add(s.id)); return n })
    }
  }

  function handleSend() {
    startTransition(async () => {
      await inviteStaff(shift.id, [...selected])
      setSelected(new Set())
      onClose()
    })
  }

  const timeStr       = `${shift.startTime.slice(0, 5)} – ${shift.endTime.slice(0, 5)}`
  const statusLabel   = STATUS_OPTIONS.find(o => o.value === statusFilter)?.label ?? 'All statuses'
  const countryLabel  = countryFilter || 'Australia'

  return (
    <Sheet open={open} onOpenChange={v => { if (!v) onClose() }}>
      <SheetContent side="right" showCloseButton={false} className="w-full sm:max-w-md flex flex-col gap-0 p-0">
        {/* Header */}
        <SheetHeader className="border-b border-border-rostr px-5 py-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <SheetTitle className="text-sm font-semibold">Assign &amp; invite staff</SheetTitle>
              <p className="text-xs text-text-secondary mt-0.5">
                {shift.name ?? ''}{shift.name ? ' · ' : ''}{timeStr}
              </p>
            </div>
            <button onClick={onClose} aria-label="Close" className="p-2 -mr-2 text-text-secondary hover:text-text-primary rounded-lg">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-3 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-secondary">
                {coverage.acceptedTotal} accepted of {coverage.requiredTotal} required
              </span>
              {coverage.openRoles.length > 0 && (
                <span className="text-amber-600 font-medium">Under-Covered</span>
              )}
            </div>
            <CoverageBar
              accepted={coverage.acceptedTotal}
              invited={shift.assignments.filter(a => a.status === 'invited').length}
              required={coverage.requiredTotal}
              size="sm"
            />
          </div>
        </SheetHeader>

        {/* Search + filters */}
        <div className="px-5 py-3 border-b border-border-rostr flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2 w-3.5 h-3.5 text-text-secondary pointer-events-none" />
            <input
              className="pl-7 h-8 w-full border border-border-rostr text-xs bg-white focus:outline-none focus:ring-1 focus:ring-indigo-action rounded-lg"
              placeholder="Search"
              value={q}
              onChange={e => setQ(e.target.value)}
            />
          </div>

          {/* Status filter */}
          <div
            className="relative"
            onKeyDown={e => { if (e.key === 'Escape') setStatusOpen(false) }}
          >
            <button
              onClick={() => { setStatusOpen(v => !v); setCountryOpen(false) }}
              aria-haspopup="listbox"
              aria-expanded={statusOpen}
              className="h-8 px-2.5 border border-border-rostr text-xs text-text-secondary flex items-center gap-1 whitespace-nowrap hover:bg-gray-50 rounded-lg"
            >
              {statusLabel} ({eligible.length}) <ChevronDown className="w-3 h-3" />
            </button>
            {statusOpen && (
              <div role="listbox" className="absolute left-0 top-full mt-1 w-40 bg-white border border-border-rostr shadow-md z-20 rounded-lg overflow-hidden">
                {STATUS_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    role="option"
                    aria-selected={statusFilter === opt.value}
                    onClick={() => { setStatusFilter(opt.value); setStatusOpen(false) }}
                    className={`block w-full text-left px-3 py-2 text-xs hover:bg-gray-50 ${statusFilter === opt.value ? 'text-indigo-action font-medium' : 'text-text-primary'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Country filter */}
          <div
            className="relative"
            onKeyDown={e => { if (e.key === 'Escape') setCountryOpen(false) }}
          >
            <button
              onClick={() => { setCountryOpen(v => !v); setStatusOpen(false) }}
              aria-haspopup="listbox"
              aria-expanded={countryOpen}
              className="h-8 px-2.5 border border-border-rostr text-xs text-text-secondary flex items-center gap-1 whitespace-nowrap hover:bg-gray-50 rounded-lg"
            >
              <Globe className="w-3 h-3" />
              {countryLabel} <ChevronDownSm className="w-3 h-3" />
            </button>
            {countryOpen && (
              <div role="listbox" className="absolute right-0 top-full mt-1 w-40 bg-white border border-border-rostr shadow-md z-20 rounded-lg overflow-hidden">
                {countryOptions.map(c => (
                  <button
                    key={c}
                    role="option"
                    aria-selected={countryFilter === c}
                    onClick={() => { setCountryFilter(c); setCountryOpen(false) }}
                    className={`block w-full text-left px-3 py-2 text-xs hover:bg-gray-50 ${countryFilter === c ? 'text-indigo-action font-medium' : 'text-text-primary'}`}
                  >
                    {c || 'All countries'}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Select all eligible */}
        <div className="px-5 py-2.5 border-b border-border-rostr flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={allEligibleSelected} onChange={toggleAllEligible} className="accent-indigo-action" />
            <span className="text-xs text-text-secondary">Select all (Available + Maybe)</span>
          </label>
          {selected.size > 0 && (
            <span className="text-xs font-medium text-indigo-action">{selected.size} selected</span>
          )}
        </div>

        {/* Staff list */}
        <div className="flex-1 overflow-y-auto">
          {visible.map(staff => {
            const isSelectable = staff.availabilityStatus !== 'unavailable'
            const roleRequired = !staff.roleTitle || requiredRoles.has(staff.roleTitle)
            return (
              <label
                key={staff.id}
                className={`flex items-center gap-3 px-5 py-3 border-b border-border-rostr last:border-0 ${isSelectable ? 'cursor-pointer hover:bg-gray-50' : 'opacity-60 cursor-not-allowed'}`}
              >
                <input
                  type="checkbox"
                  disabled={!isSelectable}
                  checked={selected.has(staff.id)}
                  onChange={() => toggle(staff.id)}
                  className="accent-indigo-action flex-shrink-0"
                />
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-semibold ${avatarColor(staff.fullName)}`}>
                  {initials(staff.fullName)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-text-primary">{staff.fullName}</p>
                  <p className="text-[11px] text-text-secondary flex items-center gap-1">
                    {staff.roleTitle}{staff.distanceKm ? ` · ${staff.distanceKm} km` : ''}
                    {!roleRequired && (
                      <span className="text-amber-600 ml-1" title="Role not required">
                        Role not required
                      </span>
                    )}
                  </p>
                </div>
                <StatusBadge status={staff.availabilityStatus} size="sm" />
              </label>
            )
          })}

          {!expanded && hiddenCount > 0 && (
            <button
              onClick={() => setExpanded(true)}
              className="w-full py-3 text-xs text-indigo-action hover:text-indigo-hover flex items-center justify-center gap-1 border-b border-border-rostr"
            >
              Show {hiddenCount} more staff <ChevronDownSm className="w-3 h-3" />
            </button>
          )}

          {eligible.length === 0 && (
            <p className="px-5 py-8 text-xs text-text-secondary text-center">No staff match your filters.</p>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border-rostr">
          <p className="px-5 pt-3 text-[11px] text-text-secondary">
            Only available and Maybe staff can be selected and invited.
          </p>
          <SheetFooter className="px-5 py-3 flex flex-row justify-end gap-3 w-full">
            <button onClick={onClose} className="flex-1 px-4 py-2 text-sm border border-border-rostr text-text-secondary hover:bg-gray-50 transition-colors rounded-lg text-center justify-center">
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={selected.size === 0 || isPending}
              className="flex-1 px-4 py-2 text-sm bg-indigo-action hover:bg-indigo-hover text-white font-medium disabled:opacity-50 transition-colors rounded-lg text-center justify-center"
            >
              {isPending ? 'Sending…' : `Send ${selected.size > 0 ? selected.size : ''} invite${selected.size !== 1 ? 's' : ''}`}
            </button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  )
}
