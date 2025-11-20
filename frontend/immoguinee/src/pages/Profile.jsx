import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import { profileService } from '../services/api'
import toast from 'react-hot-toast'

function Profile() {
  const { user, updateUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  })

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const response = await profileService.update(data)
      updateUser(response.data.user || response.data)
      toast.success('Profil mis à jour!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour')
    } finally {
      setLoading(false)
    }
  }

  const onSubmitPassword = async (data) => {
    setChangingPassword(true)
    try {
      await profileService.updatePassword(data)
      toast.success('Mot de passe modifié!')
      resetPassword()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors du changement')
    } finally {
      setChangingPassword(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mon profil</h1>

      {/* Informations personnelles */}
      <div className="card p-6 mb-6">
        <h2 className="font-semibold text-lg mb-4">Informations personnelles</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prénom
              </label>
              <input
                type="text"
                {...register('first_name', { required: 'Prénom requis' })}
                className={`input ${errors.first_name ? 'border-red-500' : ''}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom
              </label>
              <input
                type="text"
                {...register('last_name', { required: 'Nom requis' })}
                className={`input ${errors.last_name ? 'border-red-500' : ''}`}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              {...register('email', { required: 'Email requis' })}
              className={`input ${errors.email ? 'border-red-500' : ''}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Téléphone
            </label>
            <input
              type="tel"
              {...register('phone')}
              className="input"
              placeholder="620000000"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50"
          >
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </form>
      </div>

      {/* Changer le mot de passe */}
      <div className="card p-6">
        <h2 className="font-semibold text-lg mb-4">Changer le mot de passe</h2>
        <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe actuel
            </label>
            <input
              type="password"
              {...registerPassword('current_password', { required: 'Requis' })}
              className={`input ${passwordErrors.current_password ? 'border-red-500' : ''}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              {...registerPassword('password', {
                required: 'Requis',
                minLength: { value: 8, message: 'Minimum 8 caractères' },
              })}
              className={`input ${passwordErrors.password ? 'border-red-500' : ''}`}
            />
            {passwordErrors.password && (
              <p className="mt-1 text-sm text-red-600">{passwordErrors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              {...registerPassword('password_confirmation', { required: 'Requis' })}
              className={`input ${passwordErrors.password_confirmation ? 'border-red-500' : ''}`}
            />
          </div>

          <button
            type="submit"
            disabled={changingPassword}
            className="btn-primary disabled:opacity-50"
          >
            {changingPassword ? 'Modification...' : 'Changer le mot de passe'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Profile
