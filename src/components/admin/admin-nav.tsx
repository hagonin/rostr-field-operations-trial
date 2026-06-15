'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Calendar, Users, MapPin, BarChart2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  href: string | null
  icon: LucideIcon
  label: string
  soon?: boolean
  matchExact?: boolean
}

export const NAV_ITEMS: NavItem[] = [
  { href: '/admin',        icon: LayoutDashboard, label: 'Dashboard', matchExact: true },
  { href: '/admin/shifts', icon: Calendar,        label: 'Shifts' },
  { href: null,            icon: Users,           label: 'People',    soon: true },
  { href: null,            icon: MapPin,          label: 'Locations', soon: true },
  { href: null,            icon: BarChart2,       label: 'Reports',   soon: true },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="flex-1 px-2 py-4 space-y-0.5">
      {NAV_ITEMS.map(item => {
        const Icon = item.icon

        if (item.soon) {
          return (
            <div
              key={item.label}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-navy-inactive cursor-not-allowed select-none"
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm flex-1">{item.label}</span>
              <span className="text-[10px] bg-white/10 text-white/40 px-1.5 py-0.5 rounded font-medium tracking-wide">
                Soon
              </span>
            </div>
          )
        }

        const isActive = item.matchExact
          ? pathname === item.href
          : pathname.startsWith(item.href!)

        if (isActive) {
          return (
            <div key={item.label} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-indigo-action text-white">
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium">{item.label}</span>
            </div>
          )
        }

        return (
          <Link
            key={item.label}
            href={item.href!}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-navy-inactive hover:bg-navy-hover hover:text-white transition-colors"
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
