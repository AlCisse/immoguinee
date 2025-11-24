import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes qui nécessitent une authentification
const protectedRoutes = ['/dashboard']

// Routes accessibles uniquement aux non-authentifiés
const authRoutes = ['/auth/login', '/auth/register']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  const pathname = request.nextUrl.pathname

  // Debug logs TRÈS visibles
  console.log('='.repeat(80))
  console.log('🔒 MIDDLEWARE EXECUTING:', pathname)
  console.log('🍪 Token from cookie:', token ? `${token.substring(0, 30)}...` : 'NO TOKEN FOUND')
  console.log('🍪 All cookies names:', request.cookies.getAll().map(c => c.name).join(', '))
  console.log('🍪 All cookies:', JSON.stringify(request.cookies.getAll()))
  console.log('='.repeat(80))

  // Vérifier si la route est protégée
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  console.log(`📍 Is protected route? ${isProtectedRoute}`)
  console.log(`📍 Is auth route? ${isAuthRoute}`)

  // Rediriger vers login si pas authentifié et route protégée
  if (isProtectedRoute && !token) {
    console.log('❌❌❌ REDIRECTING TO LOGIN - NO TOKEN FOR PROTECTED ROUTE ❌❌❌')
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Rediriger vers dashboard si authentifié et sur une page d'auth
  if (isAuthRoute && token) {
    console.log('✅✅✅ REDIRECTING TO DASHBOARD - ALREADY AUTHENTICATED ✅✅✅')
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  console.log('✅ ALLOWING REQUEST')
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
