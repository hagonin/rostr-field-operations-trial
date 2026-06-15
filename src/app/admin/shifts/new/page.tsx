import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { getCampaigns, getLocations } from '@/lib/data/repository'
import { ShiftForm } from '@/components/admin/shift-form'
import { UseTemplateButton } from './use-template-button'

export default async function CreateShiftPage() {
  const [campaigns, locations] = await Promise.all([
    getCampaigns().catch(() => []),
    getLocations().catch(() => []),
  ])

  return (
    <div className="p-6 space-y-5">
      <nav className="flex items-center gap-1.5 text-xs text-text-secondary">
        <Link href="/admin" className="hover:text-text-primary">All shifts</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-text-primary">Create shift</span>
      </nav>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Create shift</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Set the schedule, staffing requirements, and publishing options.
          </p>
        </div>
        <UseTemplateButton />
      </div>

      <ShiftForm campaigns={campaigns} locations={locations} />
    </div>
  )
}
