'use client'

import { useState } from 'react'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'

interface PropertyFiltersProps {
  onFilter: (filters: any) => void
}

export default function PropertyFilters({ onFilter }: PropertyFiltersProps) {
  const [filters, setFilters] = useState({
    type: '',
    property_type: '',
    city: '',
    min_price: '',
    max_price: '',
    rooms: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== '')
    )
    onFilter(cleanFilters)
  }

  const handleReset = () => {
    setFilters({
      type: '',
      property_type: '',
      city: '',
      min_price: '',
      max_price: '',
      rooms: '',
    })
    onFilter({})
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Filtres de recherche</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <Select
          label="Type de transaction"
          name="type"
          value={filters.type}
          onChange={handleChange}
          options={[
            { value: '', label: 'Tous' },
            { value: 'sale', label: 'À vendre' },
            { value: 'rent', label: 'À louer' },
          ]}
        />

        <Select
          label="Type de propriété"
          name="property_type"
          value={filters.property_type}
          onChange={handleChange}
          options={[
            { value: '', label: 'Tous' },
            { value: 'house', label: 'Maison' },
            { value: 'apartment', label: 'Appartement' },
            { value: 'land', label: 'Terrain' },
            { value: 'commercial', label: 'Commercial' },
          ]}
        />

        <Input
          label="Ville"
          type="text"
          name="city"
          value={filters.city}
          onChange={handleChange}
          placeholder="Ex: Conakry"
        />

        <Input
          label="Prix minimum (GNF)"
          type="number"
          name="min_price"
          value={filters.min_price}
          onChange={handleChange}
          placeholder="0"
        />

        <Input
          label="Prix maximum (GNF)"
          type="number"
          name="max_price"
          value={filters.max_price}
          onChange={handleChange}
          placeholder="1000000000"
        />

        <Select
          label="Nombre de chambres"
          name="rooms"
          value={filters.rooms}
          onChange={handleChange}
          options={[
            { value: '', label: 'Tous' },
            { value: '1', label: '1+' },
            { value: '2', label: '2+' },
            { value: '3', label: '3+' },
            { value: '4', label: '4+' },
            { value: '5', label: '5+' },
          ]}
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          Rechercher
        </Button>
        <Button type="button" variant="outline" onClick={handleReset}>
          Réinitialiser
        </Button>
      </div>
    </form>
  )
}
