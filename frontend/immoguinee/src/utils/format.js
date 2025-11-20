export function formatPrice(price) {
  if (!price) return '0 GNF'
  return new Intl.NumberFormat('fr-GN', {
    style: 'currency',
    currency: 'GNF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatDate(date) {
  if (!date) return ''
  return new Intl.DateTimeFormat('fr-GN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date) {
  if (!date) return ''
  return new Intl.DateTimeFormat('fr-GN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function formatRelativeTime(date) {
  if (!date) return ''
  const now = new Date()
  const past = new Date(date)
  const diffMs = now - past
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) return "À l'instant"
  if (diffMin < 60) return `Il y a ${diffMin} min`
  if (diffHour < 24) return `Il y a ${diffHour} h`
  if (diffDay < 7) return `Il y a ${diffDay} j`
  return formatDate(date)
}

export function formatPhoneNumber(phone) {
  if (!phone) return ''
  // Format: +224 620 00 00 00
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 9) {
    return `+224 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 7)} ${cleaned.slice(7)}`
  }
  return phone
}

export function getPropertyTypeLabel(type) {
  const types = {
    house: 'Maison',
    apartment: 'Appartement',
    land: 'Terrain',
    commercial: 'Commercial',
    office: 'Bureau',
  }
  return types[type] || type
}

export function getTransactionTypeLabel(type) {
  const types = {
    sale: 'Vente',
    rent: 'Location',
  }
  return types[type] || type
}

export function getStatusLabel(status) {
  const statuses = {
    draft: 'Brouillon',
    published: 'Publié',
    sold: 'Vendu/Loué',
    archived: 'Archivé',
  }
  return statuses[status] || status
}

export function getStatusColor(status) {
  const colors = {
    draft: 'bg-gray-100 text-gray-800',
    published: 'bg-green-100 text-green-800',
    sold: 'bg-blue-100 text-blue-800',
    archived: 'bg-red-100 text-red-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}
