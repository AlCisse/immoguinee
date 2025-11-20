import { Link } from 'react-router-dom'
import { HeartIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { formatPrice } from '../utils/format'

function PropertyCard({ property, isFavorite, onToggleFavorite }) {
  const mainImage = property.images?.[0]?.url || '/placeholder-property.jpg'

  return (
    <div className="card-hover group">
      <div className="relative">
        <Link to={`/properties/${property.id}`}>
          <img
            src={mainImage}
            alt={property.title}
            className="w-full h-48 object-cover"
          />
        </Link>

        {/* Badge type */}
        <div className="absolute top-3 left-3">
          <span className={`badge ${property.transaction_type === 'sale' ? 'badge-primary' : 'badge-green'}`}>
            {property.transaction_type === 'sale' ? 'Vente' : 'Location'}
          </span>
        </div>

        {/* Favoris */}
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.preventDefault()
              onToggleFavorite(property.id)
            }}
            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
          >
            {isFavorite ? (
              <HeartSolidIcon className="w-5 h-5 text-red-500" />
            ) : (
              <HeartIcon className="w-5 h-5 text-gray-600" />
            )}
          </button>
        )}

        {/* Badge vendu/loué */}
        {property.status === 'sold' && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {property.transaction_type === 'sale' ? 'VENDU' : 'LOUÉ'}
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <Link to={`/properties/${property.id}`}>
          <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
            {property.title}
          </h3>
        </Link>

        <div className="flex items-center text-gray-500 text-sm mt-1">
          <MapPinIcon className="w-4 h-4 mr-1" />
          <span className="line-clamp-1">
            {property.location?.district}, {property.location?.city}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-xl font-bold text-primary-600">
            {formatPrice(property.price)}
            {property.transaction_type === 'rent' && (
              <span className="text-sm font-normal text-gray-500">/mois</span>
            )}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
          {property.bedrooms && (
            <span>{property.bedrooms} ch.</span>
          )}
          {property.bathrooms && (
            <span>{property.bathrooms} sdb.</span>
          )}
          {property.surface && (
            <span>{property.surface} m²</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default PropertyCard
