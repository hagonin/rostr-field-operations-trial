'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, LogOut } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { AppLogo } from '@/components/shared/app-logo'
import { adminLogout } from '@/lib/data/actions'
import { NAV_ITEMS } from '@/components/admin/admin-nav'

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export function AdminMobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="p-2 text-navy-inactive hover:text-white transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          showCloseButton={false}
          className="w-64 p-0 flex flex-col gap-0 bg-navy border-r border-white/10"
        >
          <SheetHeader className="px-4 py-5 border-b border-white/10">
            <SheetTitle className="sr-only">Navigation menu</SheetTitle>
            <AppLogo variant="light" />
          </SheetHeader>

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
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-navy-inactive hover:bg-navy-hover hover:text-white transition-colors"
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="px-3 py-4 border-t border-white/10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-sand flex items-center justify-center text-xs font-bold text-navy flex-shrink-0">
              {initials('Maya Chen')}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate">Maya Chen</p>
              <p className="text-xs text-navy-inactive truncate">Operations admin</p>
            </div>
            <form action={adminLogout}>
              <button type="submit" aria-label="Sign out" title="Sign out" className="text-navy-inactive hover:text-white transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
