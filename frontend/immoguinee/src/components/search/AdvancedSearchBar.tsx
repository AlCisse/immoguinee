'use client'

import React, { useState } from 'react'
import { Search, MapPin, Home, Maximize2, BedDouble, ChevronDown, Bookmark } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SearchFilters {
  location: string
  propertyType: string
  area: string
  rooms: string
}

interface AdvancedSearchBarProps {
  onSearch: (filters: SearchFilters) => void
  initialFilters?: Partial<SearchFilters>
  showAIToggle?: boolean
}

export function AdvancedSearchBar({
  onSearch,
  initialFilters = {},
  showAIToggle = true
}: AdvancedSearchBarProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    location: initialFilters.location || '',
    propertyType: initialFilters.propertyType || '',
    area: initialFilters.area || '',
    rooms: initialFilters.rooms || ''
  })

  const [isAISearch, setIsAISearch] = useState(false)

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
  }

  const handleSearch = () => {
    onSearch(filters)
  }

  const handleSaveSearch = () => {
    // TODO: Implement save search functionality
    console.log('Saving search:', filters)
  }

  return (
    <div className="bg-white border-b border-gray-200 py-4 shadow-sm">
      <div className="container mx-auto px-4">
        {/* Title Section */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Rechercher des biens immobiliers
          </h1>
        </div>

        {/* Search Filters */}
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-end">
          {/* AI Search Toggle */}
          {showAIToggle && (
            <div className="flex items-center gap-2 mb-2 lg:mb-0">
              <span className="text-sm text-gray-600">Recherche AI</span>
              <button
                onClick={() => setIsAISearch(!isAISearch)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isAISearch ? 'bg-cyan-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isAISearch ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="text-xs bg-gray-900 text-white px-2 py-1 rounded">BETA</span>
            </div>
          )}

          {/* Location Filter */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none bg-white cursor-pointer"
              >
                <option value="">Localisation</option>
                <option value="conakry">Conakry</option>
                <option value="kankan">Kankan</option>
                <option value="labe">Labé</option>
                <option value="nzerekore">Nzérékoré</option>
                <option value="kindia">Kindia</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
          </div>

          {/* Property Type Filter */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filters.propertyType}
                onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none bg-white cursor-pointer"
              >
                <option value="">Type de bien</option>
                <option value="apartment">Appartement</option>
                <option value="house">Maison</option>
                <option value="villa">Villa</option>
                <option value="land">Terrain</option>
                <option value="commercial">Commercial</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
          </div>

          {/* Area Filter */}
          <div className="flex-1 min-w-[180px]">
            <div className="relative">
              <Maximize2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filters.area}
                onChange={(e) => handleFilterChange('area', e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none bg-white cursor-pointer"
              >
                <option value="">Surface</option>
                <option value="0-50">0 - 50 m²</option>
                <option value="50-100">50 - 100 m²</option>
                <option value="100-150">100 - 150 m²</option>
                <option value="150-200">150 - 200 m²</option>
                <option value="200+">200+ m²</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
          </div>

          {/* Rooms Filter */}
          <div className="flex-1 min-w-[180px]">
            <div className="relative">
              <BedDouble className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filters.rooms}
                onChange={(e) => handleFilterChange('rooms', e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none bg-white cursor-pointer"
              >
                <option value="">Pièces</option>
                <option value="1">1 pièce</option>
                <option value="2">2 pièces</option>
                <option value="3">3 pièces</option>
                <option value="4">4 pièces</option>
                <option value="5+">5+ pièces</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {/* Save Search Button */}
            <Button
              variant="outline"
              onClick={handleSaveSearch}
              className="flex items-center gap-2 px-4 py-3 whitespace-nowrap"
            >
              <Bookmark className="w-5 h-5" />
              <span className="hidden sm:inline">Sauvegarder</span>
            </Button>

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap"
            >
              <Search className="w-5 h-5" />
              <span>Rechercher</span>
            </Button>
          </div>
        </div>

        {/* Quick Filters or Additional Options */}
        <div className="mt-3 flex flex-wrap gap-2">
          <button className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
            Prix
          </button>
          <button className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
            Plus de filtres
          </button>
          <button className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
            Trier par: Pertinence
          </button>
        </div>
      </div>
    </div>
  )
}
