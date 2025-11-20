import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary-600">404</h1>
          <div className="text-6xl">🏠</div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Page introuvable
        </h2>

        <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button size="lg">
              Retour à l'accueil
            </Button>
          </Link>
          <Link href="/properties">
            <Button size="lg" variant="outline">
              Voir les propriétés
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
