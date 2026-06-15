import { Lock } from 'lucide-react'
import { AppLogo } from '@/components/shared/app-logo'
import { verifyAdminPasscode } from '@/lib/data/actions'
import { PasscodeInput } from '@/components/admin/passcode-input'

interface Props {
  searchParams: Promise<{ error?: string }>
}

export default async function AdminLoginPage({ searchParams }: Props) {
  const { error } = await searchParams

  return (
    <main className="min-h-screen bg-page flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <AppLogo />
        </div>

        <div className="bg-white rounded-2xl border border-border-rostr p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-indigo-subtle flex items-center justify-center flex-shrink-0">
              <Lock className="w-4 h-4 text-indigo-action" />
            </div>
            <div>
              <h1 className="text-base font-bold text-text-primary">Admin access</h1>
              <p className="text-xs text-text-secondary">Enter the operations passcode</p>
            </div>
          </div>

          <form action={verifyAdminPasscode}>
            <div className="space-y-4">
              <PasscodeInput />

              {error && (
                <p role="alert" className="text-xs text-red-600 font-medium">Incorrect passcode. Try again.</p>
              )}

              <button
                type="submit"
                className="w-full bg-indigo-action hover:bg-indigo-hover text-white rounded-lg px-4 py-3 text-sm font-semibold transition-colors"
              >
                Enter operations
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-xs text-text-secondary mt-4">
          Field staff?{' '}
          <a href="/" className="underline hover:text-text-primary transition-colors">
            Go back to role picker
          </a>
        </p>
      </div>
    </main>
  )
}
