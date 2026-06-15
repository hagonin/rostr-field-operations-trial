'use client'
import { useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { respondToShift } from '@/lib/data/actions'

interface Props {
  assignmentId: string
  shiftId: string
}

export function InvitationActions({ assignmentId, shiftId }: Props) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function respond(response: 'accepted' | 'declined') {
    startTransition(async () => {
      await respondToShift(assignmentId, response)
      toast(response === 'accepted' ? 'Shift accepted!' : 'Shift declined.')
      router.refresh()
    })
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      <Link
        href={`/staff/shifts/${shiftId}`}
        className="flex items-center justify-center py-3 text-sm font-medium bg-indigo-subtle text-indigo-action hover:opacity-90 transition-opacity min-h-[48px] rounded-lg"
      >
        View shift details
      </Link>
      <button
        onClick={() => respond('declined')}
        disabled={isPending}
        className="py-3 text-sm font-medium border border-red-400 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 min-h-[48px] rounded-lg"
      >
        Decline
      </button>
      <button
        onClick={() => respond('accepted')}
        disabled={isPending}
        className="py-3 text-sm font-medium bg-green-600 hover:bg-green-700 text-white transition-colors disabled:opacity-50 min-h-[48px] rounded-lg"
      >
        Accept shift
      </button>
    </div>
  )
}
