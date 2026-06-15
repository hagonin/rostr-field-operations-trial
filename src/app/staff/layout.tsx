import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Users } from 'lucide-react'
import { AppLogo } from '@/components/shared/app-logo'
import { getStaffById } from '@/lib/data/repository'
import { switchUser } from '@/lib/data/actions'

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export default async function StaffLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const staffId = cookieStore.get('currentStaffId')?.value
  if (!staffId) redirect('/')

  const staff = await getStaffById(staffId).catch(() => null)
  if (!staff) redirect('/')

  return (
    <div className="min-h-screen bg-page flex flex-col">
      <header className="bg-navy px-5 py-3 flex items-center justify-between flex-shrink-0">
        <AppLogo variant="light" />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-indigo-action flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              {initials(staff.fullName)}
            </div>
            <div>
              <p className="text-sm font-medium text-white leading-tight">{staff.fullName}</p>
              <p className="text-[11px] text-white/60 leading-tight">{staff.roleTitle ?? 'Field staff'}</p>
            </div>
          </div>
          <form action={switchUser}>
            <button
              type="submit"
              className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white border border-white/20 hover:border-white/40 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Users className="w-3.5 h-3.5" />
              Switch user
            </button>
          </form>
        </div>
      </header>
      <main className="flex-1 pb-[env(safe-area-inset-bottom)]">{children}</main>
    </div>
  )
}
