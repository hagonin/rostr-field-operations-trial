import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

// Sets --font-sans CSS var → picked up by @theme inline { --font-sans: var(--font-sans) }
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'Rostr · Sydney Operations',
  description: 'Field-staff rostering for D2C retail marketing campaigns.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-page text-text-primary">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
