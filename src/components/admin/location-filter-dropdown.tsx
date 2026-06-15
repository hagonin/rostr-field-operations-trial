'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronDown, ChevronUp, Map, MapPin, Check, Search } from 'lucide-react'

export interface LocationOption {
  storeName: string
  retailer: string
}

interface Props {
  locations: LocationOption[]
}

export function LocationFilterDropdown({ locations }: Props) {
  const router      = useRouter()
  const params      = useSearchParams()
  const current     = params.get('location') ?? ''
  const [open, setOpen]             = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const ref        = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const listRef    = useRef<HTMLDivElement>(null)
  const searchRef  = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  useEffect(() => {
    if (!open) setSearchQuery('')
  }, [open])

  function select(storeName: string) {
    setOpen(false)
    const next = new URLSearchParams(params.toString())
    if (storeName) next.set('location', storeName)
    else next.delete('location')
    router.replace(`/admin?${next.toString()}`)
    triggerRef.current?.focus()
  }

  function handleWrapperKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      setOpen(false)
      triggerRef.current?.focus()
    }
  }

  function handleSearchKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      setOpen(false)
      triggerRef.current?.focus()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const options = listRef.current?.querySelectorAll<HTMLElement>('[role="option"]')
      options?.[0]?.focus()
    }
  }

  function handleListKeyDown(e: React.KeyboardEvent) {
    const options = listRef.current?.querySelectorAll<HTMLElement>('[role="option"]')
    if (!options || options.length === 0) return
    const currentIdx = [...options].findIndex(el => el === document.activeElement)
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      options[(currentIdx + 1) % options.length]?.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (currentIdx <= 0) {
        searchRef.current?.focus()
      } else {
        options[currentIdx - 1]?.focus()
      }
    }
  }

  const label = current || 'All locations'
  const filteredLocations = locations.filter(loc =>
    loc.storeName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div ref={ref} className="relative" onKeyDown={handleWrapperKeyDown}>
      {/* Trigger */}
      <button
        ref={triggerRef}
        onClick={() => setOpen(v => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex items-center gap-2 px-4 py-2 border text-sm font-medium transition-colors bg-white rounded-lg ${
          open ? 'border-indigo-action text-indigo-action' : 'border-border-rostr text-text-primary hover:border-indigo-action hover:text-indigo-action'
        }`}
      >
        <Map className="w-4 h-4 flex-shrink-0" />
        {label}
        {open
          ? <ChevronUp   className="w-4 h-4 flex-shrink-0" />
          : <ChevronDown className="w-4 h-4 flex-shrink-0" />
        }
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-border-rostr shadow-lg z-30 rounded-lg flex flex-col max-h-72 overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b border-border-rostr bg-gray-50 flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-text-secondary flex-shrink-0" />
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Filter locations..."
              aria-label="Search locations"
              className="w-full bg-transparent text-xs text-text-primary focus:outline-none placeholder:text-text-secondary"
              autoFocus
            />
          </div>

          {/* Options list */}
          <div
            ref={listRef}
            role="listbox"
            aria-label="Locations"
            onKeyDown={handleListKeyDown}
            className="overflow-y-auto py-1 flex-1"
          >
            {(!searchQuery || 'all locations'.includes(searchQuery.toLowerCase())) && (
              <button
                role="option"
                aria-selected={!current}
                onClick={() => select('')}
                className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium transition-colors ${
                  !current
                    ? 'bg-indigo-subtle text-indigo-action'
                    : 'text-text-primary hover:bg-gray-50'
                }`}
              >
                <Map className={`w-4 h-4 flex-shrink-0 ${!current ? 'text-indigo-action' : 'text-text-secondary'}`} />
                <span className="flex-1 text-left">All locations</span>
                {!current && <Check className="w-4 h-4 flex-shrink-0 text-indigo-action" />}
              </button>
            )}

            {filteredLocations.map(loc => {
              const isSelected = current === loc.storeName
              return (
                <button
                  key={loc.storeName}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => select(loc.storeName)}
                  className={`flex items-center gap-3 w-full px-4 py-3 text-sm transition-colors ${
                    isSelected
                      ? 'bg-indigo-subtle text-indigo-action font-medium'
                      : 'text-text-primary hover:bg-gray-50'
                  }`}
                >
                  <MapPin className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-indigo-action' : 'text-text-secondary'}`} />
                  <span className="flex-1 text-left truncate">{loc.storeName}</span>
                  {isSelected && <Check className="w-4 h-4 flex-shrink-0 text-indigo-action" />}
                </button>
              )
            })}

            {filteredLocations.length === 0 && searchQuery && (
              <div className="px-4 py-3 text-xs text-text-secondary text-center">
                No matching locations
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
