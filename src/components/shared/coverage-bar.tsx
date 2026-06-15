interface CoverageBarProps {
  accepted: number
  invited?: number
  required: number
  size?: 'sm' | 'md'
}

// Segmented bar: one block per slot — accepted = indigo fill, invited = blue outline, open = gray
export function CoverageBar({ accepted, invited = 0, required, size = 'md' }: CoverageBarProps) {
  if (required === 0) return null
  const h = size === 'sm' ? 'h-1.5' : 'h-2.5'
  return (
    <div className={`flex gap-0.5 ${h}`}>
      {Array.from({ length: required }, (_, i) => {
        const isAccepted = i < accepted
        const isInvited = !isAccepted && i < accepted + invited
        return (
          <div
            key={i}
            className={`flex-1 ${isAccepted ? 'bg-indigo-action' : isInvited ? 'bg-blue-200 border border-blue-400' : 'bg-gray-200'}`}
          />
        )
      })}
    </div>
  )
}
