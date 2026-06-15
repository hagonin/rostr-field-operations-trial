import { Skeleton } from '@/components/ui/skeleton'

export default function ShiftDetailLoading() {
  return (
    <div className="p-6 space-y-5">
      <Skeleton className="h-4 w-40" />

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-72" />
            <Skeleton className="h-6 w-28 rounded-full" />
          </div>
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-9 w-36 rounded-lg" />
      </div>

      <div className="border border-border-rostr rounded-lg overflow-hidden flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-border-rostr">
        {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="flex-1 h-20" />)}
      </div>

      <div className="flex gap-1 border-b border-border-rostr pb-0">
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-9 w-28 rounded-none" />)}
      </div>

      <div className="flex gap-5 items-start">
        <Skeleton className="flex-1 h-64 rounded-lg" />
        <Skeleton className="w-72 flex-shrink-0 h-56 rounded-lg" />
      </div>
    </div>
  )
}
