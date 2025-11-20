import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  BuildingOfficeIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'
import LoadingSpinner from '../components/LoadingSpinner'
import PropertyCard from '../components/PropertyCard'
import { propertyService, favoriteService, messageService, contractService } from '../services/api'
import { useAuth } from '../context/AuthContext'

function Dashboard() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    properties: 0,
    favorites: 0,
    messages: 0,
    contracts: 0,
  })
  const [recentProperties, setRecentProperties] = useState([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [propertiesRes, favoritesRes, messagesRes, contractsRes] = await Promise.all([
        propertyService.getMyProperties(),
        favoriteService.getAll(),
        messageService.getAll(),
        contractService.getAll(),
      ])

      const properties = propertiesRes.data.properties || propertiesRes.data || []
      const favorites = favoritesRes.data.favorites || favoritesRes.data || []
      const messages = messagesRes.data.messages || messagesRes.data || []
      const contracts = contractsRes.data.contracts || contractsRes.data || []

      setStats({
        properties: properties.length,
        favorites: favorites.length,
        messages: messages.filter((m) => !m.read_at).length,
        contracts: contracts.length,
      })

      setRecentProperties(properties.slice(0, 3))
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      name: 'Mes propriétés',
      value: stats.properties,
      icon: BuildingOfficeIcon,
      href: '/my-properties',
      color: 'bg-blue-500',
    },
    {
      name: 'Favoris',
      value: stats.favorites,
      icon: HeartIcon,
      href: '/favorites',
      color: 'bg-red-500',
    },
    {
      name: 'Messages non lus',
      value: stats.messages,
      icon: ChatBubbleLeftRightIcon,
      href: '/messages',
      color: 'bg-green-500',
    },
    {
      name: 'Contrats',
      value: stats.contracts,
      icon: DocumentTextIcon,
      href: '/contracts',
      color: 'bg-purple-500',
    },
  ]

  if (loading) {
    return <LoadingSpinner className="min-h-[60vh]" />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Bienvenue, {user?.first_name}!
        </h1>
        <p className="text-gray-600">
          Voici un aperçu de votre activité sur Immo Guinée
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <Link
            key={stat.name}
            to={stat.href}
            className="card p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.name}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Actions rapides */}
      <div className="card p-6 mb-8">
        <h2 className="font-semibold text-lg mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/add-property"
            className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <PlusIcon className="w-8 h-8 text-primary-600 mr-3" />
            <div>
              <div className="font-medium text-gray-900">Ajouter une propriété</div>
              <div className="text-sm text-gray-500">Publier une nouvelle annonce</div>
            </div>
          </Link>
          <Link
            to="/properties"
            className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <BuildingOfficeIcon className="w-8 h-8 text-primary-600 mr-3" />
            <div>
              <div className="font-medium text-gray-900">Rechercher</div>
              <div className="text-sm text-gray-500">Parcourir les propriétés</div>
            </div>
          </Link>
          <Link
            to="/messages"
            className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <ChatBubbleLeftRightIcon className="w-8 h-8 text-primary-600 mr-3" />
            <div>
              <div className="font-medium text-gray-900">Messages</div>
              <div className="text-sm text-gray-500">Voir vos conversations</div>
            </div>
          </Link>
        </div>
      </div>

      {/* Propriétés récentes */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">Mes propriétés récentes</h2>
          <Link to="/my-properties" className="text-primary-600 hover:text-primary-700 text-sm">
            Voir tout
          </Link>
        </div>

        {recentProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center">
            <BuildingOfficeIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Vous n'avez pas encore de propriétés</p>
            <Link to="/add-property" className="btn-primary">
              Ajouter une propriété
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
