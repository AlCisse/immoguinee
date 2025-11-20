import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { propertyService, locationService } from '../services/api'
import toast from 'react-hot-toast'

function AddProperty() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [cities, setCities] = useState([])
  const [districts, setDistricts] = useState([])
  const [images, setImages] = useState([])
  const [previews, setPreviews] = useState([])

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      transaction_type: 'sale',
      property_type: 'house',
    },
  })

  const selectedCity = watch('city')

  useEffect(() => {
    loadCities()
  }, [])

  useEffect(() => {
    if (selectedCity) {
      loadDistricts(selectedCity)
    }
  }, [selectedCity])

  const loadCities = async () => {
    try {
      const response = await locationService.getCities()
      setCities(response.data.cities || response.data || [])
    } catch (error) {
      console.error('Error loading cities:', error)
    }
  }

  const loadDistricts = async (city) => {
    try {
      const response = await locationService.getDistricts(city)
      setDistricts(response.data.districts || response.data || [])
    } catch (error) {
      console.error('Error loading districts:', error)
    }
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    setImages((prev) => [...prev, ...files])

    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviews((prev) => [...prev, reader.result])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
    setPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      // Créer la propriété
      const response = await propertyService.create(data)
      const propertyId = response.data.property?.id || response.data.id

      // Upload des images
      if (images.length > 0) {
        await propertyService.uploadImages(propertyId, images)
      }

      toast.success('Propriété créée avec succès!')
      navigate('/my-properties')
    } catch (error) {
      console.error('Error creating property:', error)
      toast.error(error.response?.data?.message || 'Erreur lors de la création')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Ajouter une propriété</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Informations de base */}
        <div className="card p-6">
          <h2 className="font-semibold text-lg mb-4">Informations de base</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titre *
              </label>
              <input
                type="text"
                {...register('title', { required: 'Titre requis' })}
                className={`input ${errors.title ? 'border-red-500' : ''}`}
                placeholder="Ex: Belle villa avec piscine"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de transaction *
                </label>
                <select {...register('transaction_type')} className="input">
                  <option value="sale">Vente</option>
                  <option value="rent">Location</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de bien *
                </label>
                <select {...register('property_type')} className="input">
                  <option value="house">Maison</option>
                  <option value="apartment">Appartement</option>
                  <option value="land">Terrain</option>
                  <option value="commercial">Commercial</option>
                  <option value="office">Bureau</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prix (GNF) *
              </label>
              <input
                type="number"
                {...register('price', {
                  required: 'Prix requis',
                  min: { value: 1, message: 'Prix invalide' },
                })}
                className={`input ${errors.price ? 'border-red-500' : ''}`}
                placeholder="0"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className="input"
                placeholder="Décrivez votre propriété..."
              />
            </div>
          </div>
        </div>

        {/* Localisation */}
        <div className="card p-6">
          <h2 className="font-semibold text-lg mb-4">Localisation</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ville *
                </label>
                <select
                  {...register('city', { required: 'Ville requise' })}
                  className={`input ${errors.city ? 'border-red-500' : ''}`}
                >
                  <option value="">Sélectionner</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quartier
                </label>
                <select {...register('district')} className="input">
                  <option value="">Sélectionner</option>
                  {districts.map((district) => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adresse
              </label>
              <input
                type="text"
                {...register('address')}
                className="input"
                placeholder="Ex: Rue KA-001"
              />
            </div>
          </div>
        </div>

        {/* Caractéristiques */}
        <div className="card p-6">
          <h2 className="font-semibold text-lg mb-4">Caractéristiques</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Surface (m²)
              </label>
              <input
                type="number"
                {...register('surface')}
                className="input"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chambres
              </label>
              <input
                type="number"
                {...register('bedrooms')}
                className="input"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Salles de bain
              </label>
              <input
                type="number"
                {...register('bathrooms')}
                className="input"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Année de construction
              </label>
              <input
                type="number"
                {...register('year_built')}
                className="input"
                placeholder="2020"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="card p-6">
          <h2 className="font-semibold text-lg mb-4">Images</h2>
          <div className="space-y-4">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors">
              <PhotoIcon className="w-10 h-10 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Cliquez pour ajouter des images</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            {previews.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {previews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-outline"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50"
          >
            {loading ? 'Création...' : 'Créer la propriété'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddProperty
