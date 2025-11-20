import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FunnelIcon, Squares2X2Icon, ListBulletIcon } from '@heroicons/react/24/outline'
import PropertyCard from '../components/PropertyCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { propertyService, favoriteService, locationService } from '../services/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

function Properties() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState([])
  const [cities, setCities] = useState([])
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [pagination, setPagination] = useState({ current: 1, total: 1 })
  const { isAuthenticated } = useAuth()

  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    city: searchParams.get('city') || '',
    transaction_type: searchParams.get('transaction_type') || '',
    property_type: searchParams.get('property_type') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    min_surface: searchParams.get('min_surface') || '',
    max_surface: searchParams.get('max_surface') || '',
    bedrooms: searchParams.get('bedrooms') || '',
  })

  useEffect(() => {
    loadCities()
  }, [])

  useEffect(() => {
    loadProperties()
  }, [searchParams, isAuthenticated])

  const loadCities = async () => {
    try {
      const response = await locationService.getCities()
      setCities(response.data.cities || response.data || [])
    } catch (error) {
      console.error('Error loading cities:', error)
    }
  }

  const loadProperties = async () => {
    setLoading(true)
    try {
      const params = Object.fromEntries(searchParams.entries())
      const [propertiesRes, favoritesRes] = await Promise.all([
        propertyService.search(params),
        isAuthenticated ? favoriteService.getAll() : Promise.resolve({ data: [] }),
      ])

      setProperties(propertiesRes.data.properties || propertiesRes.data.data || [])
      setPagination({
        current: propertiesRes.data.current_page || 1,
        total: propertiesRes.data.last_page || 1,
      })

      const favIds = (favoritesRes.data.favorites || favoritesRes.data || []).map(
        (f) => f.property_id || f.id
      )
      setFavorites(favIds)
    } catch (error) {
      console.error('Error loading properties:', error)
      toast.error('Erreur lors du chargement des propriétés')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const applyFilters = () => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })
    setSearchParams(params)
    setShowFilters(false)
  }

  const clearFilters = () => {
    setFilters({
      keyword: '',
      city: '',
      transaction_type: '',
      property_type: '',
      min_price: '',
      max_price: '',
      min_surface: '',
      max_surface: '',
      bedrooms: '',
    })
    setSearchParams({})
  }

  const handleToggleFavorite = async (propertyId) => {
    if (!isAuthenticated) {
      toast.error('Connectez-vous pour ajouter aux favoris')
      return
    }

    try {
      if (favorites.includes(propertyId)) {
        await favoriteService.remove(propertyId)
        setFavorites((prev) => prev.filter((id) => id !== propertyId))
        toast.success('Retiré des favoris')
      } else {
        await favoriteService.add(propertyId)
        setFavorites((prev) => [...prev, propertyId])
        toast.success('Ajouté aux favoris')
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour des favoris')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Propriétés</h1>
          <p className="text-gray-600">
            {properties.length} résultat{properties.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-outline flex items-center"
          >
            <FunnelIcon className="w-5 h-5 mr-2" />
            Filtres
          </button>
          <div className="flex border rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
            >
              <Squares2X2Icon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
            >
              <ListBulletIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Filtres */}
      {showFilters && (
        <div className="card p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mot-clé
              </label>
              <input
                type="text"
                name="keyword"
                value={filters.keyword}
                onChange={handleFilterChange}
                className="input"
                placeholder="Rechercher..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transaction
              </label>
              <select
                name="transaction_type"
                value={filters.transaction_type}
                onChange={handleFilterChange}
                className="input"
              >
                <option value="">Tous</option>
                <option value="sale">Achat</option>
                <option value="rent">Location</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ville
              </label>
              <select
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                className="input"
              >
                <option value="">Toutes</option>
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type de bien
              </label>
              <select
                name="property_type"
                value={filters.property_type}
                onChange={handleFilterChange}
                className="input"
              >
                <option value="">Tous</option>
                <option value="house">Maison</option>
                <option value="apartment">Appartement</option>
                <option value="land">Terrain</option>
                <option value="commercial">Commercial</option>
                <option value="office">Bureau</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prix min (GNF)
              </label>
              <input
                type="number"
                name="min_price"
                value={filters.min_price}
                onChange={handleFilterChange}
                className="input"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prix max (GNF)
              </label>
              <input
                type="number"
                name="max_price"
                value={filters.max_price}
                onChange={handleFilterChange}
                className="input"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chambres
              </label>
              <select
                name="bedrooms"
                value={filters.bedrooms}
                onChange={handleFilterChange}
                className="input"
              >
                <option value="">Tous</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-4">
            <button onClick={clearFilters} className="btn-outline">
              Réinitialiser
            </button>
            <button onClick={applyFilters} className="btn-primary">
              Appliquer
            </button>
          </div>
        </div>
      )}

      {/* Liste des propriétés */}
      {loading ? (
        <LoadingSpinner className="py-12" />
      ) : properties.length > 0 ? (
        <>
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                isFavorite={favorites.includes(property.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.total > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex gap-2">
                {Array.from({ length: pagination.total }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => {
                      const params = new URLSearchParams(searchParams)
                      params.set('page', page)
                      setSearchParams(params)
                    }}
                    className={`px-4 py-2 rounded-lg ${
                      page === pagination.current
                        ? 'bg-primary-600 text-white'
                        : 'bg-white border hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Aucune propriété trouvée</p>
          <button onClick={clearFilters} className="btn-outline mt-4">
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
  )
}

export default Properties
