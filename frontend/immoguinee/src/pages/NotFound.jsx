import { Link } from 'react-router-dom'
import { HomeIcon } from '@heroicons/react/24/outline'

function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-600">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 mt-4">
          Page non trouvée
        </h2>
        <p className="text-gray-600 mt-2 mb-8">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <Link to="/" className="btn-primary inline-flex items-center">
          <HomeIcon className="w-5 h-5 mr-2" />
          Retour à l'accueil
        </Link>
      </div>
    </div>
  )
}

export default NotFound
