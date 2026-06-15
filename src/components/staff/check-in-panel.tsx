'use client'
import { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

export function CheckInPanel() {
  const [checkedIn, setCheckedIn] = useState(false)
  const [checkInTime, setCheckInTime] = useState('')

  function handleCheckIn() {
    const time = new Date().toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit', hour12: true })
    setCheckInTime(time)
    setCheckedIn(true)
    toast.success('Checked in — location confirmed.')
  }

  function handleReportIssue() {
    toast('Issue reported. Operations team has been notified.')
  }

  return (
    <div className="bg-white border border-border-rostr p-5 space-y-4 rounded-lg">
      <div>
        <h2 className="text-sm font-semibold text-text-primary">Ready to start your shift?</h2>
        <p className="text-xs text-text-secondary mt-1 leading-relaxed">
          Check-in records your current location once to confirm you are on site. Your location is not tracked after check-in.
        </p>
      </div>

      {!checkedIn ? (
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleReportIssue}
            className="flex-1 py-3 text-sm border border-amber-300 text-amber-600 hover:bg-amber-50 font-medium transition-colors rounded-lg"
          >
            Report issue
          </button>
          <button
            onClick={handleCheckIn}
            className="flex-1 py-3 text-sm bg-indigo-action hover:bg-indigo-hover text-white font-medium transition-colors rounded-lg"
          >
            Check in at store
          </button>
        </div>
      ) : (
        <div className="flex items-start gap-2 text-xs text-green-700 bg-green-50 border border-green-200 px-3 py-2.5 rounded-lg">
          <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>
            After check-in: Checked in at {checkInTime} · location confirmed for this check-in only.
          </span>
        </div>
      )}
    </div>
  )
}
