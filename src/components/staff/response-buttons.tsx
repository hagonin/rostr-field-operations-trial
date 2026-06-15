'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { respondToShift } from '@/lib/data/actions'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface Props {
  assignmentId: string
  shiftId: string
}

export function ResponseButtons({ assignmentId, shiftId: _ }: Props) {
  const [isPending, startTransition] = useTransition()
  const [pendingAction, setPendingAction] = useState<'accepted' | 'declined' | null>(null)
  const router = useRouter()

  function respond(response: 'accepted' | 'declined') {
    setPendingAction(response)
    startTransition(async () => {
      await respondToShift(assignmentId, response)
      setPendingAction(null)
      toast(response === 'accepted' ? 'Shift accepted!' : 'Shift declined.')
      router.refresh()
    })
  }

  const isAcceptPending  = isPending && pendingAction === 'accepted'
  const isDeclinePending = isPending && pendingAction === 'declined'

  return (
    <div className="flex gap-3">
      <AlertDialog>
        <AlertDialogTrigger
          disabled={isPending}
          className="flex-1 min-h-[52px] text-sm font-medium border border-red-400 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 rounded-lg"
        >
          {isDeclinePending ? 'Declining…' : 'Decline'}
        </AlertDialogTrigger>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Decline this shift?</AlertDialogTitle>
            <AlertDialogDescription>
              This notifies operations you&apos;re unavailable.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => respond('declined')}>Confirm decline</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <button
        onClick={() => respond('accepted')}
        disabled={isPending}
        className="flex-1 min-h-[52px] text-sm font-semibold bg-green-600 hover:bg-green-700 text-white transition-colors disabled:opacity-50 rounded-lg"
      >
        {isAcceptPending ? 'Confirming…' : 'Accept shift'}
      </button>
    </div>
  )
}
