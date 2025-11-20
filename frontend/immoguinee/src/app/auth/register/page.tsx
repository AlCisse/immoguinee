'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    role: 'client' as 'client' | 'owner' | 'agent',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.password_confirmation) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    setIsLoading(true)

    try {
      await register(formData)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur est survenue lors de l\'inscription')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Créer un compte ImmoGuinée
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Ou{' '}
            <Link href="/auth/login" className="font-medium text-primary-600 hover:text-primary-500">
              connectez-vous à votre compte existant
            </Link>
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <Input
              label="Nom complet"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />

            <Input
              label="Adresse e-mail"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="votre@email.com"
              required
              autoComplete="email"
            />

            <Input
              label="Téléphone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+224 XXX XXX XXX"
            />

            <Select
              label="Type de compte"
              name="role"
              value={formData.role}
              onChange={handleChange}
              options={[
                { value: 'client', label: 'Client (Je cherche une propriété)' },
                { value: 'owner', label: 'Propriétaire (Je veux vendre/louer)' },
                { value: 'agent', label: 'Agent immobilier' },
              ]}
            />

            <Input
              label="Mot de passe"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              autoComplete="new-password"
            />

            <Input
              label="Confirmer le mot de passe"
              type="password"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              placeholder="••••••••"
              required
              autoComplete="new-password"
            />

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
            >
              S'inscrire
            </Button>

            <p className="text-xs text-gray-600 text-center">
              En vous inscrivant, vous acceptez nos{' '}
              <Link href="/terms" className="text-primary-600 hover:text-primary-500">
                Conditions d'utilisation
              </Link>{' '}
              et notre{' '}
              <Link href="/privacy" className="text-primary-600 hover:text-primary-500">
                Politique de confidentialité
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </div>
  )
}
