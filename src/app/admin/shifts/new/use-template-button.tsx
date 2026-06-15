'use client'
import { LayoutTemplate } from 'lucide-react'
import { toast } from 'sonner'

export function UseTemplateButton() {
  return (
    <button
      onClick={() => toast('Templates coming soon')}
      className="flex items-center gap-1.5 text-xs text-indigo-action hover:text-indigo-hover font-medium mt-1 transition-colors"
    >
      <LayoutTemplate className="w-3.5 h-3.5" />
      Use template
    </button>
  )
}
