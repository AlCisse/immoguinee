'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { formatDate } from '@/utils/format'

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  })

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isLoading, isAuthenticated, router])

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
      })
    }
  }, [user])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implémenter la mise à jour du profil
    console.log('Mise à jour du profil:', formData)
    setIsEditing(false)
  }

  const roleLabels = {
    admin: 'Administrateur',
    agent: 'Agent immobilier',
    client: 'Client',
    owner: 'Propriétaire',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Mon profil</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informations principales */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Informations personnelles
                </h2>
                {!isEditing && (
                  <Button onClick={() => setIsEditing(true)} variant="outline">
                    Modifier
                  </Button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Nom complet"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />

                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />

                  <Input
                    label="Téléphone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                  />

                  <div className="flex gap-4">
                    <Button type="submit">Enregistrer</Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Annuler
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Nom complet
                    </label>
                    <p className="text-lg text-gray-900">{user.name}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Email
                    </label>
                    <p className="text-lg text-gray-900">{user.email}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Téléphone
                    </label>
                    <p className="text-lg text-gray-900">
                      {user.phone || 'Non renseigné'}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Rôle
                    </label>
                    <p className="text-lg text-gray-900">
                      {roleLabels[user.role]}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Membre depuis
                    </label>
                    <p className="text-lg text-gray-900">
                      {formatDate(user.created_at)}
                    </p>
                  </div>
                </div>
              )}
            </Card>

            {/* Changer le mot de passe */}
            <Card className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Sécurité
              </h2>
              <Button variant="outline">Changer le mot de passe</Button>
            </Card>
          </div>

          {/* Avatar et statistiques */}
          <div className="lg:col-span-1">
            <Card>
              <div className="text-center">
                <div className="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl font-bold text-primary-600">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {user.name}
                </h3>
                <p className="text-gray-600 mb-4">{roleLabels[user.role]}</p>
                <Button variant="outline" className="w-full">
                  Changer l'avatar
                </Button>
              </div>
            </Card>

            {user.role !== 'client' && (
              <Card className="mt-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Mes statistiques
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Propriétés</span>
                    <span className="text-2xl font-bold text-primary-600">0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Contrats</span>
                    <span className="text-2xl font-bold text-primary-600">0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Clients</span>
                    <span className="text-2xl font-bold text-primary-600">0</span>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
