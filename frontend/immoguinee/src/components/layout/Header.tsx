'use client'

import Link from 'next/link'
import { Menu, User } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left section - Menu + Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <Link href="/" className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-cyan-500 to-teal-400 px-3 py-1 rounded-md">
                <span className="text-white font-bold text-xl">Immo</span>
              </div>
              <span className="font-semibold text-xl hidden sm:inline">
                Guinée24
              </span>
            </Link>
          </div>

          {/* Center section - Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/properties"
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Recherche
            </Link>
            <Link
              href="/proprietaires"
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Propriétaires
            </Link>
          </nav>

          {/* Right section - Actions */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Button
                  variant="outline"
                  className="hidden sm:inline-flex bg-gray-900 text-white hover:bg-gray-800 border-0"
                  asChild
                >
                  <Link href="/dashboard">
                    Tableau de bord
                  </Link>
                </Button>

                <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-md">
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-700">{user?.name}</span>
                </div>

                <Button
                  variant="ghost"
                  onClick={() => logout()}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="hidden sm:inline-flex bg-gray-900 text-white hover:bg-gray-800 border-0"
                  asChild
                >
                  <Link href="/properties/create">
                    Insérer annonce
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="hidden md:inline-flex"
                  asChild
                >
                  <Link href="/agents">
                    Trouver un agent
                  </Link>
                </Button>

                <Button
                  variant="ghost"
                  className="flex items-center gap-2"
                  asChild
                >
                  <Link href="/auth/login">
                    <User className="w-5 h-5" />
                    <span className="hidden sm:inline">Connexion</span>
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {showMobileMenu && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link
              href="/properties"
              className="text-gray-700 hover:text-gray-900 font-medium"
              onClick={() => setShowMobileMenu(false)}
            >
              Recherche
            </Link>
            <Link
              href="/proprietaires"
              className="text-gray-700 hover:text-gray-900 font-medium"
              onClick={() => setShowMobileMenu(false)}
            >
              Propriétaires
            </Link>
            {!isAuthenticated && (
              <>
                <Link
                  href="/properties/create"
                  className="text-gray-700 hover:text-gray-900 font-medium"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Insérer annonce
                </Link>
                <Link
                  href="/agents"
                  className="text-gray-700 hover:text-gray-900 font-medium"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Trouver un agent
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
