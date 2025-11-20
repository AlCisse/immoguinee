'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { propertyService } from '@/services/property.service'
import { Property } from '@/types'
import { formatPrice, formatArea, formatDate } from '@/utils/format'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function PropertyDetailPage() {
  const params = useParams()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await propertyService.getProperty(Number(params.id))
        setProperty(data)
      } catch (err: any) {
        setError('Propriété introuvable')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProperty()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <Link href="/properties">
            <Button>Retour aux propriétés</Button>
          </Link>
        </div>
      </div>
    )
  }

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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Link href="/properties" className="text-primary-600 hover:text-primary-700 mb-4 inline-block">
          ← Retour aux propriétés
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Images */}
            <Card padding="none" className="mb-6 overflow-hidden">
              {property.images.length > 0 ? (
                <>
                  <div className="relative h-96 w-full">
                    <Image
                      src={property.images[currentImageIndex].url}
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {property.images.length > 1 && (
                    <div className="p-4 grid grid-cols-6 gap-2">
                      {property.images.map((image, index) => (
                        <button
                          key={image.id}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`relative h-20 rounded overflow-hidden ${
                            index === currentImageIndex ? 'ring-2 ring-primary-600' : ''
                          }`}
                        >
                          <Image
                            src={image.url}
                            alt={`${property.title} ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="h-96 bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">Aucune image disponible</p>
                </div>
              )}
            </Card>

            {/* Description */}
            <Card className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {property.title}
              </h1>

              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
                  {typeLabels[property.type]}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                  {statusLabels[property.status]}
                </span>
              </div>

              <div className="text-3xl font-bold text-primary-600 mb-4">
                {formatPrice(property.price)}
                {property.type === 'rent' && <span className="text-lg text-gray-600"> / mois</span>}
              </div>

              <div className="flex items-center gap-2 text-gray-600 mb-6">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{property.address}, {property.city}, {property.region}</span>
              </div>

              <div className="prose max-w-none mb-6">
                <h3 className="text-xl font-semibold mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-xl font-semibold mb-4">Caractéristiques</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-600 text-sm">Type</p>
                    <p className="font-semibold">{propertyTypeLabels[property.property_type]}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Surface</p>
                    <p className="font-semibold">{formatArea(property.area)}</p>
                  </div>
                  {property.rooms && (
                    <div>
                      <p className="text-gray-600 text-sm">Chambres</p>
                      <p className="font-semibold">{property.rooms}</p>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div>
                      <p className="text-gray-600 text-sm">Salles de bain</p>
                      <p className="font-semibold">{property.bathrooms}</p>
                    </div>
                  )}
                </div>
              </div>

              {property.amenities && property.amenities.length > 0 && (
                <div className="border-t pt-4 mt-4">
                  <h3 className="text-xl font-semibold mb-4">Équipements</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <h3 className="text-xl font-semibold mb-4">Contactez-nous</h3>
              <p className="text-gray-600 mb-4">
                Intéressé par cette propriété ? Contactez-nous pour plus d'informations.
              </p>

              <div className="space-y-3 mb-6">
                <Button className="w-full">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Appeler
                </Button>

                <Button variant="outline" className="w-full">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Envoyer un e-mail
                </Button>

                <Button variant="outline" className="w-full">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Planifier une visite
                </Button>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-600">
                  Publié le {formatDate(property.created_at)}
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
