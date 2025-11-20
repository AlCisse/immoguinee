import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HeartIcon } from '@heroicons/react/24/outline'
import PropertyCard from '../components/PropertyCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { favoriteService } from '../services/api'
import toast from 'react-hot-toast'

function Favorites() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFavorites()
  }, [])

  const loadFavorites = async () => {
    try {
      const response = await favoriteService.getAll()
      setFavorites(response.data.favorites || response.data || [])
    } catch (error) {
      console.error('Error loading favorites:', error)
      toast.error('Erreur lors du chargement des favoris')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFavorite = async (propertyId) => {
    try {
      await favoriteService.remove(propertyId)
      setFavorites((prev) => prev.filter((f) => (f.property_id || f.property?.id) !== propertyId))
      toast.success('Retiré des favoris')
    } catch (error) {
      toast.error('Erreur lors de la suppression')
    }
  }

  if (loading) {
    return <LoadingSpinner className="min-h-[60vh]" />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mes favoris</h1>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((favorite) => (
            <PropertyCard
              key={favorite.id}
              property={favorite.property || favorite}
              isFavorite={true}
              onToggleFavorite={() =>
                handleRemoveFavorite(favorite.property_id || favorite.property?.id || favorite.id)
              }
            />
          ))}
        </div>
      ) : (
        <div className="card p-8 text-center">
          <HeartIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Vous n'avez pas encore de favoris</p>
          <Link to="/properties" className="btn-primary">
            Parcourir les propriétés
          </Link>
        </div>
      )}
    </div>
  )
}

export default Favorites
