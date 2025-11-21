/**
 * Utilitaires pour gérer les erreurs API de manière sécurisée
 */

import { AxiosError } from 'axios'

/**
 * Extrait le message d'erreur d'une réponse API
 * Gère les différents formats d'erreur de Laravel :
 * - message général
 * - erreur simple
 * - erreurs de validation (par champ)
 */
export function getErrorMessage(error: any, defaultMessage = 'Une erreur est survenue'): string {
  // Si ce n'est pas une erreur Axios, retourner le message par défaut
  if (!error || !error.response) {
    return error?.message || defaultMessage
  }

  const { data, status } = error.response

  // Message d'erreur direct
  if (data?.message) {
    return data.message
  }

  // Message d'erreur alternatif
  if (data?.error) {
    return data.error
  }

  // Erreurs de validation Laravel (format: { errors: { field: ["message"] } })
  if (data?.errors && typeof data.errors === 'object') {
    const errors = data.errors
    const firstField = Object.keys(errors)[0]

    if (firstField && Array.isArray(errors[firstField])) {
      // Retourne la première erreur du premier champ
      return errors[firstField][0]
    }

    if (firstField && typeof errors[firstField] === 'string') {
      return errors[firstField]
    }
  }

  // Messages selon le code HTTP
  switch (status) {
    case 400:
      return 'Requête invalide. Veuillez vérifier vos données.'
    case 401:
      return 'Vous devez être connecté pour effectuer cette action.'
    case 403:
      return 'Vous n\'avez pas la permission d\'effectuer cette action.'
    case 404:
      return 'Ressource non trouvée.'
    case 422:
      return 'Données de validation invalides. Veuillez vérifier vos informations.'
    case 429:
      return 'Trop de requêtes. Veuillez réessayer dans quelques instants.'
    case 500:
      return 'Erreur serveur. Veuillez réessayer plus tard.'
    case 503:
      return 'Service temporairement indisponible. Veuillez réessayer plus tard.'
    default:
      return defaultMessage
  }
}

/**
 * Extrait toutes les erreurs de validation sous forme d'objet
 * Format: { field: "message d'erreur" }
 */
export function getValidationErrors(error: any): Record<string, string> {
  if (!error?.response?.data?.errors) {
    return {}
  }

  const errors = error.response.data.errors
  const validationErrors: Record<string, string> = {}

  for (const field in errors) {
    if (Array.isArray(errors[field]) && errors[field].length > 0) {
      validationErrors[field] = errors[field][0]
    } else if (typeof errors[field] === 'string') {
      validationErrors[field] = errors[field]
    }
  }

  return validationErrors
}

/**
 * Vérifie si l'erreur est une erreur de validation
 */
export function isValidationError(error: any): boolean {
  return error?.response?.status === 422 &&
         error?.response?.data?.errors &&
         typeof error.response.data.errors === 'object'
}

/**
 * Vérifie si l'erreur est une erreur réseau
 */
export function isNetworkError(error: any): boolean {
  return !error?.response && error?.request
}

/**
 * Formate toutes les erreurs de validation en une seule chaîne
 */
export function formatValidationErrors(error: any): string {
  const errors = getValidationErrors(error)
  const messages = Object.values(errors)

  if (messages.length === 0) {
    return getErrorMessage(error)
  }

  if (messages.length === 1) {
    return messages[0]
  }

  // Retourne toutes les erreurs séparées par des points
  return messages.join('. ')
}
