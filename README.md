# 🏠 Plateforme Immobilière Guinée - Configuration Docker

## 📋 Prérequis

- Docker Desktop installé (https://www.docker.com/products/docker-desktop)
- Au moins 8GB de RAM disponible
- Au moins 20GB d'espace disque

## 🚀 Démarrage Rapide

### 1. Structure des dossiers

Créez la structure suivante à la racine de votre projet :

```
immo-guinee/
├── docker-compose.yml
├── docker/
│   ├── php/
│   │   ├── Dockerfile
│   │   └── local.ini
│   ├── nginx/
│   │   └── nginx.conf
│   └── postgres/
│       └── init.sql
├── backend/          (sera créé pour Laravel)
├── frontend/         (sera créé pour React)
├── mobile/           (sera créé pour React Native)
└── n8n/
    └── workflows/
```

### 2. Lancer les services

```bash
# Démarrer tous les services
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter les services
docker-compose down

# Arrêter et supprimer les volumes (⚠️ supprime les données)
docker-compose down -v
```

### 3. Vérifier que tout fonctionne

Après le démarrage, vous devriez pouvoir accéder à :

| Service | URL | Identifiants |
|---------|-----|--------------|
| **Laravel API** | http://localhost:8080 | - |
| **React Web** | http://localhost:3000 | - |
| **pgAdmin** | http://localhost:8081 | admin@immguinee.local / admin123 |
| **n8n** | http://localhost:5678 | admin / admin123 |
| **MailHog** | http://localhost:8025 | - |
| **MinIO** | http://localhost:9001 | minio_admin / minio_password_123 |
| **Elasticsearch** | http://localhost:9200 | - |

### 4. Configuration PostgreSQL dans pgAdmin

1. Ouvrez http://localhost:8081
2. Connectez-vous avec : `admin@immguinee.local` / `admin123`
3. Ajoutez un serveur :
   - **Name** : Immo Guinée DB
   - **Host** : postgres
   - **Port** : 5432
   - **Database** : immo_guinee_db
   - **Username** : immo_user
   - **Password** : immo_pass_secure_123

## 📦 Installer Laravel

```bash
# Entrer dans le conteneur PHP
docker-compose exec app bash

# Créer un nouveau projet Laravel
composer create-project laravel/laravel .

# Configurer les permissions
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

# Copier le fichier .env
cp .env.example .env

# Générer la clé d'application
php artisan key:generate
```

### Configuration .env pour Laravel

```env
APP_NAME="Immo Guinée"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8080

DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=immo_guinee_db
DB_USERNAME=immo_user
DB_PASSWORD=immo_pass_secure_123

CACHE_DRIVER=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis

REDIS_HOST=redis
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=mailhog
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null

SCOUT_DRIVER=elasticsearch
ELASTICSEARCH_HOST=http://elasticsearch:9200

FILESYSTEM_DISK=minio
AWS_ACCESS_KEY_ID=minio_admin
AWS_SECRET_ACCESS_KEY=minio_password_123
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=immo-guinee
AWS_ENDPOINT=http://minio:9000
AWS_USE_PATH_STYLE_ENDPOINT=true
```

## 📱 Installer React (Frontend Web)

```bash
# Dans le dossier frontend/
npx create-react-app .

# Installer les dépendances essentielles
npm install axios react-router-dom @tanstack/react-query
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## 📲 Installer React Native (Mobile)

```bash
# Dans le dossier mobile/
npx create-expo-app .

# Installer les dépendances essentielles
npm install axios react-native-paper
npm install @react-navigation/native @react-navigation/stack
npm install expo-location expo-camera expo-image-picker
```

## 🤖 Agents IA avec n8n

Accédez à n8n sur http://localhost:5678 pour créer vos agents IA :

### Exemples d'agents à créer :

1. **Agent Modération d'Annonces** : Vérifie automatiquement les annonces
2. **Agent Recherche Intelligente** : Améliore les résultats de recherche
3. **Agent Notifications** : Envoie SMS/Email/Push
4. **Agent Analytics** : Collecte et analyse les données
5. **Agent Support** : Chatbot pour assistance utilisateurs

## 🔧 Commandes Utiles

### Docker

```bash
# Redémarrer un service spécifique
docker-compose restart app

# Voir les logs d'un service
docker-compose logs -f app

# Entrer dans un conteneur
docker-compose exec app bash
docker-compose exec postgres psql -U immo_user -d immo_guinee_db

# Nettoyer tout
docker-compose down -v
docker system prune -a
```

### Laravel

```bash
# Migrations
php artisan migrate
php artisan migrate:fresh --seed

# Cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Queue
php artisan queue:work
php artisan queue:restart

# Tinker (console interactive)
php artisan tinker
```

### PostgreSQL

```bash
# Connexion à la base
docker-compose exec postgres psql -U immo_user -d immo_guinee_db

# Backup
docker-compose exec postgres pg_dump -U immo_user immo_guinee_db > backup.sql

# Restore
docker-compose exec -T postgres psql -U immo_user -d immo_guinee_db < backup.sql
```

## 🐛 Dépannage

### Les conteneurs ne démarrent pas

```bash
# Vérifier les logs
docker-compose logs

# Reconstruire les images
docker-compose build --no-cache
docker-compose up -d
```

### Erreur de permissions Laravel

```bash
docker-compose exec app chmod -R 775 storage bootstrap/cache
docker-compose exec app chown -R www-data:www-data storage bootstrap/cache
```

### PostgreSQL ne se connecte pas

```bash
# Vérifier que le conteneur tourne
docker-compose ps postgres

# Tester la connexion
docker-compose exec postgres pg_isready -U immo_user
```

## 📊 Ressources et RAM

Configuration minimale recommandée :

- **CPU** : 4 cœurs
- **RAM** : 8GB (12GB recommandé)
- **Disque** : 20GB libre

Pour réduire l'utilisation RAM, vous pouvez désactiver temporairement certains services :

```bash
# Arrêter Elasticsearch (recherche)
docker-compose stop elasticsearch

# Arrêter MinIO (si vous utilisez un autre stockage)
docker-compose stop minio
```

## 🎯 Prochaines Étapes

1. ✅ Configurer Laravel avec PostgreSQL
2. ✅ Créer les migrations de base de données
3. ✅ Installer et configurer React
4. ✅ Créer les premiers agents IA dans n8n
5. ✅ Développer l'API Laravel
6. ✅ Développer le frontend React
7. ✅ Tester l'application mobile

## 📞 Support

Pour toute question, consultez la documentation officielle :

- Laravel : https://laravel.com/docs
- React : https://react.dev
- React Native : https://reactnative.dev
- n8n : https://docs.n8n.io
- PostgreSQL : https://www.postgresql.org/docs
