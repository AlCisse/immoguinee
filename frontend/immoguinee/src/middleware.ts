import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes qui nécessitent une authentification
const protectedRoutes = ['/dashboard']

// Routes accessibles uniquement aux non-authentifiés
const authRoutes = ['/auth/login', '/auth/register']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  const pathname = request.nextUrl.pathname

  // Debug logs
  console.log('🔒 Middleware:', pathname)
  console.log('🍪 Token from cookie:', token ? token.substring(0, 20) + '...' : 'NO TOKEN')
  console.log('🍪 All cookies:', request.cookies.getAll().map(c => c.name))

  // Vérifier si la route est protégée
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  // Rediriger vers login si pas authentifié et route protégée
  if (isProtectedRoute && !token) {
    console.log('❌ Redirecting to login - no token for protected route')
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Rediriger vers dashboard si authentifié et sur une page d'auth
  if (isAuthRoute && token) {
    console.log('✅ Redirecting to dashboard - already authenticated')
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  console.log('✅ Allowing request')
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
