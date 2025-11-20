# 📡 LISTE DES ENDPOINTS API - Immo Guinée

**Base URL :** `http://localhost/api/v1` (ou votre domaine)

**Authentification :** Token Bearer (Laravel Sanctum) pour les routes protégées

---

## 🔓 ROUTES PUBLIQUES (Sans authentification)

### 🔐 Authentification

| Méthode | Endpoint | Description | Paramètres |
|---------|----------|-------------|------------|
| `POST` | `/api/v1/auth/register` | Inscription d'un nouvel utilisateur | `name`, `email`, `password`, `password_confirmation`, `phone` (opt), `role` (opt) |
| `POST` | `/api/v1/auth/login` | Connexion utilisateur | `email`, `password`, `remember` (opt) |
| `POST` | `/api/v1/auth/forgot-password` | Demande de réinitialisation mot de passe | `email` |
| `POST` | `/api/v1/auth/reset-password` | Réinitialisation mot de passe | `token`, `email`, `password`, `password_confirmation` |

### 🏠 Propriétés (Lecture seule)

| Méthode | Endpoint | Description | Paramètres Query |
|---------|----------|-------------|------------------|
| `GET` | `/api/v1/properties` | Liste paginée des propriétés publiées | `per_page` (opt, max 100) |
| `GET` | `/api/v1/properties/search` | Recherche avancée de propriétés | `type`, `transaction_type`, `price_min`, `price_max`, `surface_min`, `surface_max`, `bedrooms`, `bathrooms`, `location_id`, `query`, `sort_by`, `sort_order`, `per_page` |
| `GET` | `/api/v1/properties/featured` | Propriétés en vedette | `limit` (opt, max 20) |
| `GET` | `/api/v1/properties/{id}` | Détails d'une propriété | - |

### 📍 Localisations

| Méthode | Endpoint | Description | Paramètres Query |
|---------|----------|-------------|------------------|
| `GET` | `/api/v1/locations` | Liste des localisations | `type`, `parent_id`, `search` |
| `GET` | `/api/v1/locations/cities` | Liste des villes principales | - |
| `GET` | `/api/v1/locations/districts/{city}` | Quartiers d'une ville | - |
| `GET` | `/api/v1/locations/{id}` | Détails d'une localisation | - |

### 💬 Messages (Contact)

| Méthode | Endpoint | Description | Paramètres Body |
|---------|----------|-------------|-----------------|
| `POST` | `/api/v1/messages/contact` | Envoyer un message de contact (sans auth) | `property_id`, `name`, `email`, `phone` (opt), `subject`, `body` |

