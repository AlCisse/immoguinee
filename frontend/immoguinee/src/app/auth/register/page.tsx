'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { getErrorMessage, getValidationErrors, isValidationError } from '@/utils/errors'

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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setFieldErrors({})

    if (formData.password !== formData.password_confirmation) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    setIsLoading(true)

    try {
      await register(formData)
      router.push('/dashboard')
    } catch (err: any) {
      // Gestion des erreurs de validation par champ
      if (isValidationError(err)) {
        setFieldErrors(getValidationErrors(err))
        setError('Veuillez corriger les erreurs ci-dessous')
      } else {
        // Affiche le message d'erreur exact de l'API
        setError(getErrorMessage(err, 'Une erreur est survenue lors de l\'inscription'))
      }
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
              <div className="bg-secondary-50 border border-secondary-200 text-secondary-700 px-4 py-3 rounded-lg flex items-start gap-2 animate-slide-down">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <Input
              label="Nom complet"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              error={fieldErrors.name}
              required
            />

            <Input
              label="Adresse e-mail"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="votre@email.com"
              error={fieldErrors.email}
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
              error={fieldErrors.phone}
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
              error={fieldErrors.password}
              helperText="Minimum 8 caractères"
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
              error={fieldErrors.password_confirmation}
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
