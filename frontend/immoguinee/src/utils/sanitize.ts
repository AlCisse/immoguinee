/**
 * Utilitaires de sécurité pour prévenir les attaques XSS
 * et injection de code malveillant
 */

/**
 * Échappe les caractères HTML dangereux pour prévenir XSS
 * @param text - Le texte à échapper
 * @returns Le texte sécurisé
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  }
  return text.replace(/[&<>"'/]/g, (char) => map[char] || char)
}

/**
 * Sanitize une chaîne pour utilisation dans les attributs HTML
 * @param str - La chaîne à sanitizer
 * @returns La chaîne sécurisée
 */
export function sanitizeAttribute(str: string): string {
  return str.replace(/[^\w\s-]/gi, '')
}

/**
 * Valide une URL pour s'assurer qu'elle est sûre
 * @param url - L'URL à valider
 * @returns true si l'URL est sûre
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url)
    // N'autorise que http, https, et mailto
    return ['http:', 'https:', 'mailto:'].includes(parsedUrl.protocol)
  } catch {
    return false
  }
}

/**
 * Sanitize une URL pour prévenir les attaques javascript:
 * @param url - L'URL à sanitizer
 * @returns L'URL sécurisée ou '#'
 */
export function sanitizeUrl(url: string): string {
  if (!url) return '#'

  // Supprime les espaces
  const trimmedUrl = url.trim()

  // Vérifie si l'URL est valide
  if (isValidUrl(trimmedUrl)) {
    return trimmedUrl
  }

  // Si l'URL commence par javascript: ou data:, on la rejette
  if (/^(javascript|data|vbscript):/i.test(trimmedUrl)) {
    return '#'
  }

  return trimmedUrl
}

/**
 * Nettoie le contenu utilisateur pour affichage sécurisé
 * @param content - Le contenu à nettoyer
 * @returns Le contenu nettoyé
 */
export function sanitizeUserContent(content: string): string {
  // Échappe tout le HTML
  let sanitized = escapeHtml(content)

  // Autorise seulement certaines balises sûres (optionnel)
  // Pour un affichage en texte pur, on garde juste l'échappement HTML

  return sanitized
}

/**
 * Valide et nettoie un email
 * @param email - L'email à valider
 * @returns L'email nettoyé ou null si invalide
 */
export function sanitizeEmail(email: string): string | null {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  const trimmed = email.trim().toLowerCase()

  if (emailRegex.test(trimmed)) {
    return trimmed
  }

  return null
}

/**
 * Valide et nettoie un numéro de téléphone
 * @param phone - Le numéro à valider
 * @returns Le numéro nettoyé
 */
export function sanitizePhone(phone: string): string {
  // Garde seulement les chiffres, +, -, (, ), et espaces
  return phone.replace(/[^\d+\-() ]/g, '')
}

/**
 * Limite la longueur d'une chaîne pour prévenir les attaques DoS
 * @param str - La chaîne à limiter
 * @param maxLength - Longueur maximale
 * @returns La chaîne tronquée
 */
export function limitLength(str: string, maxLength: number = 1000): string {
  return str.slice(0, maxLength)
}

/**
 * Sanitize les données de recherche/filtres
 * @param searchTerm - Le terme de recherche
 * @returns Le terme nettoyé
 */
export function sanitizeSearchTerm(searchTerm: string): string {
  // Supprime les caractères spéciaux SQL/NoSQL
  return searchTerm
    .trim()
    .replace(/[<>'"`;\\]/g, '')
    .slice(0, 100) // Limite à 100 caractères
}
