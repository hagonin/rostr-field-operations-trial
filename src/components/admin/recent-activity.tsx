import type { ActivityEvent } from '@/lib/domain/types'

interface RecentActivityProps {
  events: ActivityEvent[]
}

function actorInitials(actor: string): string {
  if (actor === 'System') return '⚙'
  return actor.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export function RecentActivity({ events }: RecentActivityProps) {
  return (
    <div className="bg-white border border-border-rostr p-4 rounded-lg">
      <h3 className="text-sm font-semibold text-text-primary mb-3">Recent activity</h3>

      {events.length === 0 ? (
        <p className="text-xs text-text-secondary">No recent activity.</p>
      ) : (
        <div className="space-y-3">
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
  )
}
