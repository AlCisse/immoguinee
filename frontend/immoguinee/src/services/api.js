import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api/v1'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Intercepteur pour ajouter le token aux requêtes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Intercepteur pour gérer les réponses et erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ============================================================================
// AUTHENTIFICATION
// ============================================================================

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  refresh: () => api.post('/auth/refresh'),
}

// ============================================================================
// PROFIL UTILISATEUR
// ============================================================================

export const profileService = {
  get: () => api.get('/profile'),
  update: (data) => api.put('/profile', data),
  updatePassword: (data) => api.put('/profile/password', data),
  uploadAvatar: (file) => {
    const formData = new FormData()
    formData.append('avatar', file)
    return api.post('/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  deleteAvatar: () => api.delete('/profile/avatar'),
}

// ============================================================================
// PROPRIÉTÉS
// ============================================================================

export const propertyService = {
  // Routes publiques
  getAll: (params) => api.get('/properties', { params }),
  search: (params) => api.get('/properties/search', { params }),
  getFeatured: () => api.get('/properties/featured'),
  getById: (id) => api.get(`/properties/${id}`),

  // Routes protégées
  getMyProperties: () => api.get('/properties/my-properties'),
  create: (data) => api.post('/properties', data),
  update: (id, data) => api.put(`/properties/${id}`, data),
  delete: (id) => api.delete(`/properties/${id}`),

  // Images
  uploadImages: (id, files) => {
    const formData = new FormData()
    files.forEach((file) => formData.append('images[]', file))
    return api.post(`/properties/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  deleteImage: (propertyId, imageId) =>
    api.delete(`/properties/${propertyId}/images/${imageId}`),

  // Statut
  publish: (id) => api.patch(`/properties/${id}/publish`),
  unpublish: (id) => api.patch(`/properties/${id}/unpublish`),
  markAsSold: (id) => api.patch(`/properties/${id}/sold`),
}

// ============================================================================
// LOCALISATIONS
// ============================================================================

export const locationService = {
  getAll: () => api.get('/locations'),
  getCities: () => api.get('/locations/cities'),
  getDistricts: (city) => api.get(`/locations/districts/${city}`),
  getById: (id) => api.get(`/locations/${id}`),
}

// ============================================================================
// FAVORIS
// ============================================================================

export const favoriteService = {
  getAll: () => api.get('/favorites'),
  add: (propertyId) => api.post(`/favorites/${propertyId}`),
  remove: (propertyId) => api.delete(`/favorites/${propertyId}`),
  check: (propertyId) => api.get(`/favorites/check/${propertyId}`),
}

// ============================================================================
// MESSAGES
// ============================================================================

export const messageService = {
  getAll: () => api.get('/messages'),
  getById: (id) => api.get(`/messages/${id}`),
  send: (data) => api.post('/messages', data),
  sendContact: (data) => api.post('/messages/contact', data),
  markAsRead: (id) => api.patch(`/messages/${id}/read`),
  delete: (id) => api.delete(`/messages/${id}`),
  getConversations: () => api.get('/messages/conversations'),
  getConversation: (userId) => api.get(`/messages/conversations/${userId}`),
}

// ============================================================================
// CONTRATS
// ============================================================================

export const contractService = {
  getAll: () => api.get('/contracts'),
  getById: (id) => api.get(`/contracts/${id}`),
  generateLocation: (propertyId, data) =>
    api.post(`/contracts/properties/${propertyId}/location`, data),
  generateSale: (propertyId, data) =>
    api.post(`/contracts/properties/${propertyId}/sale`, data),
  send: (id) => api.post(`/contracts/${id}/send`),
  proposeAmendment: (id, data) => api.post(`/contracts/${id}/amendments`, data),
  respondToAmendment: (contractId, amendmentId, data) =>
    api.patch(`/contracts/${contractId}/amendments/${amendmentId}`, data),
  retract: (id, data) => api.post(`/contracts/${id}/retract`, data),
}

// ============================================================================
// SIGNATURES ÉLECTRONIQUES
// ============================================================================

export const signatureService = {
  requestOTP: (contractId) => api.post(`/signatures/contracts/${contractId}/request-otp`),
  sign: (contractId, signatureId, data) =>
    api.post(`/signatures/contracts/${contractId}/sign/${signatureId}`, data),
  getStatus: (contractId) => api.get(`/signatures/contracts/${contractId}/status`),
}

// ============================================================================
// TRANSACTIONS
// ============================================================================

export const transactionService = {
  getAll: () => api.get('/transactions'),
  getPending: () => api.get('/transactions/pending'),
  getById: (id) => api.get(`/transactions/${id}`),
  pay: (id, data) => api.post(`/transactions/${id}/pay`, data),
}

// ============================================================================
// MÉDIATION
// ============================================================================

export const mediationService = {
  getDisputes: () => api.get('/mediation/disputes'),
  getDispute: (id) => api.get(`/mediation/disputes/${id}`),
  createDispute: (contractId, data) =>
    api.post(`/mediation/contracts/${contractId}/dispute`, data),
}

// ============================================================================
// VÉRIFICATION DOCUMENTS
// ============================================================================

export const verificationService = {
  getByProperty: (propertyId) => api.get(`/verifications/properties/${propertyId}`),
  upload: (propertyId, data) => {
    const formData = new FormData()
    formData.append('document', data.document)
    formData.append('type', data.type)
    return api.post(`/verifications/properties/${propertyId}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  getById: (id) => api.get(`/verifications/${id}`),
}

// ============================================================================
// ADMIN
// ============================================================================

export const adminService = {
  // Utilisateurs
  getUsers: (params) => api.get('/admin/users', { params }),
  getUser: (id) => api.get(`/admin/users/${id}`),
  updateUserRole: (id, role) => api.patch(`/admin/users/${id}/role`, { role }),
  blockUser: (id) => api.patch(`/admin/users/${id}/block`),
  unblockUser: (id) => api.patch(`/admin/users/${id}/unblock`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),

  // Localisations
  createLocation: (data) => api.post('/admin/locations', data),
  updateLocation: (id, data) => api.put(`/admin/locations/${id}`, data),
  deleteLocation: (id) => api.delete(`/admin/locations/${id}`),

  // Statistiques
  getDashboardStats: () => api.get('/admin/stats/dashboard'),
  getPropertyStats: () => api.get('/admin/stats/properties'),
  getUserStats: () => api.get('/admin/stats/users'),
}

export default api
