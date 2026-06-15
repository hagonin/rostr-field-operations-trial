import { Skeleton } from '@/components/ui/skeleton'

export default function AdminDashboardLoading() {
  return (
    <div className="p-6 space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-52" />
          <Skeleton className="h-4 w-56" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-32 rounded-lg" />
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {[1, 2, 3].map(i => <Skeleton key={i} className="flex-1 h-24 rounded-lg" />)}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="flex-1 h-16 rounded-lg" />)}
      </div>

      <div className="flex gap-5 items-start">
        <Skeleton className="flex-1 h-72 rounded-lg" />
        <div className="w-80 flex-shrink-0 space-y-4">
          <Skeleton className="h-36 rounded-lg" />
          <Skeleton className="h-36 rounded-lg" />
        </div>
      </div>
    </div>
  )
}
