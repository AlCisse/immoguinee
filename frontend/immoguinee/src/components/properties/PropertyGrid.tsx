'use client'

import React from 'react'
import { Property } from '@/types'
import { ModernPropertyCard } from './ModernPropertyCard'
import { Loader2 } from 'lucide-react'

interface PropertyGridProps {
  properties: Property[]
  isLoading?: boolean
  onFavorite?: (id: number) => void
  favoritedIds?: number[]
  newPropertyIds?: number[]
  emptyMessage?: string
}

export function PropertyGrid({
  properties,
  isLoading = false,
  onFavorite,
  favoritedIds = [],
  newPropertyIds = [],
  emptyMessage = 'Aucune propriété trouvée'
}: PropertyGridProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
          <p className="text-gray-600">Chargement des propriétés...</p>
        </div>
      </div>
    )
  }

  if (properties.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="mb-4">
            <svg
              className="w-16 h-16 text-gray-300 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </div>
          <p className="text-xl font-semibold text-gray-700 mb-2">{emptyMessage}</p>
          <p className="text-gray-500">
            Essayez d'ajuster vos filtres de recherche
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <ModernPropertyCard
          key={property.id}
          property={property}
          isNew={newPropertyIds.includes(property.id)}
          isFavorited={favoritedIds.includes(property.id)}
          onFavorite={onFavorite}
        />
      ))}
    </div>
  )
}
