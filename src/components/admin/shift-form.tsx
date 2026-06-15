'use client'
import { useState, useTransition } from 'react'
import Link from 'next/link'
import { ChevronDown, Copy } from 'lucide-react'
import { StaffingRequirementsTable, type RoleRow } from '@/components/admin/staffing-requirements-table'
import { ShiftSummaryPanel } from '@/components/admin/shift-summary-panel'
import { createShift, updateShift } from '@/lib/data/actions'
import type { Campaign, Location, Shift } from '@/lib/domain/types'

interface ShiftFormProps {
  campaigns: Campaign[]
  locations: Location[]
  editShift?: Shift
}

export function ShiftForm({ campaigns, locations, editShift }: ShiftFormProps) {
  const isEdit = !!editShift
  const [isPending, startTransition] = useTransition()

  const retailers = [...new Set(locations.map(l => l.retailer))].sort()

  const initLocation = editShift?.location ?? null
  const [name,       setName]       = useState(editShift?.name ?? '')
  const [retailer,   setRetailer]   = useState(initLocation?.retailer ?? '')
  const [locationId, setLocationId] = useState(editShift?.locationId ?? '')
  const [roleFocus,  setRoleFocus]  = useState(editShift?.roleFocus ?? '')
  const [equipment,  setEquipment]  = useState(editShift?.equipment ?? '')
  const [notes,      setNotes]      = useState(editShift?.notes ?? '')
  const [date,       setDate]       = useState(editShift?.date ?? '')
  const [startTime,  setStartTime]  = useState(editShift?.startTime?.slice(0, 5) ?? '')
  const [endTime,    setEndTime]    = useState(editShift?.endTime?.slice(0, 5) ?? '')
  const [saveAsTemplate, setSaveAsTemplate] = useState(false)
  const [roles,      setRoles]      = useState<RoleRow[]>(
    editShift?.shiftRoles.map(r => ({ role: r.role, headcount: r.headcount, breakMinutes: r.breakMinutes })) ?? []
  )

  const filteredLocations = retailer ? locations.filter(l => l.retailer === retailer) : locations
  const selectedLoc = locations.find(l => l.id === locationId) ?? null

  function handleRetailerChange(r: string) {
    setRetailer(r)
    setLocationId('')
  }

  function handlePublish() {
    startTransition(async () => {
      const input = { name, campaignId: '', locationId, roleFocus, equipment, notes, date, startTime, endTime, roles }
      if (isEdit) await updateShift(editShift.id, input)
      else        await createShift(input)
    })
  }

  const inputCls   = 'h-9 w-full border border-border-rostr text-sm px-3 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-action rounded-lg'
  const labelCls   = 'block text-xs font-medium text-text-secondary mb-1'
  const sectionCls = 'bg-white border border-border-rostr p-5 space-y-4 rounded-lg'

  return (
    <div className="flex flex-col xl:flex-row gap-6 items-start">
      {/* Left form */}
      <div className="flex-1 min-w-0 space-y-4">
        {/* Shift basics */}
        <section className={sectionCls}>
          <h2 className="text-sm font-semibold text-text-primary">Shift basics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="col-span-full">
              <label htmlFor="shift-name" className={labelCls}>
                Shift name<span className="text-red-500" aria-hidden="true"> *</span>
              </label>
              <input
                id="shift-name"
                required
                aria-required="true"
                className={inputCls}
                placeholder="e.g. Morning service"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="shift-retailer" className={labelCls}>Retailer</label>
              <div className="relative">
                <select
                  id="shift-retailer"
                  className={`${inputCls} appearance-none pr-8`}
                  value={retailer}
                  onChange={e => handleRetailerChange(e.target.value)}
                >
                  <option value="">Select retailer</option>
                  {retailers.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
              </div>
            </div>
            <div>
              <label htmlFor="shift-location" className={labelCls}>Store location</label>
              <div className="relative">
                <select
                  id="shift-location"
                  className={`${inputCls} appearance-none pr-8`}
                  value={locationId}
                  onChange={e => setLocationId(e.target.value)}
                >
                  <option value="">Select store</option>
                  {filteredLocations.map(l => <option key={l.id} value={l.id}>{l.storeName}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
              </div>
            </div>
            <div>
              <label htmlFor="shift-country" className={labelCls}>Country</label>
              <input
                id="shift-country"
                className={`${inputCls} bg-gray-100 text-text-secondary cursor-default`}
                readOnly
                value={selectedLoc?.country ?? ''}
                placeholder="From selected store"
              />
            </div>
            <div>
              <label htmlFor="shift-state" className={labelCls}>State</label>
              <input
                id="shift-state"
                className={`${inputCls} bg-gray-100 text-text-secondary cursor-default`}
                readOnly
                value={selectedLoc?.state ?? ''}
                placeholder="From selected store"
              />
            </div>
            <div className="col-span-full">
              <label htmlFor="shift-address" className={labelCls}>Address</label>
              <input
                id="shift-address"
                className={`${inputCls} bg-gray-100 text-text-secondary cursor-default`}
                readOnly
                value={selectedLoc?.address ?? ''}
                placeholder="From selected store"
              />
            </div>
            <div>
              <label htmlFor="shift-role" className={labelCls}>Role category</label>
              <input
                id="shift-role"
                className={inputCls}
                placeholder="e.g. Brand Ambassador"
                value={roleFocus}
                onChange={e => setRoleFocus(e.target.value)}
              />
            </div>
            <div className="col-span-full">
              <label htmlFor="shift-equipment" className={labelCls}>Equipment required</label>
              <textarea
                id="shift-equipment"
                className={`${inputCls} h-16 py-2 resize-none`}
                placeholder="e.g. Sampling stand, branded apron, tablet"
                value={equipment}
                onChange={e => setEquipment(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Schedule */}
        <section className={sectionCls}>
          <h2 className="text-sm font-semibold text-text-primary">Schedule</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="shift-date" className={labelCls}>
                Date<span className="text-red-500" aria-hidden="true"> *</span>
              </label>
              <input
                id="shift-date"
                type="date"
                required
                aria-required="true"
                className={inputCls}
                value={date}
                onChange={e => setDate(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="shift-start" className={labelCls}>
                Start time<span className="text-red-500" aria-hidden="true"> *</span>
              </label>
              <input
                id="shift-start"
                type="time"
                required
                aria-required="true"
                className={inputCls}
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="shift-end" className={labelCls}>
                End time<span className="text-red-500" aria-hidden="true"> *</span>
              </label>
              <input
                id="shift-end"
                type="time"
                required
                aria-required="true"
                className={inputCls}
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
              />
            </div>
          </div>
          {/* Duplicate shift toggle — coming soon */}
          <div className="flex items-center gap-2.5 text-xs text-text-secondary select-none" title="Coming soon">
            <Copy className="w-3.5 h-3.5 text-text-secondary flex-shrink-0" />
            <span className="text-gray-400">Duplicate this shift</span>
            <div
              aria-disabled="true"
              className="w-8 h-4 rounded-full bg-gray-200 relative flex-shrink-0 cursor-not-allowed"
            >
              <div className="absolute left-0.5 top-0.5 w-3 h-3 rounded-full bg-white shadow-sm" />
            </div>
            <span className="text-[11px] text-gray-400">Roadmap</span>
          </div>
        </section>

        {/* Staffing requirements */}
        <section className={sectionCls}>
          <div>
            <h2 className="text-sm font-semibold text-text-primary">Staffing requirements</h2>
            <p className="text-xs text-text-secondary mt-0.5">Define headcount and the roles required for coverage.</p>
          </div>
          <StaffingRequirementsTable roles={roles} onChange={setRoles} />
        </section>

        {/* Notes */}
        <section className={sectionCls}>
          <h2 className="text-sm font-semibold text-text-primary">Notes / briefing</h2>
          <textarea
            id="shift-notes"
            aria-label="Notes / briefing"
            className={`${inputCls} h-24 py-2 resize-none`}
            placeholder="Briefing notes for staff…"
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
        </section>

        {/* Footer */}
        <div className="flex items-center justify-between gap-4 py-2">
          <label className="flex items-center gap-2 text-xs text-text-secondary cursor-pointer select-none">
            <input
              type="checkbox"
              checked={saveAsTemplate}
              onChange={e => setSaveAsTemplate(e.target.checked)}
              className="accent-indigo-action"
            />
            Save as reusable template
          </label>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <Link href="/admin" className="inline-flex items-center justify-center px-4 py-2 text-sm border border-border-rostr text-text-secondary hover:bg-gray-50 transition-colors rounded-lg min-w-[120px]">
              Cancel
            </Link>
            <button type="button" disabled className="px-4 py-2 text-sm border border-border-rostr text-text-secondary opacity-50 cursor-not-allowed rounded-lg text-center min-w-[120px]">
              Save draft
            </button>
            <button
              type="button"
              onClick={handlePublish}
              disabled={isPending || !name || !date || !startTime || !endTime}
              className="px-4 py-2 text-sm bg-indigo-action hover:bg-indigo-hover text-white font-medium disabled:opacity-50 transition-colors rounded-lg text-center min-w-[120px]"
            >
              {isPending ? 'Publishing…' : isEdit ? 'Save changes' : 'Publish shift'}
            </button>
          </div>
        </div>
      </div>

      {/* Right summary panel — stacks below form on narrow screens */}
      <div className="w-full xl:w-72 xl:flex-shrink-0">
        <ShiftSummaryPanel
          name={name}
          date={date}
          startTime={startTime}
          endTime={endTime}
          storeName={selectedLoc?.storeName ?? ''}
          storeAddress={selectedLoc?.address ?? ''}
          retailer={selectedLoc?.retailer ?? ''}
          storeState={selectedLoc?.state ?? ''}
          storeCountry={selectedLoc?.country ?? ''}
          equipment={equipment}
          roles={roles}
        />
      </div>
    </div>
  )
}
