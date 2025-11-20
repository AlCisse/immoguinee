import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline'
import LoadingSpinner from '../components/LoadingSpinner'
import { propertyService } from '../services/api'
import { formatPrice, getStatusLabel, getStatusColor } from '../utils/format'
import toast from 'react-hot-toast'

function MyProperties() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProperties()
  }, [])

  const loadProperties = async () => {
    try {
      const response = await propertyService.getMyProperties()
      setProperties(response.data.properties || response.data || [])
    } catch (error) {
      console.error('Error loading properties:', error)
      toast.error('Erreur lors du chargement des propriétés')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette propriété?')) return

    try {
      await propertyService.delete(id)
      setProperties((prev) => prev.filter((p) => p.id !== id))
      toast.success('Propriété supprimée')
    } catch (error) {
      toast.error('Erreur lors de la suppression')
    }
  }

  const handlePublish = async (id) => {
    try {
      await propertyService.publish(id)
      setProperties((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: 'published' } : p))
      )
      toast.success('Propriété publiée')
    } catch (error) {
      toast.error('Erreur lors de la publication')
    }
  }

  const handleUnpublish = async (id) => {
    try {
      await propertyService.unpublish(id)
      setProperties((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: 'draft' } : p))
      )
      toast.success('Propriété dépubliée')
    } catch (error) {
      toast.error('Erreur lors de la dépublication')
    }
  }

  if (loading) {
    return <LoadingSpinner className="min-h-[60vh]" />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mes propriétés</h1>
        <Link to="/add-property" className="btn-primary flex items-center">
          <PlusIcon className="w-5 h-5 mr-2" />
          Ajouter
        </Link>
      </div>

      {properties.length > 0 ? (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Propriété
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 hidden md:table-cell">
                  Prix
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 hidden md:table-cell">
                  Statut
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {properties.map((property) => (
                <tr key={property.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={property.images?.[0]?.url || '/placeholder-property.jpg'}
                        alt={property.title}
                        className="w-16 h-12 object-cover rounded-lg mr-4"
                      />
                      <div>
                        <div className="font-medium text-gray-900 line-clamp-1">
                          {property.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {property.location?.city}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <div className="text-gray-900">{formatPrice(property.price)}</div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className={`badge ${getStatusColor(property.status)}`}>
                      {getStatusLabel(property.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/properties/${property.id}`}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        title="Voir"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </Link>
                      <Link
                        to={`/edit-property/${property.id}`}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        title="Modifier"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </Link>
                      {property.status === 'draft' ? (
                        <button
                          onClick={() => handlePublish(property.id)}
                          className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                        >
                          Publier
                        </button>
                      ) : property.status === 'published' ? (
                        <button
                          onClick={() => handleUnpublish(property.id)}
                          className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200"
                        >
                          Dépublier
                        </button>
                      ) : null}
                      <button
                        onClick={() => handleDelete(property.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Supprimer"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
  )
}

export default MyProperties
