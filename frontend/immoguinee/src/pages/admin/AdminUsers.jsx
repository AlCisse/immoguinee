import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeftIcon, NoSymbolIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import LoadingSpinner from '../../components/LoadingSpinner'
import { adminService } from '../../services/api'
import { formatDate } from '../../utils/format'
import toast from 'react-hot-toast'

function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const response = await adminService.getUsers()
      setUsers(response.data.users || response.data || [])
    } catch (error) {
      console.error('Error loading users:', error)
      toast.error('Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }

  const handleBlock = async (id) => {
    try {
      await adminService.blockUser(id)
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, is_blocked: true } : u))
      )
      toast.success('Utilisateur bloqué')
    } catch (error) {
      toast.error('Erreur lors du blocage')
    }
  }

  const handleUnblock = async (id) => {
    try {
      await adminService.unblockUser(id)
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, is_blocked: false } : u))
      )
      toast.success('Utilisateur débloqué')
    } catch (error) {
      toast.error('Erreur lors du déblocage')
    }
  }

  const handleRoleChange = async (id, role) => {
    try {
      await adminService.updateUserRole(id, role)
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role } : u))
      )
      toast.success('Rôle mis à jour')
    } catch (error) {
      toast.error('Erreur lors de la mise à jour')
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
        <h1 className="text-2xl font-bold text-gray-900">Gestion des utilisateurs</h1>
      </div>

      {users.length > 0 ? (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Inscrit le
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user) => (
                <tr key={user.id} className={user.is_blocked ? 'bg-red-50' : 'hover:bg-gray-50'}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-primary-600 font-medium">
                          {user.first_name?.[0]?.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {user.first_name} {user.last_name}
                        </div>
                        <div className="text-sm text-gray-500">{user.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="text-sm border rounded px-2 py-1"
                    >
                      <option value="user">Utilisateur</option>
                      <option value="agent">Agent</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(user.created_at)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {user.is_blocked ? (
                      <button
                        onClick={() => handleUnblock(user.id)}
                        className="text-green-600 hover:text-green-700"
                        title="Débloquer"
                      >
                        <CheckCircleIcon className="w-5 h-5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBlock(user.id)}
                        className="text-red-600 hover:text-red-700"
                        title="Bloquer"
                      >
                        <NoSymbolIcon className="w-5 h-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card p-8 text-center">
          <p className="text-gray-500">Aucun utilisateur trouvé</p>
        </div>
      )}
    </div>
  )
}

export default AdminUsers
