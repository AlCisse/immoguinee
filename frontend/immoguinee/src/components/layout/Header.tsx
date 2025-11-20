'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary-600">
          ImmoGuinée
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/properties" className="text-gray-700 hover:text-primary-600">
            Propriétés
          </Link>

          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className="text-gray-700 hover:text-primary-600">
                Tableau de bord
              </Link>
              <span className="text-gray-700">Bonjour, {user?.name}</span>
              <button
                onClick={() => logout()}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-gray-700 hover:text-primary-600"
              >
                Connexion
              </Link>
              <Link
                href="/auth/register"
                className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
              >
                Inscription
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
