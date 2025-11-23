import { apiClient } from '@/lib/api-client'
import { User, ApiResponse } from '@/types'

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
  phone?: string
  role?: 'client' | 'owner' | 'agent'
}

interface AuthResponse {
  user: User
  token: string
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/v1/auth/login',
      credentials
    )

    if (response.data.token) {
      apiClient.setAuthToken(response.data.token)
    }

    return response.data
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/v1/auth/register',
      data
    )

    if (response.data.token) {
      apiClient.setAuthToken(response.data.token)
    }

    return response.data
  },

  async logout(): Promise<void> {
    await apiClient.post('/v1/auth/logout')
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>('/v1/auth/me')
    return response.data
  },

  async forgotPassword(email: string): Promise<void> {
    await apiClient.post('/v1/auth/forgot-password', { email })
  },

  async resetPassword(token: string, email: string, password: string): Promise<void> {
    await apiClient.post('/v1/auth/reset-password', {
      token,
      email,
      password,
      password_confirmation: password,
    })
  },
}
