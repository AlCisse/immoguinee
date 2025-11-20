import Link from 'next/link'
import Image from 'next/image'
import { Property } from '@/types'
import { formatPrice, formatArea } from '@/utils/format'
import Card from '@/components/ui/Card'

interface PropertyCardProps {
  property: Property
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const mainImage = property.images.find(img => img.is_main) || property.images[0]
  const imageUrl = mainImage?.url || '/placeholder-property.jpg'

  const typeLabels = {
    sale: 'À vendre',
    rent: 'À louer',
  }

  const propertyTypeLabels = {
    house: 'Maison',
    apartment: 'Appartement',
    land: 'Terrain',
    commercial: 'Commercial',
  }

  const statusLabels = {
    available: 'Disponible',
    pending: 'En cours',
    sold: 'Vendu',
    rented: 'Loué',
  }

  return (
    <Card padding="none" className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/properties/${property.id}`}>
        <div className="relative h-48 w-full">
          <Image
            src={imageUrl}
            alt={property.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-2 right-2 px-3 py-1 bg-primary-600 text-white text-sm font-semibold rounded">
            {typeLabels[property.type]}
          </div>
          <div className="absolute top-2 left-2 px-3 py-1 bg-white text-gray-800 text-sm font-semibold rounded">
            {statusLabels[property.status]}
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
            {property.title}
          </h3>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {property.description}
          </p>

          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <span>{propertyTypeLabels[property.property_type]}</span>
            <span>•</span>
            <span>{property.city}, {property.region}</span>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            {property.area && (
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                <span>{formatArea(property.area)}</span>
              </div>
            )}
            {property.rooms && (
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>{property.rooms} chambres</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
                <span>{property.bathrooms} salles de bain</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <span className="text-2xl font-bold text-primary-600">
              {formatPrice(property.price)}
            </span>
            <span className="text-sm text-gray-500">
              {property.type === 'rent' ? '/ mois' : ''}
            </span>
          </div>
        </div>
      </Link>
    </Card>
  )
}
