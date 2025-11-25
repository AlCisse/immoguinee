'use client'

import React, { useState, useEffect } from 'react'
import Header from '@/components/layout/Header'
import { AdvancedSearchBar } from '@/components/search/AdvancedSearchBar'
import { PropertyGrid } from '@/components/properties/PropertyGrid'
import { PropertyMapView } from '@/components/map/PropertyMapView'
import { Property } from '@/types'
import { propertyService } from '@/services/property.service'
import { Map, Grid3x3, ChevronLeft, ChevronRight } from 'lucide-react'

export default function ModernPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid')
  const [showMap, setShowMap] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const [favoritedIds, setFavoritedIds] = useState<number[]>([])
  const [filters, setFilters] = useState({
    location: '',
    propertyType: '',
    area: '',
    rooms: ''
  })

  // Fetch properties
  useEffect(() => {
    fetchProperties()
  }, [currentPage, filters])

  const fetchProperties = async () => {
    try {
      setIsLoading(true)

      // Convert filters to API format
      const apiFilters: any = {
        page: currentPage,
        per_page: 12
      }

      if (filters.location) apiFilters.city = filters.location
      if (filters.propertyType) apiFilters.property_type = filters.propertyType
      if (filters.rooms) apiFilters.rooms = parseInt(filters.rooms)

      // Parse area range
      if (filters.area) {
        const [min, max] = filters.area.split('-')
        if (min) apiFilters.min_area = parseInt(min)
        if (max && max !== '+') apiFilters.max_area = parseInt(max)
      }

      const response = await propertyService.getProperties(apiFilters)

      setProperties(response.data)
      setTotalResults(response.total || response.data.length)
      setTotalPages(response.last_page || 1)
    } catch (error) {
      console.error('Error fetching properties:', error)
      setProperties([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (newFilters: typeof filters) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const handleFavorite = (id: number) => {
    setFavoritedIds((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    )
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Identify new properties (created in last 7 days)
  const newPropertyIds = properties
    .filter((p) => {
      const createdAt = new Date(p.created_at)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return createdAt > weekAgo
    })
    .map((p) => p.id)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Search Bar */}
      <AdvancedSearchBar onSearch={handleSearch} initialFilters={filters} />

      {/* Results Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Results Count */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {totalResults} {totalResults === 1 ? 'propriété trouvée' : 'propriétés trouvées'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {filters.location && `à ${filters.location}`}
              {filters.propertyType && ` " ${filters.propertyType}`}
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setViewMode('grid')
                setShowMap(true)
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Grid3x3 className="w-5 h-5" />
              <span>Grille</span>
            </button>
            <button
              onClick={() => {
                setViewMode('map')
                setShowMap(true)
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'map'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Map className="w-5 h-5" />
              <span>Carte</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 pb-8">
        {viewMode === 'grid' ? (
          <div className="flex gap-6">
            {/* Properties Grid - Left Side */}
            <div className={`flex-1 ${showMap ? 'lg:w-2/3' : 'w-full'}`}>
              <PropertyGrid
                properties={properties}
                isLoading={isLoading}
                onFavorite={handleFavorite}
                favoritedIds={favoritedIds}
                newPropertyIds={newPropertyIds}
              />

              {/* Pagination */}
              {!isLoading && totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let pageNum
                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }

                      return (
                        <button
                          key={i}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-10 h-10 rounded-lg transition-colors ${
                            currentPage === pageNum
                              ? 'bg-cyan-500 text-white font-semibold'
                              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Map - Right Side (Desktop) */}
            {showMap && (
              <div className="hidden lg:block lg:w-1/3 sticky top-20 h-[calc(100vh-6rem)]">
                <PropertyMapView
                  properties={properties}
                  className="h-full"
                />
              </div>
            )}
          </div>
        ) : (
          /* Full Map View */
          <div className="h-[calc(100vh-16rem)]">
            <PropertyMapView
              properties={properties}
              className="h-full"
            />
          </div>
        )}
      </div>
    </div>
  )
}
