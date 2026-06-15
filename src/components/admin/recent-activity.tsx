import type { ActivityEvent } from '@/lib/domain/types'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface RecentActivityProps {
  events: ActivityEvent[]
  className?: string
}

function actorInitials(actor: string): string {
  if (actor === 'System') return '⚙'
  return actor.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export function RecentActivity({ events, className = '' }: RecentActivityProps) {
  return (
    <div className={`bg-white border border-border-rostr rounded-lg flex flex-col overflow-hidden ${className}`}>
      <div className="p-4 border-b border-border-rostr shrink-0">
        <h3 className="text-sm font-semibold text-text-primary">Recent activity</h3>
      </div>

      <div className="p-4 overflow-y-auto flex-1 min-h-0">
        {events.length === 0 ? (
          <p className="text-xs text-text-secondary">No recent activity.</p>
        ) : (
          <div className="space-y-4">
            {events.map((event, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-sand flex items-center justify-center text-[10px] font-semibold text-navy flex-shrink-0 mt-0.5">
                  {actorInitials(event.actor)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-text-primary leading-snug">
                    <span className="font-medium">{event.actor}</span>
                    {' '}{event.message}
                  </p>
                  <p className="text-[11px] text-text-secondary mt-0.5">{event.relativeTime}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-3 border-t border-border-rostr shrink-0 bg-white">
        <Link 
          href="/admin/activity" 
          className="w-full flex items-center justify-center gap-1.5 text-xs font-medium text-navy hover:text-navy/80 transition-colors py-1.5"
        >
          Show more activity
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}
