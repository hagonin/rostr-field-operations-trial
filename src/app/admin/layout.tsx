import type { ReactNode } from 'react'
import { LogOut } from 'lucide-react'
import { AppLogo } from '@/components/shared/app-logo'
import { AdminNav } from '@/components/admin/admin-nav'
import { AdminMobileNav } from '@/components/admin/admin-mobile-nav'
import { adminLogout } from '@/lib/data/actions'

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-page overflow-hidden">
      {/* Navy sidebar — desktop only */}
      <aside className="hidden lg:flex w-56 flex-shrink-0 bg-navy flex-col">
        <div className="px-4 py-5 border-b border-white/10">
          <AppLogo variant="light" />
        </div>

        <AdminNav />

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
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar — visible below lg */}
        <div className="lg:hidden bg-navy px-4 py-3 flex items-center justify-between flex-shrink-0">
          <AppLogo variant="light" />
          <AdminMobileNav />
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-page">
          {children}
        </main>
      </div>
    </div>
  )
}
