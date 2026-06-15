'use client'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export function PasscodeInput() {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        name="passcode"
        placeholder="Passcode"
        autoFocus
        autoComplete="current-password"
        className="w-full px-4 py-3 pr-10 rounded-lg border border-border-rostr text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-indigo-action/30 focus:border-indigo-action transition-colors"
      />
      <button
        type="button"
        aria-label={show ? 'Hide passcode' : 'Show passcode'}
        onClick={() => setShow(v => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  )
}
