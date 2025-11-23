import { apiClient } from '@/lib/api-client'
import { Property, ApiResponse, PaginatedResponse } from '@/types'

interface PropertyFilters {
  type?: 'sale' | 'rent'
  property_type?: string
  min_price?: number
  max_price?: number
  min_area?: number
  max_area?: number
  city?: string
  region?: string
  rooms?: number
  page?: number
  per_page?: number
}

export const propertyService = {
  async getProperties(filters?: PropertyFilters): Promise<PaginatedResponse<Property>> {
    const response = await apiClient.get<PaginatedResponse<Property>>('/v1/properties', {
      params: filters,
    })
    return response
  },

  async getProperty(id: number): Promise<Property> {
    const response = await apiClient.get<ApiResponse<Property>>(`/v1/properties/${id}`)
    return response.data
  },

  async createProperty(data: Partial<Property>): Promise<Property> {
    const response = await apiClient.post<ApiResponse<Property>>('/v1/properties', data)
    return response.data
  },

  async updateProperty(id: number, data: Partial<Property>): Promise<Property> {
    const response = await apiClient.put<ApiResponse<Property>>(`/v1/properties/${id}`, data)
    return response.data
  },

  async deleteProperty(id: number): Promise<void> {
    await apiClient.delete(`/v1/properties/${id}`)
  },

  async uploadImages(propertyId: number, files: File[]): Promise<void> {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('images[]', file)
    })

    await apiClient.post(`/v1/properties/${propertyId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  async deleteImage(propertyId: number, imageId: number): Promise<void> {
    await apiClient.delete(`/v1/properties/${propertyId}/images/${imageId}`)
  },
}
