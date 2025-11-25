'use client'

import React, { useState } from 'react'
import { Property } from '@/types'
import { MapPin, X, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react'
import { formatPrice } from '@/utils/format'
import Image from 'next/image'
import Link from 'next/link'

interface PropertyMapViewProps {
  properties: Property[]
  onPropertySelect?: (property: Property | null) => void
  className?: string
}

interface MapOverlayProps {
  isOpen: boolean
  onClose: () => void
  onExpand: () => void
}

function MapOverlay({ isOpen, onClose, onExpand }: MapOverlayProps) {
  if (!isOpen) return null

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 z-50 border border-gray-200">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded-full transition-colors"
      >
        <X className="w-5 h-5 text-gray-500" />
      </button>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Recherche sur la carte
        </h3>
        <p className="text-sm text-gray-600">
          Vous vous trouvez en dehors de votre zone de recherche.
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <p className="text-sm text-gray-700 mb-3">
          Souhaitez-vous étendre votre recherche à la zone visible sur la carte?
        </p>
        <button
          onClick={onExpand}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Rechercher dans cette zone
        </button>
      </div>

      <p className="text-xs text-gray-500 text-center">
        Déplacez la carte pour explorer d'autres zones
      </p>
    </div>
  )
}

export function PropertyMapView({
  properties,
  onPropertySelect,
  className = ''
}: PropertyMapViewProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [showOverlay, setShowOverlay] = useState(false)
  const [mapCenter] = useState({ lat: 9.6412, lng: -13.5784 }) // Conakry coordinates

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property)
    onPropertySelect?.(property)
  }

  const handleExpandSearch = () => {
    setShowOverlay(false)
    // TODO: Implement expand search logic
    console.log('Expanding search to visible map area')
  }

  // Mock map markers based on properties with coordinates
  const propertiesWithCoords = properties.filter(
    (p) => p.latitude && p.longitude
  )

  return (
    <div className={`relative bg-gray-100 rounded-lg overflow-hidden ${className}`}>
      {/* Map Header Controls */}
      <div className="absolute top-4 left-4 z-40 flex flex-col gap-2">
        <button className="bg-white hover:bg-gray-50 p-2 rounded-lg shadow-md transition-colors">
          <MapPin className="w-5 h-5 text-gray-700" />
        </button>
        <button className="bg-white hover:bg-gray-50 p-2 rounded-lg shadow-md transition-colors">
          <Maximize2 className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Map Controls - Zoom */}
      <div className="absolute top-4 right-4 z-40 flex flex-col gap-2">
        <button className="bg-white hover:bg-gray-50 w-10 h-10 rounded-lg shadow-md transition-colors flex items-center justify-center font-bold text-xl text-gray-700">
          +
        </button>
        <button className="bg-white hover:bg-gray-50 w-10 h-10 rounded-lg shadow-md transition-colors flex items-center justify-center font-bold text-xl text-gray-700">
          
        </button>
      </div>

      {/* Map Overlay Dialog */}
      <MapOverlay
        isOpen={showOverlay}
        onClose={() => setShowOverlay(false)}
        onExpand={handleExpandSearch}
      />

      {/* Map Placeholder - Replace with actual map library (Google Maps, Mapbox, Leaflet) */}
      <div
        className="w-full h-full bg-gradient-to-br from-green-50 to-blue-50 relative"
        style={{ minHeight: '600px' }}
      >
        {/* Map Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="gray"
                strokeWidth="0.5"
              />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Property Markers */}
        <div className="absolute inset-0">
          {propertiesWithCoords.map((property, index) => {
            // Mock positioning - in real implementation, use map library's projection
            const left = 20 + (index % 5) * 15
            const top = 20 + Math.floor(index / 5) * 15

            return (
              <button
                key={property.id}
                onClick={() => handlePropertyClick(property)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                style={{ left: `${left}%`, top: `${top}%` }}
              >
                {/* Marker Pin */}
                <div className="relative">
                  <div
                    className={`w-12 h-12 rounded-full shadow-lg transition-all group-hover:scale-110 ${
                      selectedProperty?.id === property.id
                        ? 'bg-cyan-600 ring-4 ring-cyan-200'
                        : 'bg-white ring-2 ring-gray-300'
                    }`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span
                        className={`text-sm font-bold ${
                          selectedProperty?.id === property.id
                            ? 'text-white'
                            : 'text-gray-700'
                        }`}
                      >
                        {formatPrice(property.price, true)}
                      </span>
                    </div>
                  </div>
                  {/* Marker Tail */}
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent ${
                      selectedProperty?.id === property.id
                        ? 'border-t-cyan-600'
                        : 'border-t-white'
                    }`}
                  />
                </div>
              </button>
            )
          })}
        </div>

        {/* Selected Property Card */}
        {selectedProperty && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-xl max-w-sm w-full mx-4 overflow-hidden z-50">
            <Link href={`/properties/${selectedProperty.id}`}>
              <div className="relative h-48 bg-gray-100">
                <Image
                  src={
                    selectedProperty.images[0]?.url ||
                    '/placeholder-property.jpg'
                  }
                  alt={selectedProperty.title}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    setSelectedProperty(null)
                  }}
                  className="absolute top-2 right-2 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-colors"
                >
                  <X className="w-4 h-4 text-gray-700" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                  {selectedProperty.title}
                </h3>
                <p className="text-2xl font-bold text-cyan-600 mb-2">
                  {formatPrice(selectedProperty.price)}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{selectedProperty.area} m²</span>
                  {selectedProperty.rooms && (
                    <>
                      <span>"</span>
                      <span>{selectedProperty.rooms} ch.</span>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {selectedProperty.city}, {selectedProperty.region}
                </p>
              </div>
            </Link>
          </div>
        )}

        {/* Map Info Badge */}
        <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-lg shadow-md z-40">
          <p className="text-sm font-medium text-gray-900">
            {propertiesWithCoords.length} propriétés affichées
          </p>
        </div>

        {/* Enable Overlay Button (for demo) */}
        <button
          onClick={() => setShowOverlay(true)}
          className="absolute top-20 right-4 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg shadow-md transition-colors text-sm font-medium z-40"
        >
          Afficher l'overlay
        </button>
      </div>

      {/* Google Maps Attribution (replace when using real map) */}
      <div className="absolute bottom-0 right-0 bg-white/90 px-2 py-1 text-xs text-gray-600 z-40">
        Map placeholder - Intégrer Google Maps ou Mapbox
      </div>
    </div>
  )
}
