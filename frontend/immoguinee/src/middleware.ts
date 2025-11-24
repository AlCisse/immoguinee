import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes qui nécessitent une authentification
const protectedRoutes = ['/dashboard']

// Routes accessibles uniquement aux non-authentifiés
const authRoutes = ['/auth/login', '/auth/register']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  const pathname = request.nextUrl.pathname

  // Vérifier si la route est protégée
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  // Créer une réponse avec headers de debug
  const response = NextResponse.next()

  // Ajouter des headers de debug (visibles dans Chrome DevTools)
  response.headers.set('X-Middleware-Executed', 'true')
  response.headers.set('X-Has-Token', token ? 'yes' : 'no')
  response.headers.set('X-Token-Preview', token ? token.substring(0, 20) : 'none')
  response.headers.set('X-Is-Protected', isProtectedRoute.toString())
  response.headers.set('X-Is-Auth-Route', isAuthRoute.toString())
  response.headers.set('X-All-Cookies', request.cookies.getAll().map(c => c.name).join(','))

  // Rediriger vers login si pas authentifié et route protégée
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    const redirectResponse = NextResponse.redirect(loginUrl)
    redirectResponse.headers.set('X-Redirect-Reason', 'no-token-protected-route')
    return redirectResponse
  }

  // Rediriger vers dashboard si authentifié et sur une page d'auth
  if (isAuthRoute && token) {
    const redirectResponse = NextResponse.redirect(new URL('/dashboard', request.url))
    redirectResponse.headers.set('X-Redirect-Reason', 'already-authenticated')
    return redirectResponse
  }

  return response
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
