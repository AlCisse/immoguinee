// Types communs
export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'agent' | 'client' | 'owner'
  phone?: string
  avatar?: string
  created_at: string
  updated_at: string
}

export interface Property {
  id: number
  title: string
  description: string
  type: 'sale' | 'rent'
  property_type: 'house' | 'apartment' | 'land' | 'commercial'
  price: number
  area: number
  rooms?: number
  bathrooms?: number
  address: string
  city: string
  region: string
  latitude?: number
  longitude?: number
  images: PropertyImage[]
  amenities: string[]
  status: 'available' | 'pending' | 'sold' | 'rented'
  owner_id: number
  agent_id?: number
  created_at: string
  updated_at: string
}

export interface PropertyImage {
  id: number
  property_id: number
  url: string
  is_main: boolean
  order: number
}

export interface Contract {
  id: number
  property_id: number
  client_id: number
  type: 'sale' | 'rent'
  start_date: string
  end_date?: string
  amount: number
  status: 'draft' | 'active' | 'completed' | 'cancelled'
  signed_at?: string
  created_at: string
  updated_at: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
  status: 'success' | 'error'
}

export interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}
