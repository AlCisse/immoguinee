import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeftIcon, EyeIcon, TrashIcon } from '@heroicons/react/24/outline'
import LoadingSpinner from '../../components/LoadingSpinner'
import { propertyService } from '../../services/api'
import { formatPrice, getStatusLabel, getStatusColor } from '../../utils/format'
import toast from 'react-hot-toast'

function AdminProperties() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProperties()
  }, [])

  const loadProperties = async () => {
    try {
      const response = await propertyService.getAll({ per_page: 100 })
      setProperties(response.data.properties || response.data.data || [])
    } catch (error) {
      console.error('Error loading properties:', error)
      toast.error('Erreur lors du chargement')
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

  if (loading) {
    return <LoadingSpinner className="min-h-[60vh]" />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center mb-6">
        <Link to="/admin" className="mr-4 p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Gestion des propriétés</h1>
      </div>

      {properties.length > 0 ? (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Propriété
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Propriétaire
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Prix
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
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
                        className="w-12 h-10 object-cover rounded mr-3"
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
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {property.user?.first_name} {property.user?.last_name}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {formatPrice(property.price)}
                  </td>
                  <td className="px-6 py-4">
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
          <p className="text-gray-500">Aucune propriété trouvée</p>
        </div>
      )}
    </div>
  )
}

export default AdminProperties
