import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { locationService } from '../services/api'

function SearchBar({ variant = 'default' }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [cities, setCities] = useState([])

  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    city: searchParams.get('city') || '',
    transaction_type: searchParams.get('transaction_type') || '',
    property_type: searchParams.get('property_type') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
  })

  useEffect(() => {
    loadCities()
  }, [])

  const loadCities = async () => {
    try {
      const response = await locationService.getCities()
      setCities(response.data.cities || response.data || [])
    } catch (error) {
      console.error('Error loading cities:', error)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })
    navigate(`/properties?${params.toString()}`)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  if (variant === 'hero') {
    return (
      <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-lg p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type de transaction
            </label>
            <select
              name="transaction_type"
              value={filters.transaction_type}
              onChange={handleChange}
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
              onChange={handleChange}
              className="input"
            >
              <option value="">Toutes les villes</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
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
              onChange={handleChange}
              className="input"
            >
              <option value="">Tous les types</option>
              <option value="house">Maison</option>
              <option value="apartment">Appartement</option>
              <option value="land">Terrain</option>
              <option value="commercial">Commercial</option>
              <option value="office">Bureau</option>
            </select>
          </div>

          <div className="flex items-end">
            <button type="submit" className="btn-primary w-full flex items-center justify-center">
              <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
              Rechercher
            </button>
          </div>
        </div>
      </form>
    )
  }

  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <div className="flex-1 relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          name="keyword"
          value={filters.keyword}
          onChange={handleChange}
          placeholder="Rechercher une propriété..."
          className="input pl-10"
        />
      </div>
      <button type="submit" className="btn-primary">
        Rechercher
      </button>
    </form>
  )
}

export default SearchBar
