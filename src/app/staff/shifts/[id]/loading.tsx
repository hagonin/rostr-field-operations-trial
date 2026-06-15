import { Skeleton } from '@/components/ui/skeleton'

export default function StaffShiftDetailLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      <Skeleton className="h-4 w-24" />

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="h-7 w-24 rounded-full" />
      </div>

      <Skeleton className="h-36 rounded-lg" />
      <Skeleton className="h-28 rounded-lg" />
      <Skeleton className="h-36 rounded-lg" />
    </div>
  )
}
