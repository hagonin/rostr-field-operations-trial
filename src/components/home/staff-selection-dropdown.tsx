'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Search, ChevronRight } from 'lucide-react'
import { setCurrentStaff } from '@/lib/data/actions'
import type { Staff } from '@/lib/domain/types'

const AVATAR_COLORS = [
  'bg-indigo-600', 'bg-blue-600', 'bg-teal-600', 'bg-violet-600',
  'bg-rose-600', 'bg-orange-600', 'bg-emerald-600', 'bg-cyan-600',
]

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

interface StaffSelectionDropdownProps {
  staff: Staff[]
  pendingByStaff: Record<string, number>
}

export function StaffSelectionDropdown({ staff, pendingByStaff }: StaffSelectionDropdownProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const filtered = staff.filter(s =>
    s.fullName.toLowerCase().includes(search.toLowerCase()) ||
    (s.email ?? '').toLowerCase().includes(search.toLowerCase())
  )

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Focus search input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => searchRef.current?.focus(), 50)
    } else {
      setSearch('')
    }
  }, [open])

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-border-rostr bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-medium text-text-secondary">Choose your name…</span>
        <ChevronDown className={`w-4 h-4 text-text-secondary transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="mt-2 bg-white border border-border-rostr rounded-xl overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-border-rostr">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search by name or email…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === 'Escape' && setOpen(false)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-border-rostr rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-action/30 focus:border-indigo-action"
              />
            </div>
          </div>

          {/* Scrollable staff list */}
          <div className="max-h-48 overflow-y-auto divide-y divide-border-rostr">
            {filtered.length > 0 ? (
              filtered.map((person, idx) => {
                const pending = pendingByStaff[person.id] ?? 0
                const avatarBg = AVATAR_COLORS[idx % AVATAR_COLORS.length]
                return (
                  <form key={person.id} action={setCurrentStaff.bind(null, person.id)}>
                    <button
                      type="submit"
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className={`w-9 h-9 rounded-full ${avatarBg} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
                        {initials(person.fullName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">{person.fullName}</p>
                        {pending > 0 ? (
                          <p className="text-xs text-amber-600">{pending} invite{pending !== 1 ? 's' : ''} pending</p>
                        ) : (
                          <p className="text-xs text-green-600">All caught up</p>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-text-secondary flex-shrink-0" />
                    </button>
                  </form>
                )
              })
            ) : (
              <div className="px-4 py-8 text-center text-sm text-text-secondary">
                No staff found for &ldquo;{search}&rdquo;
              </div>
            )}
          </div>

          {/* Footer count */}
          <div className="px-4 py-2 bg-gray-50 border-t border-border-rostr">
            <p className="text-xs text-text-secondary">
              {filtered.length} of {staff.length} staff member{staff.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
