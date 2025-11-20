import { useState, useEffect } from 'react'
import { BanknotesIcon } from '@heroicons/react/24/outline'
import LoadingSpinner from '../components/LoadingSpinner'
import { transactionService } from '../services/api'
import { formatDate, formatPrice } from '../utils/format'

function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTransactions()
  }, [])

  const loadTransactions = async () => {
    try {
      const response = await transactionService.getAll()
      setTransactions(response.data.transactions || response.data || [])
    } catch (error) {
      console.error('Error loading transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusLabel = (status) => {
    const statuses = {
      pending: 'En attente',
      completed: 'Complété',
      failed: 'Échoué',
      refunded: 'Remboursé',
    }
    return statuses[status] || status
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return <LoadingSpinner className="min-h-[60vh]" />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mes transactions</h1>

      {transactions.length > 0 ? (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(transaction.created_at)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {transaction.description || `Transaction #${transaction.id}`}
                    </div>
                    <div className="text-sm text-gray-500">
                      {transaction.payment_method || 'Mobile Money'}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {formatPrice(transaction.amount)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`badge ${getStatusColor(transaction.status)}`}>
                      {getStatusLabel(transaction.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card p-8 text-center">
          <BanknotesIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Aucune transaction</p>
        </div>
      )}
    </div>
  )
}

export default Transactions
