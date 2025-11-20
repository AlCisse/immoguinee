import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  UsersIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline'
import LoadingSpinner from '../../components/LoadingSpinner'
import { adminService } from '../../services/api'

function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const response = await adminService.getDashboardStats()
      setStats(response.data)
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner className="min-h-[60vh]" />
  }

  const statCards = [
    {
      name: 'Utilisateurs',
      value: stats?.users_count || 0,
      icon: UsersIcon,
      href: '/admin/users',
      color: 'bg-blue-500',
    },
    {
      name: 'Propriétés',
      value: stats?.properties_count || 0,
      icon: BuildingOfficeIcon,
      href: '/admin/properties',
      color: 'bg-green-500',
    },
    {
      name: 'Contrats',
      value: stats?.contracts_count || 0,
      icon: DocumentTextIcon,
      href: '#',
      color: 'bg-purple-500',
    },
    {
      name: 'Transactions',
      value: stats?.transactions_count || 0,
      icon: BanknotesIcon,
      href: '#',
      color: 'bg-yellow-500',
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
        <p className="text-gray-600">Tableau de bord administrateur</p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="font-semibold text-lg mb-4">Gestion des utilisateurs</h2>
          <p className="text-gray-600 mb-4">
            Gérez les comptes utilisateurs, les rôles et les permissions.
          </p>
          <Link to="/admin/users" className="btn-primary">
            Voir les utilisateurs
          </Link>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold text-lg mb-4">Gestion des propriétés</h2>
          <p className="text-gray-600 mb-4">
            Modérez les annonces et gérez les propriétés publiées.
          </p>
          <Link to="/admin/properties" className="btn-primary">
            Voir les propriétés
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
