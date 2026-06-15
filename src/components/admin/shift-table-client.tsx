'use client'
import { useState, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { format, parseISO } from 'date-fns'
import { Search, ChevronDown } from 'lucide-react'
import { StatusBadge } from '@/components/shared/status-badge'
import type { Shift } from '@/lib/domain/types'
import type { ShiftCoverage, ComputedShiftStatus } from '@/lib/domain/coverage'

export interface ShiftRow {
  shift: Shift
  coverage: ShiftCoverage
  status: ComputedShiftStatus
}

const COLS = ['Schedule', 'State', 'Area / Country', 'Retailer', 'Store', 'Campaign', 'Staff', 'Status'] as const

function countryCode(country: string) {
  return country === 'New Zealand' ? 'NZ' : 'AU'
}

function uniq(values: (string | null | undefined)[]): string[] {
  return [...new Set(values.filter(Boolean) as string[])].sort()
}

const selCls = 'h-9 w-full border border-border-rostr text-sm pl-2 pr-7 bg-white text-text-secondary appearance-none focus:outline-none focus:ring-1 focus:ring-indigo-action rounded-lg'

export default function ShiftTableClient({ rows }: { rows: ShiftRow[] }) {
  const router        = useRouter()
  const searchParams  = useSearchParams()
  const locationParam = searchParams.get('location') ?? ''
  const [q,        setQ]        = useState('')
  const [state,    setState]    = useState('')
  const [suburb,   setSuburb]   = useState('')
  const [retailer, setRetailer] = useState('')
  const [store,    setStore]    = useState('')

  const states    = useMemo(() => uniq(rows.map(r => r.shift.location?.state)),    [rows])
  const suburbs   = useMemo(() => uniq(rows.map(r => r.shift.location?.suburb)),   [rows])
  const retailers = useMemo(() => uniq(rows.map(r => r.shift.location?.retailer)), [rows])
  const stores    = useMemo(() => uniq(rows.map(r => r.shift.location?.storeName)),[rows])

  const filtered = useMemo(() => rows.filter(r => {
    if (locationParam && r.shift.location?.storeName !== locationParam) return false
    if (q        && !r.shift.campaign?.name.toLowerCase().includes(q.toLowerCase())) return false
    if (state    && r.shift.location?.state     !== state)    return false
    if (suburb   && r.shift.location?.suburb    !== suburb)   return false
    if (retailer && r.shift.location?.retailer  !== retailer) return false
    if (store    && r.shift.location?.storeName !== store)    return false
    return true
  }), [rows, q, state, suburb, retailer, store, locationParam])

  const hasFilters = Boolean(q || state || suburb || retailer || store)
  const clear = () => { setQ(''); setState(''); setSuburb(''); setRetailer(''); setStore('') }

  function navigate(shiftId: string) {
    router.push(`/admin/shifts/${shiftId}`)
  }

  return (
    <div className="space-y-3">
      {/* Heading + count */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-text-primary">Upcoming campaign shifts</h2>
        <span className="text-xs text-text-secondary tabular-nums bg-gray-100 px-2 py-0.5 rounded-md">
          {filtered.length} shown
        </span>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-shrink-0">
          <Search className="absolute left-2 top-2.5 w-4 h-4 text-text-secondary pointer-events-none" />
          <input
            aria-label="Search by campaign"
            className="pl-8 h-9 w-40 border border-border-rostr text-sm bg-white focus:outline-none focus:ring-1 focus:ring-indigo-action rounded-lg"
            placeholder="Campaign"
            value={q}
            onChange={e => setQ(e.target.value)}
          />
        </div>
        <div className="relative flex-1 min-w-[80px]">
          <select aria-label="Filter by state" className={selCls} value={state} onChange={e => setState(e.target.value)}>
            <option value="">State</option>
            {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-text-secondary pointer-events-none" />
        </div>
        <div className="relative flex-1 min-w-[110px]">
          <select aria-label="Filter by area/suburb" className={selCls} value={suburb} onChange={e => setSuburb(e.target.value)}>
            <option value="">Area / suburb</option>
            {suburbs.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-text-secondary pointer-events-none" />
        </div>
        <div className="relative flex-1 min-w-[90px]">
          <select aria-label="Filter by retailer" className={selCls} value={retailer} onChange={e => setRetailer(e.target.value)}>
            <option value="">Retailer</option>
            {retailers.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-text-secondary pointer-events-none" />
        </div>
        <div className="relative flex-1 min-w-[80px]">
          <select aria-label="Filter by store" className={selCls} value={store} onChange={e => setStore(e.target.value)}>
            <option value="">Store</option>
            {stores.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-text-secondary pointer-events-none" />
        </div>
        {hasFilters && (
          <button
            onClick={clear}
            className="text-sm text-indigo-action hover:text-indigo-hover font-medium px-1 transition-colors whitespace-nowrap flex-shrink-0"
          >
            Clear
          </button>
        )}
      </div>

      {/* Empty state — shown above both views */}
      {filtered.length === 0 && (
        <div className="border border-border-rostr rounded-lg px-4 py-10 text-center text-sm text-text-secondary">
          {rows.length === 0
            ? 'No upcoming shifts — create your first campaign shift above.'
            : 'No shifts match the current filters.'}
        </div>
      )}

      {/* Desktop table — hidden on mobile */}
      {filtered.length > 0 && (
        <div className="hidden md:block overflow-x-auto border border-border-rostr rounded-lg">
          <table className="w-full text-xs min-w-[860px]" aria-label="Upcoming campaign shifts">
            <thead>
              <tr className="bg-gray-50 border-b border-border-rostr">
                {COLS.map(h => (
                  <th key={h} scope="col" className="px-3 py-2.5 text-left text-[11px] font-semibold text-text-secondary whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(({ shift, coverage, status }) => {
                const date    = parseISO(shift.date)
                const dateStr = format(date, 'EEE dd MMM').toUpperCase()
                const timeStr = `${shift.startTime.slice(0, 5)}–${shift.endTime.slice(0, 5)}`
                const loc = shift.location
                return (
                  <tr
                    key={shift.id}
                    tabIndex={0}
                    role="button"
                    aria-label={`${dateStr} ${loc?.storeName ?? ''} — open shift`}
                    onClick={() => navigate(shift.id)}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(shift.id) } }}
                    className="border-b border-border-rostr hover:bg-gray-50 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-indigo-action"
                  >
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="font-medium text-text-primary tabular-nums">{dateStr}</div>
                      <div className="text-text-secondary tabular-nums">{timeStr}</div>
                    </td>
                    <td className="px-3 py-3 text-text-secondary whitespace-nowrap">{loc?.state ?? '—'}</td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="text-text-primary">{loc?.suburb ?? '—'}</div>
                      <div className="text-text-secondary">{loc ? countryCode(loc.country) : ''}</div>
                    </td>
                    <td className="px-3 py-3 text-text-secondary whitespace-nowrap">{loc?.retailer ?? '—'}</td>
                    <td className="px-3 py-3 text-text-primary max-w-[140px] truncate">{loc?.storeName ?? '—'}</td>
                    <td className="px-3 py-3 text-text-primary max-w-[180px] truncate">{shift.campaign?.name ?? '—'}</td>
                    <td className="px-3 py-3 text-center font-semibold tabular-nums">
                      {coverage.acceptedTotal}/{coverage.requiredTotal}
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge status={status} showIcon={false} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile card list — hidden on md+ */}
      {filtered.length > 0 && (
        <div className="md:hidden space-y-2">
          {filtered.map(({ shift, coverage, status }) => {
            const date    = parseISO(shift.date)
            const dateStr = format(date, 'EEE dd MMM').toUpperCase()
            const timeStr = `${shift.startTime.slice(0, 5)}–${shift.endTime.slice(0, 5)}`
            const loc = shift.location
            return (
              <div
                key={shift.id}
                tabIndex={0}
                role="button"
                aria-label={`${dateStr} ${loc?.storeName ?? ''} — open shift`}
                onClick={() => navigate(shift.id)}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(shift.id) } }}
                className="border border-border-rostr rounded-lg p-3 bg-white cursor-pointer hover:bg-gray-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-action"
              >
                <div className="font-medium text-sm text-text-primary tabular-nums mb-2">
                  {dateStr} · {timeStr}
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                  <div>
                    <div className="text-text-secondary">State</div>
                    <div className="text-text-primary font-medium">{loc?.state ?? '—'}</div>
                  </div>
                  <div>
                    <div className="text-text-secondary">Area / Country</div>
                    <div className="text-text-primary font-medium">
                      {loc?.suburb ?? '—'}{loc ? ` / ${countryCode(loc.country)}` : ''}
                    </div>
                  </div>
                  <div>
                    <div className="text-text-secondary">Retailer</div>
                    <div className="text-text-primary font-medium">{loc?.retailer ?? '—'}</div>
                  </div>
                  <div>
                    <div className="text-text-secondary">Store</div>
                    <div className="text-text-primary font-medium truncate">{loc?.storeName ?? '—'}</div>
                  </div>
                  <div>
                    <div className="text-text-secondary">Campaign</div>
                    <div className="text-text-primary font-medium truncate">{shift.campaign?.name ?? '—'}</div>
                  </div>
                  <div>
                    <div className="text-text-secondary">Staff</div>
                    <div className="text-text-primary font-semibold tabular-nums">{coverage.acceptedTotal}/{coverage.requiredTotal}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-text-secondary mb-0.5">Status</div>
                    <StatusBadge status={status} showIcon={false} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
