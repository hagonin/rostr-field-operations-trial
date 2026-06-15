import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { getShift, getCampaigns, getLocations } from '@/lib/data/repository'
import { ShiftForm } from '@/components/admin/shift-form'

interface Props { params: Promise<{ id: string }> }

export default async function EditShiftPage({ params }: Props) {
  const { id } = await params
  const [shift, campaigns, locations] = await Promise.all([
    getShift(id).catch(() => null),
    getCampaigns().catch(() => []),
    getLocations().catch(() => []),
  ])
  if (!shift) notFound()

  const displayTitle = shift.name ?? 'Edit shift'

  return (
    <div className="p-6 space-y-5">
      <nav className="flex items-center gap-1.5 text-xs text-text-secondary">
        <Link href="/admin" className="hover:text-text-primary">All shifts</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href={`/admin/shifts/${id}`} className="hover:text-text-primary">{displayTitle}</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-text-primary">Edit</span>
      </nav>

      <div>
        <h1 className="text-2xl font-bold text-text-primary">Edit shift</h1>
        <p className="text-sm text-text-secondary mt-0.5">{displayTitle}</p>
      </div>

      <ShiftForm campaigns={campaigns} locations={locations} editShift={shift} />
    </div>
  )
}
