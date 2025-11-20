import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline'
import LoadingSpinner from '../components/LoadingSpinner'
import { propertyService, locationService } from '../services/api'
import toast from 'react-hot-toast'

function EditProperty() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [cities, setCities] = useState([])
  const [districts, setDistricts] = useState([])
  const [existingImages, setExistingImages] = useState([])
  const [newImages, setNewImages] = useState([])
  const [newPreviews, setNewPreviews] = useState([])

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm()

  const selectedCity = watch('city')

  useEffect(() => {
    loadData()
  }, [id])

  useEffect(() => {
    if (selectedCity) {
      loadDistricts(selectedCity)
    }
  }, [selectedCity])

  const loadData = async () => {
    try {
      const [propertyRes, citiesRes] = await Promise.all([
        propertyService.getById(id),
        locationService.getCities(),
      ])

      const property = propertyRes.data.property || propertyRes.data
      setCities(citiesRes.data.cities || citiesRes.data || [])
      setExistingImages(property.images || [])

      reset({
        title: property.title,
        description: property.description,
        price: property.price,
        transaction_type: property.transaction_type,
        property_type: property.property_type,
        city: property.location?.city,
        district: property.location?.district,
        address: property.address,
        surface: property.surface,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        year_built: property.year_built,
      })

      if (property.location?.city) {
        await loadDistricts(property.location.city)
      }
    } catch (error) {
      console.error('Error loading property:', error)
      toast.error('Erreur lors du chargement')
      navigate('/my-properties')
    } finally {
      setLoading(false)
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
    setNewImages((prev) => [...prev, ...files])

    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewPreviews((prev) => [...prev, reader.result])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeExistingImage = async (imageId) => {
    try {
      await propertyService.deleteImage(id, imageId)
      setExistingImages((prev) => prev.filter((img) => img.id !== imageId))
      toast.success('Image supprimée')
    } catch (error) {
      toast.error('Erreur lors de la suppression')
    }
  }

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index))
    setNewPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      await propertyService.update(id, data)

      if (newImages.length > 0) {
        await propertyService.uploadImages(id, newImages)
      }

      toast.success('Propriété mise à jour!')
      navigate('/my-properties')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <LoadingSpinner className="min-h-[60vh]" />
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Modifier la propriété</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Mêmes champs que AddProperty */}
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
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de transaction
                </label>
                <select {...register('transaction_type')} className="input">
                  <option value="sale">Vente</option>
                  <option value="rent">Location</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de bien
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
                {...register('price', { required: 'Prix requis' })}
                className={`input ${errors.price ? 'border-red-500' : ''}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea {...register('description')} rows={4} className="input" />
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
                  Ville
                </label>
                <select {...register('city')} className="input">
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
              <input type="text" {...register('address')} className="input" />
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
              <input type="number" {...register('surface')} className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chambres
              </label>
              <input type="number" {...register('bedrooms')} className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Salles de bain
              </label>
              <input type="number" {...register('bathrooms')} className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Année
              </label>
              <input type="number" {...register('year_built')} className="input" />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="card p-6">
          <h2 className="font-semibold text-lg mb-4">Images</h2>

          {existingImages.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">Images existantes</p>
              <div className="grid grid-cols-3 gap-4">
                {existingImages.map((image) => (
                  <div key={image.id} className="relative">
                    <img
                      src={image.url}
                      alt=""
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(image.id)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500">
            <PhotoIcon className="w-10 h-10 text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">Ajouter des images</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          {newPreviews.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {newPreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt=""
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <button type="button" onClick={() => navigate(-1)} className="btn-outline">
            Annuler
          </button>
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditProperty
