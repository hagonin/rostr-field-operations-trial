import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const adminAuth = request.cookies.get('adminAuth')?.value
  if (!adminAuth) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
  return NextResponse.next()
}

// Guard all /admin/* except /admin/login itself
export const config = {
  matcher: ['/admin/((?!login).*)'],
}
