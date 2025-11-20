import { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

function Contact() {
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    // Simuler l'envoi
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toast.success('Message envoyé! Nous vous répondrons bientôt.')
    reset()
    setLoading(false)
  }

  const contactInfo = [
    {
      icon: MapPinIcon,
      title: 'Adresse',
      details: ['Quartier Almamya', 'Commune de Kaloum', 'Conakry, Guinée'],
    },
    {
      icon: PhoneIcon,
      title: 'Téléphone',
      details: ['+224 620 00 00 00', '+224 621 00 00 00'],
    },
    {
      icon: EnvelopeIcon,
      title: 'Email',
      details: ['contact@immoguinee.com', 'support@immoguinee.com'],
    },
    {
      icon: ClockIcon,
      title: 'Horaires',
      details: ['Lun - Ven: 8h - 18h', 'Sam: 8h - 13h'],
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Contactez-nous</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Une question? Une suggestion? N'hésitez pas à nous contacter.
          Notre équipe est là pour vous aider.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Informations de contact */}
        <div className="lg:col-span-1 space-y-6">
          {contactInfo.map((item, index) => (
            <div key={index} className="card p-6">
              <div className="flex items-start">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-primary-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  {item.details.map((detail, i) => (
                    <p key={i} className="text-gray-600 text-sm">
                      {detail}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Formulaire */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <h2 className="font-semibold text-lg mb-6">Envoyer un message</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    {...register('name', { required: 'Nom requis' })}
                    className={`input ${errors.name ? 'border-red-500' : ''}`}
                    placeholder="Votre nom"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    {...register('email', {
                      required: 'Email requis',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Email invalide',
                      },
                    })}
                    className={`input ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="vous@exemple.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sujet *
                </label>
                <input
                  type="text"
                  {...register('subject', { required: 'Sujet requis' })}
                  className={`input ${errors.subject ? 'border-red-500' : ''}`}
                  placeholder="Sujet de votre message"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  {...register('message', { required: 'Message requis' })}
                  rows={5}
                  className={`input ${errors.message ? 'border-red-500' : ''}`}
                  placeholder="Votre message..."
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50"
              >
                {loading ? 'Envoi...' : 'Envoyer le message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
