'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Heart, Maximize2, BedDouble, Bath } from 'lucide-react'
import { Property } from '@/types'
import { formatPrice, formatArea } from '@/utils/format'

interface ModernPropertyCardProps {
  property: Property
  isNew?: boolean
  onFavorite?: (id: number) => void
  isFavorited?: boolean
}

export function ModernPropertyCard({
  property,
  isNew = false,
  onFavorite,
  isFavorited = false
}: ModernPropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [localFavorited, setLocalFavorited] = useState(isFavorited)

  const images = property.images.length > 0
    ? property.images
    : [{ id: 0, url: '/placeholder-property.jpg', is_main: true, order: 0, property_id: property.id }]

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setLocalFavorited(!localFavorited)
    onFavorite?.(property.id)
  }

  const providerLabel = "AgentHome"

  return (
    <div
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/properties/${property.id}`} className="block">
        {/* Image Carousel Section */}
        <div className="relative h-64 bg-gray-100 overflow-hidden">
          {/* Main Image */}
          <Image
            src={images[currentImageIndex]?.url || '/placeholder-property.jpg'}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />

          {/* Image Navigation - Show on hover if multiple images */}
          {images.length > 1 && isHovered && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all z-10"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all z-10"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </>
          )}

          {/* Image Dots Indicator */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentImageIndex
                      ? 'w-6 bg-white'
                      : 'w-1.5 bg-white/60'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {isNew && (
              <span className="bg-cyan-500 text-white px-3 py-1 rounded text-sm font-semibold shadow-md">
                Nouveau
              </span>
            )}
            {property.status === 'available' && (
              <span className="bg-white text-gray-800 px-3 py-1 rounded text-sm font-medium shadow-md">
                Disponible
              </span>
            )}
          </div>

          {/* Provider Badge */}
          <div className="absolute top-3 right-3 z-10">
            <div className="bg-white rounded-full p-2 shadow-md">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">AG</span>
              </div>
            </div>
          </div>

          {/* Favorite Button */}
          <button
            onClick={handleFavorite}
            className="absolute bottom-3 right-3 bg-white/90 hover:bg-white p-2.5 rounded-full shadow-md transition-all z-10"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                localFavorited
                  ? 'fill-red-500 text-red-500'
                  : 'text-gray-600'
              }`}
            />
          </button>
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-cyan-600 transition-colors">
            {property.title}
          </h3>

          {/* Price */}
          <div className="mb-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">
                {formatPrice(property.price)}
              </span>
              {property.type === 'rent' && (
                <span className="text-sm text-gray-500">/mois</span>
              )}
            </div>
          </div>

          {/* Property Details */}
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1.5" title={`Surface: ${formatArea(property.area)}`}>
              <Maximize2 className="w-4 h-4" />
              <span className="font-medium">{formatArea(property.area)}</span>
            </div>
            {property.rooms && (
              <div className="flex items-center gap-1.5" title={`${property.rooms} chambres`}>
                <BedDouble className="w-4 h-4" />
                <span className="font-medium">{property.rooms} ch.</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center gap-1.5" title={`${property.bathrooms} salles de bain`}>
                <Bath className="w-4 h-4" />
                <span className="font-medium">{property.bathrooms} sdb.</span>
              </div>
            )}
          </div>

          {/* Location */}
          <div className="text-sm text-gray-600 mb-3">
            <span className="font-medium">{property.city}</span>
            {property.region && (
              <>
                <span className="mx-1">"</span>
                <span>{property.region}</span>
              </>
            )}
          </div>

          {/* Footer with Provider */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Proposé par {providerLabel}
            </span>
            {property.type === 'rent' && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                Location
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}
