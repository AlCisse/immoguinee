import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { DocumentTextIcon } from '@heroicons/react/24/outline'
import LoadingSpinner from '../components/LoadingSpinner'
import { contractService } from '../services/api'
import { formatDate, formatPrice } from '../utils/format'

function Contracts() {
  const [contracts, setContracts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadContracts()
  }, [])

  const loadContracts = async () => {
    try {
      const response = await contractService.getAll()
      setContracts(response.data.contracts || response.data || [])
    } catch (error) {
      console.error('Error loading contracts:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusLabel = (status) => {
    const statuses = {
      draft: 'Brouillon',
      pending: 'En attente',
      signed: 'Signé',
      completed: 'Complété',
      cancelled: 'Annulé',
    }
    return statuses[status] || status
  }

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      signed: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return <LoadingSpinner className="min-h-[60vh]" />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mes contrats</h1>

      {contracts.length > 0 ? (
        <div className="space-y-4">
          {contracts.map((contract) => (
            <Link
              key={contract.id}
              to={`/contracts/${contract.id}`}
              className="card p-6 block hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`badge ${getStatusColor(contract.status)}`}>
                      {getStatusLabel(contract.status)}
                    </span>
                    <span className="badge bg-gray-100 text-gray-800">
                      {contract.type === 'sale' ? 'Vente' : 'Location'}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    {contract.property?.title || 'Propriété'}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Contrat #{contract.id} - {formatDate(contract.created_at)}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary-600">
                    {formatPrice(contract.amount)}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="card p-8 text-center">
          <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Vous n'avez pas encore de contrats</p>
          <Link to="/properties" className="btn-primary">
            Parcourir les propriétés
          </Link>
        </div>
      )}
    </div>
  )
}

export default Contracts
