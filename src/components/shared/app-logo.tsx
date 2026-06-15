import Link from 'next/link'

interface AppLogoProps {
  href?: string
  /** 'light' = white text (for navy bg), 'dark' = dark text (for light bg) */
  variant?: 'light' | 'dark'
}

export function AppLogo({ href = '/', variant = 'dark' }: AppLogoProps) {
  return (
    <Link href={href} className="flex items-center gap-2 select-none">
      <div className="w-8 h-8 rounded-lg bg-indigo-action flex items-center justify-center text-white font-bold text-sm">
        R
      </div>
      <span className={`text-lg font-semibold tracking-tight ${variant === 'light' ? 'text-white' : 'text-text-primary'}`}>
        Rostr
      </span>
    </Link>
  )
}
