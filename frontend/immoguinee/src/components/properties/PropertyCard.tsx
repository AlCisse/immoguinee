import Link from 'next/link'
import Image from 'next/image'
import { Property } from '@/types'
import { formatPrice, formatArea } from '@/utils/format'
import { escapeHtml } from '@/utils/sanitize'
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

  const statusColors = {
    available: 'bg-white text-neutral-800',
    pending: 'bg-yellow-100 text-yellow-800',
    sold: 'bg-neutral-100 text-neutral-600',
    rented: 'bg-neutral-100 text-neutral-600',
  }

  return (
    <Card padding="none" className="overflow-hidden card-hover group">
      <Link href={`/properties/${property.id}`} className="block">
        {/* Image Section */}
        <div className="relative h-64 w-full overflow-hidden bg-neutral-100">
          <Image
            src={imageUrl}
            alt={escapeHtml(property.title)}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            quality={85}
          />

          {/* Overlay gradient pour meilleure lisibilité des badges */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />

          {/* Badges */}
          <div className="absolute top-3 right-3 px-3 py-1.5 bg-primary-600 text-white text-sm font-semibold rounded-lg shadow-medium backdrop-blur-sm">
            {typeLabels[property.type]}
          </div>
          <div className={`absolute top-3 left-3 px-3 py-1.5 text-sm font-semibold rounded-lg shadow-soft ${statusColors[property.status]}`}>
            {statusLabels[property.status]}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5">
          <h3 className="text-xl font-bold text-neutral-900 mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">
            {property.title}
          </h3>

          <p className="text-neutral-600 text-sm mb-3 line-clamp-2 leading-relaxed">
            {property.description}
          </p>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-neutral-600 mb-4">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="font-medium">{propertyTypeLabels[property.property_type]}</span>
            <span className="text-neutral-400">•</span>
            <span>{property.city}, {property.region}</span>
          </div>

          {/* Features */}
          <div className="flex items-center gap-4 text-sm text-neutral-600 mb-4 flex-wrap">
            {property.area && (
              <div className="flex items-center gap-1.5" title={`Surface: ${formatArea(property.area)}`}>
                <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                <span className="font-medium">{formatArea(property.area)}</span>
              </div>
            )}
            {property.rooms && (
              <div className="flex items-center gap-1.5" title={`${property.rooms} chambres`}>
                <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="font-medium">{property.rooms} ch.</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center gap-1.5" title={`${property.bathrooms} salles de bain`}>
                <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
                <span className="font-medium">{property.bathrooms} sdb.</span>
              </div>
            )}
          </div>

          {/* Price Section */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-primary-600 leading-tight">
                {formatPrice(property.price)}
              </span>
              {property.type === 'rent' && (
                <span className="text-xs text-neutral-500 mt-0.5">par mois</span>
              )}
            </div>
            <span className="text-primary-600 group-hover:translate-x-1 transition-transform" aria-hidden="true">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </Card>
  )
}
