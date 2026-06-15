'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown, MoreHorizontal, Plus, Pencil } from 'lucide-react'

export function ShiftActionsMenu({ shiftId }: { shiftId: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 px-3 py-2 bg-indigo-action hover:bg-indigo-hover text-white text-sm font-medium transition-colors rounded-lg"
      >
        <MoreHorizontal className="w-3.5 h-3.5" />
        Shift actions
        <ChevronDown className="w-3.5 h-3.5" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-border-rostr shadow-md z-20 rounded-lg overflow-hidden">
          <Link
            href="/admin/shifts/new"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-primary hover:bg-gray-50"
          >
            <Plus className="w-3.5 h-3.5 text-text-secondary" />
            Create new shift
          </Link>
          <Link
            href={`/admin/shifts/${shiftId}/edit`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-primary hover:bg-indigo-50"
          >
            <Pencil className="w-3.5 h-3.5 text-text-secondary" />
            Edit shift
          </Link>
        </div>
      )}
    </div>
  )
}
