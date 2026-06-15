'use client'
import { useState, useRef, useEffect, useTransition } from 'react'
import { ChevronDown } from 'lucide-react'
import { setAvailability } from '@/lib/data/actions'
import type { AvailabilityStatus } from '@/lib/domain/types'

const OPTIONS: { label: string; value: AvailabilityStatus; dot: string; ring: string }[] = [
  { label: 'Available',   value: 'available',   dot: 'bg-green-500', ring: 'border-green-300 bg-green-50 text-green-700 hover:bg-green-100' },
  { label: 'Maybe',       value: 'maybe',       dot: 'bg-amber-400', ring: 'border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100' },
  { label: 'Unavailable', value: 'unavailable', dot: 'bg-gray-400',  ring: 'border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100' },
]

interface Props {
  staffId: string
  currentStatus: AvailabilityStatus
}

export function AvailabilityDropdown({ staffId, currentStatus }: Props) {
  const [status,  setStatus]  = useState<AvailabilityStatus>(currentStatus)
  const [open,    setOpen]    = useState(false)
  const [pending, startTransition] = useTransition()
  const ref        = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  function select(s: AvailabilityStatus) {
    setOpen(false)
    setStatus(s)
    startTransition(() => setAvailability(staffId, s))
    triggerRef.current?.focus()
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      setOpen(false)
      triggerRef.current?.focus()
      return
    }
    if (!open) return
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      const options = menuRef.current?.querySelectorAll<HTMLElement>('[role="option"]')
      if (!options || options.length === 0) return
      const currentIdx = [...options].findIndex(el => el === document.activeElement)
      const nextIdx = e.key === 'ArrowDown'
        ? (currentIdx + 1) % options.length
        : (currentIdx - 1 + options.length) % options.length
      options[nextIdx]?.focus()
    }
  }

  const current = OPTIONS.find(o => o.value === status) ?? OPTIONS[0]

  return (
    <div ref={ref} className="relative" onKeyDown={handleKeyDown}>
      <button
        ref={triggerRef}
        onClick={() => setOpen(v => !v)}
        disabled={pending}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex items-center gap-2 border px-3 py-1.5 text-sm font-medium transition-colors ${current.ring} rounded-lg`}
      >
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${current.dot}`} />
        {current.label}
        <ChevronDown className="w-3.5 h-3.5" />
      </button>

      {open && (
        <div
          ref={menuRef}
          role="listbox"
          aria-label="Availability status"
          className="absolute right-0 top-full mt-1 w-36 bg-white border border-border-rostr shadow-md z-20 rounded-lg overflow-hidden"
        >
          {OPTIONS.map(o => (
            <button
              key={o.value}
              role="option"
              aria-selected={status === o.value}
              onClick={() => select(o.value)}
              className={`flex items-center gap-2 w-full text-left px-3 py-2.5 text-sm hover:bg-gray-50 transition-colors ${status === o.value ? 'font-semibold text-indigo-action' : 'text-text-primary'}`}
            >
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${o.dot}`} />
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
