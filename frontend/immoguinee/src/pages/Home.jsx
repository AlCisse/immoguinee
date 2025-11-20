import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  HomeIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline'
import PropertyCard from '../components/PropertyCard'
import SearchBar from '../components/SearchBar'
import LoadingSpinner from '../components/LoadingSpinner'
import { propertyService, favoriteService } from '../services/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

function Home() {
  const [featuredProperties, setFeaturedProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState([])
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    loadData()
  }, [isAuthenticated])

  const loadData = async () => {
    try {
      const [propertiesRes, favoritesRes] = await Promise.all([
        propertyService.getFeatured(),
        isAuthenticated ? favoriteService.getAll() : Promise.resolve({ data: [] }),
      ])
      setFeaturedProperties(propertiesRes.data.properties || propertiesRes.data || [])
      const favIds = (favoritesRes.data.favorites || favoritesRes.data || []).map(
        (f) => f.property_id || f.id
      )
      setFavorites(favIds)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleFavorite = async (propertyId) => {
    if (!isAuthenticated) {
      toast.error('Connectez-vous pour ajouter aux favoris')
      return
    }

    try {
      if (favorites.includes(propertyId)) {
        await favoriteService.remove(propertyId)
        setFavorites((prev) => prev.filter((id) => id !== propertyId))
        toast.success('Retiré des favoris')
      } else {
        await favoriteService.add(propertyId)
        setFavorites((prev) => [...prev, propertyId])
        toast.success('Ajouté aux favoris')
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour des favoris')
    }
  }

  const features = [
    {
      icon: HomeIcon,
      title: 'Large choix',
      description: 'Des milliers de propriétés à vendre et à louer partout en Guinée',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Transactions sécurisées',
      description: 'Vérification des documents et paiements sécurisés',
    },
    {
      icon: DocumentTextIcon,
      title: 'Contrats numériques',
      description: 'Signez vos contrats en ligne avec signature électronique',
    },
    {
      icon: BuildingOfficeIcon,
      title: 'Agents certifiés',
      description: 'Travaillez avec des professionnels de confiance',
    },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Trouvez votre bien idéal
              <br />
              <span className="text-secondary-400">en Guinée</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
              La plateforme immobilière de référence avec des contrats numériques
              et des transactions sécurisées
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <SearchBar variant="hero" />
          </div>
        </div>
      </section>

      {/* Statistiques */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-600">1000+</div>
              <div className="text-gray-600">Propriétés</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-600">500+</div>
              <div className="text-gray-600">Clients satisfaits</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-600">50+</div>
              <div className="text-gray-600">Agents certifiés</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-600">8</div>
              <div className="text-gray-600">Villes couvertes</div>
            </div>
          </div>
        </div>
      </section>

      {/* Propriétés en vedette */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="section-title">Propriétés en vedette</h2>
              <p className="section-subtitle">
                Découvrez nos meilleures offres du moment
              </p>
            </div>
            <Link to="/properties" className="btn-outline hidden md:inline-flex">
              Voir tout
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner className="py-12" />
          ) : featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.slice(0, 6).map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  isFavorite={favorites.includes(property.id)}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Aucune propriété en vedette pour le moment
            </div>
          )}

          <div className="text-center mt-8 md:hidden">
            <Link to="/properties" className="btn-outline">
              Voir toutes les propriétés
            </Link>
          </div>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Pourquoi choisir Immo Guinée?</h2>
            <p className="section-subtitle">
              Une plateforme moderne pour toutes vos transactions immobilières
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-xl flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Prêt à vendre ou louer votre bien?
          </h2>
          <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
            Publiez votre annonce gratuitement et atteignez des milliers d'acheteurs
            et locataires potentiels
          </p>
          <Link to="/add-property" className="btn bg-white text-green-700 hover:bg-gray-100">
            Publier une annonce
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
