import { Skeleton } from '@/components/ui/skeleton'

export default function StaffPageLoading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>

      <Skeleton className="h-4 w-52" />

      <Skeleton className="h-36 rounded-lg" />

      <div className="mt-10 space-y-3">
        <Skeleton className="h-5 w-36" />
        {[1, 2].map(i => <Skeleton key={i} className="h-24 rounded-lg" />)}
      </div>
    </div>
  )
}
