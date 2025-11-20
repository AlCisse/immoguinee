# ImmoGuinée Frontend

Frontend React/Next.js pour la plateforme immobilière ImmoGuinée.

## Technologies

- **Next.js 14** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Axios** - HTTP client
- **React Hook Form** - Gestion des formulaires
- **Zod** - Validation des schémas

## Structure du projet

```
src/
├── app/              # App Router Next.js (pages et layouts)
├── components/       # Composants React réutilisables
│   ├── layout/      # Header, Footer, etc.
│   ├── ui/          # Composants UI de base
│   └── features/    # Composants spécifiques aux fonctionnalités
├── lib/             # Utilitaires et configurations
│   └── api-client.ts # Client API Axios
├── services/        # Services API (auth, properties, etc.)
├── hooks/           # Custom React hooks
├── types/           # Types TypeScript
├── store/           # Stores Zustand
└── utils/           # Fonctions utilitaires
```

## Installation

```bash
# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.local.example .env.local

# Configurer l'URL de l'API Laravel dans .env.local
# NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Développement

```bash
# Lancer le serveur de développement
npm run dev

# Ouvrir http://localhost:3000
```

## Build & Production

```bash
# Build pour la production
npm run build

# Lancer en mode production
npm start
```

## API Backend

Le frontend communique avec le backend Laravel via l'API REST :
- **Base URL**: `http://localhost:8000/api`
- **Authentication**: Bearer Token stocké dans localStorage
- **Endpoints**: Voir `/backend/routes/api.php`

## Authentification

L'authentification utilise :
- JWT tokens fournis par Laravel Sanctum
- Store Zustand pour la gestion de l'état utilisateur
- Intercepteurs Axios pour ajouter automatiquement les tokens

## Fonctionnalités principales

- Recherche et filtrage de propriétés
- Authentification (login/register/logout)
- Tableau de bord utilisateur
- Gestion des propriétés (CRUD)
- Upload d'images
- Système de favoris
- Création de contrats

## Scripts disponibles

- `npm run dev` - Développement
- `npm run build` - Build production
- `npm run start` - Serveur production
- `npm run lint` - Linter
- `npm run type-check` - Vérification TypeScript