### 🏥 Health Check

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/health` | Vérification de l'état de l'API |

---

## 🔒 ROUTES PROTÉGÉES (Authentification requise)

**Header requis :** `Authorization: Bearer {token}`

### 🔐 Authentification (Protégées)

| Méthode | Endpoint | Description | Paramètres |
|---------|----------|-------------|------------|
| `POST` | `/api/v1/auth/logout` | Déconnexion (révoque le token) | - |
| `GET` | `/api/v1/auth/me` | Informations de l'utilisateur connecté | - |
| `POST` | `/api/v1/auth/refresh` | Rafraîchir le token | - |

### 👤 Profil Utilisateur

| Méthode | Endpoint | Description | Paramètres Body |
|---------|----------|-------------|-----------------|
| `GET` | `/api/v1/profile` | Récupérer le profil | - |
| `PUT` | `/api/v1/profile` | Mettre à jour le profil | `name`, `email`, `phone`, `bio` |
| `PUT` | `/api/v1/profile/password` | Changer le mot de passe | `current_password`, `password`, `password_confirmation` |
| `POST` | `/api/v1/profile/avatar` | Upload avatar | `avatar` (file) |
| `DELETE` | `/api/v1/profile/avatar` | Supprimer avatar | - |

### 🏠 Propriétés (Gestion complète)

| Méthode | Endpoint | Description | Paramètres | Rôle requis |
|---------|----------|-------------|------------|-------------|
| `GET` | `/api/v1/properties/my-properties` | Mes propriétés | `per_page` (opt) | Tous |
| `POST` | `/api/v1/properties` | Créer une propriété | Voir ci-dessous | Agent/Admin |
| `PUT` | `/api/v1/properties/{id}` | Modifier une propriété | Voir ci-dessous | Propriétaire/Admin |
| `DELETE` | `/api/v1/properties/{id}` | Supprimer une propriété | - | Propriétaire/Admin |
| `POST` | `/api/v1/properties/{id}/images` | Upload images | `images[]` (files, max 10) | Propriétaire/Admin |
| `DELETE` | `/api/v1/properties/{id}/images/{image}` | Supprimer une image | - | Propriétaire/Admin |
| `PATCH` | `/api/v1/properties/{id}/publish` | Publier une propriété | - | Propriétaire/Admin |
| `PATCH` | `/api/v1/properties/{id}/unpublish` | Dépublier une propriété | - | Propriétaire/Admin |
| `PATCH` | `/api/v1/properties/{id}/sold` | Marquer comme vendue | - | Propriétaire/Admin |

**Paramètres pour créer/modifier une propriété :**
```json
{
  "title": "string (required)",
  "description": "string (required, min 50 chars)",
  "type": "apartment|house|villa|land|office|shop (required)",
  "transaction_type": "sale|rent (required)",
  "price": "number (required, min 0)",
  "surface": "number (required, min 0)",
  "bedrooms": "integer (optional, 0-20)",
  "bathrooms": "integer (optional, 0-10)",
  "location_id": "integer (required, exists)",
  "address": "string (optional, max 500)",
  "features": "array (optional)",
  "latitude": "number (optional, -90 to 90)",
  "longitude": "number (optional, -180 to 180)",
  "is_featured": "boolean (optional)"
}
```

### ⭐ Favoris

| Méthode | Endpoint | Description | Paramètres |
|---------|----------|-------------|------------|
| `GET` | `/api/v1/favorites` | Liste des favoris | `per_page` (opt) |
| `POST` | `/api/v1/favorites/{propertyId}` | Ajouter aux favoris | - |
| `DELETE` | `/api/v1/favorites/{propertyId}` | Retirer des favoris | - |
| `GET` | `/api/v1/favorites/check/{propertyId}` | Vérifier si favori | - |

### 💬 Messages (Utilisateurs authentifiés)

| Méthode | Endpoint | Description | Paramètres |
|---------|----------|-------------|------------|
| `GET` | `/api/v1/messages` | Liste des messages | `per_page` (opt, max 100) |
| `GET` | `/api/v1/messages/{id}` | Détails d'un message | - |
| `POST` | `/api/v1/messages` | Envoyer un message | `receiver_id`, `property_id` (opt), `subject` (opt), `content` |
| `PATCH` | `/api/v1/messages/{id}/read` | Marquer comme lu | - |
| `DELETE` | `/api/v1/messages/{id}` | Supprimer un message | - |
| `GET` | `/api/v1/messages/conversations` | Liste des conversations | - |
| `GET` | `/api/v1/messages/conversations/{userId}` | Conversation avec un utilisateur | `per_page` (opt) |

---

## 👑 ROUTES ADMIN (Admin uniquement)

**Header requis :** `Authorization: Bearer {token}` + Rôle admin

### 📍 Gestion Localisations

| Méthode | Endpoint | Description | Paramètres Body |
|---------|----------|-------------|-----------------|
| `POST` | `/api/v1/admin/locations` | Créer une localisation | `name`, `type`, `parent_id` (opt), `latitude` (opt), `longitude` (opt) |
| `PUT` | `/api/v1/admin/locations/{id}` | Modifier une localisation | `name`, `type`, `parent_id`, `latitude`, `longitude` |
| `DELETE` | `/api/v1/admin/locations/{id}` | Supprimer une localisation | - |

### 👥 Gestion Utilisateurs

| Méthode | Endpoint | Description | Paramètres |
|---------|----------|-------------|------------|
| `GET` | `/api/v1/admin/users` | Liste des utilisateurs | `per_page` (opt) |
| `GET` | `/api/v1/admin/users/{id}` | Détails d'un utilisateur | - |
| `PATCH` | `/api/v1/admin/users/{id}/role` | Modifier le rôle | `role` |
| `PATCH` | `/api/v1/admin/users/{id}/block` | Bloquer un utilisateur | - |
| `PATCH` | `/api/v1/admin/users/{id}/unblock` | Débloquer un utilisateur | - |
| `DELETE` | `/api/v1/admin/users/{id}` | Supprimer un utilisateur | - |

### 📊 Statistiques

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/v1/admin/stats/dashboard` | Statistiques du dashboard |
| `GET` | `/api/v1/admin/stats/properties` | Statistiques des propriétés |
| `GET` | `/api/v1/admin/stats/users` | Statistiques des utilisateurs |

---

## 📝 EXEMPLES DE REQUÊTES

### Inscription
```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "phone": "+224 612 34 56 78",
  "role": "client"
}
```

### Connexion
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Créer une propriété
```bash
POST /api/v1/properties
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Villa moderne à vendre",
  "description": "Belle villa de 5 chambres avec piscine et jardin...",
  "type": "villa",
  "transaction_type": "sale",
  "price": 250000,
  "surface": 300,
  "bedrooms": 5,
  "bathrooms": 3,
  "location_id": 1,
  "address": "Quartier Kaloum, Conakry",
  "features": ["parking", "garden", "pool", "security"]
}
```

### Recherche de propriétés
```bash
GET /api/v1/properties/search?type=apartment&transaction_type=rent&price_min=200&price_max=800&location_id=1&sort_by=price&sort_order=asc
```

### Upload d'images
```bash
POST /api/v1/properties/1/images
Authorization: Bearer {token}
Content-Type: multipart/form-data

images[]: [file1.jpg, file2.jpg, ...]
```

---

## 🔑 CODES DE RÉPONSE

| Code | Signification |
|------|---------------|
| `200` | Succès |
| `201` | Créé avec succès |
| `400` | Requête invalide |
| `401` | Non authentifié |
| `403` | Non autorisé |
| `404` | Ressource non trouvée |
| `422` | Erreur de validation |
| `500` | Erreur serveur |

---

## 📋 FORMAT DES RÉPONSES

### Succès
```json
{
  "success": true,
  "message": "Message de succès",
  "data": {
    // Données
  }
}
```

### Erreur
```json
{
  "success": false,
  "message": "Message d'erreur",
  "errors": {
    "field": ["Message d'erreur"]
  }
}
```

---

**Dernière mise à jour :** 2025-01-XX

