'use client'

import { useEffect, useState } from 'react'
import { propertyService } from '@/services/property.service'
import { Property } from '@/types'
import PropertyCard from '@/components/properties/PropertyCard'
import PropertyFilters from '@/components/properties/PropertyFilters'
import Button from '@/components/ui/Button'

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState({})

  const fetchProperties = async (page: number = 1, currentFilters = {}) => {
    setLoading(true)
    setError('')
    try {
      const response = await propertyService.getProperties({
        ...currentFilters,
        page,
        per_page: 12,
      })

      // Ensure we always set an array
      if (response && Array.isArray(response.data)) {
        setProperties(response.data)
        setCurrentPage(response.current_page || 1)
        setTotalPages(response.last_page || 1)
      } else {
        console.error('Invalid response structure:', response)
        setProperties([])
        setError('Format de réponse invalide')
      }
    } catch (err: any) {
      console.error('Error fetching properties:', err)
      setProperties([]) // Ensure properties is always an array
      setError('Impossible de charger les propriétés')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties(1, filters)
  }, [filters])

  const handleFilter = (newFilters: any) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    fetchProperties(page, filters)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Toutes les propriétés
        </h1>

        <div className="mb-8">
          <PropertyFilters onFilter={handleFilter} />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : !Array.isArray(properties) || properties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Aucune propriété trouvée</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Précédent
                </Button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={page === currentPage ? 'primary' : 'outline'}
                      onClick={() => handlePageChange(page)}
                      size="sm"
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Suivant
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
