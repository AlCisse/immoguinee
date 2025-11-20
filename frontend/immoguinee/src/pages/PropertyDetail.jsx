import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  HeartIcon,
  ShareIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import LoadingSpinner from '../components/LoadingSpinner'
import { propertyService, favoriteService, messageService } from '../services/api'
import { useAuth } from '../context/AuthContext'
import {
  formatPrice,
  formatDate,
  getPropertyTypeLabel,
  getTransactionTypeLabel,
  formatPhoneNumber,
} from '../utils/format'
import toast from 'react-hot-toast'

function PropertyDetail() {
  const { id } = useParams()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [currentImage, setCurrentImage] = useState(0)
  const [showContactForm, setShowContactForm] = useState(false)
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const { isAuthenticated, user } = useAuth()

  useEffect(() => {
    loadProperty()
  }, [id, isAuthenticated])

  const loadProperty = async () => {
    try {
      const response = await propertyService.getById(id)
      setProperty(response.data.property || response.data)

      if (isAuthenticated) {
        try {
          const favResponse = await favoriteService.check(id)
          setIsFavorite(favResponse.data.is_favorite)
        } catch (error) {
          // Ignore error
        }
      }
    } catch (error) {
      console.error('Error loading property:', error)
      toast.error('Erreur lors du chargement de la propriété')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error('Connectez-vous pour ajouter aux favoris')
      return
    }

    try {
      if (isFavorite) {
        await favoriteService.remove(id)
        setIsFavorite(false)
        toast.success('Retiré des favoris')
      } else {
        await favoriteService.add(id)
        setIsFavorite(true)
        toast.success('Ajouté aux favoris')
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour des favoris')
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Lien copié!')
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!message.trim()) return

    setSending(true)
    try {
      if (isAuthenticated) {
        await messageService.send({
          receiver_id: property.user_id,
          property_id: property.id,
          content: message,
        })
      } else {
        await messageService.sendContact({
          property_id: property.id,
          message: message,
        })
      }
      toast.success('Message envoyé!')
      setMessage('')
      setShowContactForm(false)
    } catch (error) {
      toast.error('Erreur lors de l\'envoi du message')
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return <LoadingSpinner className="min-h-[60vh]" />
  }

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Propriété non trouvée</h1>
        <Link to="/properties" className="btn-primary mt-4">
          Voir toutes les propriétés
        </Link>
      </div>
    )
  }

  const images = property.images || []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Galerie d'images */}
      <div className="relative mb-8">
        {images.length > 0 ? (
          <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden">
            <img
              src={images[currentImage]?.url}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50"
                >
                  <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50"
                >
                  <ChevronRightIcon className="w-6 h-6" />
                </button>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={`w-2 h-2 rounded-full ${
                        index === currentImage ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="aspect-video bg-gray-200 rounded-xl flex items-center justify-center">
            <span className="text-gray-400">Aucune image</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Détails principaux */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`badge ${property.transaction_type === 'sale' ? 'badge-primary' : 'badge-green'}`}>
                  {getTransactionTypeLabel(property.transaction_type)}
                </span>
                <span className="badge bg-gray-100 text-gray-800">
                  {getPropertyTypeLabel(property.property_type)}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {property.title}
              </h1>
              <div className="flex items-center text-gray-600 mt-2">
                <MapPinIcon className="w-5 h-5 mr-1" />
                {property.address}, {property.location?.district}, {property.location?.city}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleToggleFavorite}
                className="p-2 bg-white border rounded-lg hover:bg-gray-50"
              >
                {isFavorite ? (
                  <HeartSolidIcon className="w-6 h-6 text-red-500" />
                ) : (
                  <HeartIcon className="w-6 h-6 text-gray-600" />
                )}
              </button>
              <button
                onClick={handleShare}
                className="p-2 bg-white border rounded-lg hover:bg-gray-50"
              >
                <ShareIcon className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="text-3xl font-bold text-primary-600">
            {formatPrice(property.price)}
            {property.transaction_type === 'rent' && (
              <span className="text-lg font-normal text-gray-500">/mois</span>
            )}
          </div>

          {/* Caractéristiques */}
          <div className="card p-6">
            <h2 className="font-semibold text-lg mb-4">Caractéristiques</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {property.surface && (
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-semibold">{property.surface} m²</div>
                  <div className="text-sm text-gray-500">Surface</div>
                </div>
              )}
              {property.bedrooms && (
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-semibold">{property.bedrooms}</div>
                  <div className="text-sm text-gray-500">Chambres</div>
                </div>
              )}
              {property.bathrooms && (
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-semibold">{property.bathrooms}</div>
                  <div className="text-sm text-gray-500">Salles de bain</div>
                </div>
              )}
              {property.year_built && (
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-semibold">{property.year_built}</div>
                  <div className="text-sm text-gray-500">Année</div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="card p-6">
            <h2 className="font-semibold text-lg mb-4">Description</h2>
            <p className="text-gray-600 whitespace-pre-line">
              {property.description || 'Aucune description disponible.'}
            </p>
          </div>

          {/* Équipements */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="card p-6">
              <h2 className="font-semibold text-lg mb-4">Équipements</h2>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Contact */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="font-semibold text-lg mb-4">Contacter le vendeur</h2>

            {property.user && (
              <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-medium">
                    {property.user.first_name?.[0]?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="font-medium">
                    {property.user.first_name} {property.user.last_name}
                  </div>
                  <div className="text-sm text-gray-500">
                    Membre depuis {formatDate(property.user.created_at)}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3 mb-4">
              {property.user?.phone && (
                <a
                  href={`tel:${property.user.phone}`}
                  className="flex items-center gap-2 text-gray-600 hover:text-primary-600"
                >
                  <PhoneIcon className="w-5 h-5" />
                  {formatPhoneNumber(property.user.phone)}
                </a>
              )}
              <button
                onClick={() => setShowContactForm(!showContactForm)}
                className="flex items-center gap-2 text-gray-600 hover:text-primary-600"
              >
                <EnvelopeIcon className="w-5 h-5" />
                Envoyer un message
              </button>
            </div>

            {showContactForm && (
              <form onSubmit={handleSendMessage} className="space-y-4">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="input"
                  placeholder="Votre message..."
                  required
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="btn-primary w-full disabled:opacity-50"
                >
                  {sending ? 'Envoi...' : 'Envoyer'}
                </button>
              </form>
            )}

            {isAuthenticated && user?.id !== property.user_id && (
              <Link
                to={`/messages/${property.user_id}`}
                className="btn-outline w-full mt-4 text-center"
              >
                Voir la conversation
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyDetail
