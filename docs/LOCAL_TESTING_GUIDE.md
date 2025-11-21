# 🧪 Guide de Test Local - Architecture Docker Optimisée

## 📋 Objectif

Tester **toute l'architecture Docker optimisée en local** avant de déployer sur le VPS OVH en production.

---

## ✅ Prérequis

**Sur votre machine locale :**

- Docker Desktop installé (version récente)
- Docker Compose V2
- Git
- Au moins 8GB RAM disponibles
- 20GB d'espace disque libre

### Vérifier les versions

```bash
# Depuis /home/user/immoguinee
cd /home/user/immoguinee

# Vérifier Docker
docker --version
# Doit afficher : Docker version 24.x ou supérieur

# Vérifier Docker Compose
docker compose version
# Doit afficher : Docker Compose version v2.x ou supérieur

# Vérifier l'espace disque
df -h .
# Doit montrer au moins 20GB disponibles
```

---

## 🚀 Étape 1 : Préparer l'Environnement Local

### 1.1 Créer le fichier .env pour Laravel

```bash
# Dans le dossier /home/user/immoguinee
cd /home/user/immoguinee/backend

# Copier le fichier d'exemple
cp .env.example .env

# Éditer le fichier .env
nano .env
```

**Configuration pour les tests locaux :**

```env
APP_NAME="Immo Guinée Local"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8080

DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=immo_guinee_db
DB_USERNAME=immo_user
DB_PASSWORD=immo_pass_local_123

CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

REDIS_HOST=redis
REDIS_PASSWORD=null
REDIS_PORT=6379
```

### 1.2 Générer la clé Laravel

```bash
# Depuis /home/user/immoguinee/backend
cd /home/user/immoguinee/backend

# Installer les dépendances Composer
docker run --rm -v $(pwd):/app -w /app composer:2.7 composer install

# Générer la clé APP_KEY
docker run --rm -v $(pwd):/app -w /app php:8.2-cli php artisan key:generate

# La clé sera automatiquement ajoutée au fichier .env
cat .env | grep APP_KEY
```

---

## 🐳 Étape 2 : Build les Images Docker

```bash
# Retour à la racine du projet
cd /home/user/immoguinee

# Build les images Docker (peut prendre 5-10 minutes)
docker compose -f docker-compose.local.yml build --no-cache

# Vérifier que les images sont créées
docker images | grep immoguinee
```

**Vous devriez voir :**

```
immoguinee/laravel    local    <IMAGE_ID>    X minutes ago    ~350MB
immoguinee/nextjs     local    <IMAGE_ID>    X minutes ago    ~180MB
```

---

## ▶️ Étape 3 : Démarrer les Services

### 3.1 Démarrer tous les containers

```bash
# Depuis /home/user/immoguinee
cd /home/user/immoguinee

# Démarrer en mode détaché
docker compose -f docker-compose.local.yml up -d

# Voir les logs en temps réel
docker compose -f docker-compose.local.yml logs -f
```

**Appuyez sur `Ctrl+C` pour arrêter de suivre les logs (les containers continuent de tourner).**

### 3.2 Vérifier le statut des services

```bash
# Vérifier que tous les services sont UP
docker compose -f docker-compose.local.yml ps
```

**Vous devriez voir :**

```
NAME                  STATUS
immo_local_postgres   Up (healthy)
immo_local_redis      Up (healthy)
immo_local_app        Up (healthy)
immo_local_nextjs     Up (healthy)
immo_local_nginx      Up (healthy)
immo_local_queue      Up
```

**Tous les services doivent être `Up` et idéalement `healthy`.**

### 3.3 Attendre que tout soit prêt

```bash
# Attendre 30-60 secondes que tous les services soient healthy
sleep 60

# Vérifier à nouveau
docker compose -f docker-compose.local.yml ps
```

---

## 🗄️ Étape 4 : Initialiser la Base de Données

### 4.1 Exécuter les migrations Laravel

```bash
# Depuis /home/user/immoguinee
cd /home/user/immoguinee

# Exécuter les migrations
docker exec immo_local_app php artisan migrate --force

# Vous devriez voir :
# Migration table created successfully.
# Migrating: xxxx_xx_xx_xxxxxx_create_users_table
# Migrated: xxxx_xx_xx_xxxxxx_create_users_table (xx.xxms)
# ...
```

### 4.2 (Optionnel) Seeder les données de test

```bash
# Si vous avez des seeders
docker exec immo_local_app php artisan db:seed --force
```

### 4.3 Vérifier la connexion PostgreSQL

```bash
# Se connecter à PostgreSQL
docker exec -it immo_local_postgres psql -U immo_user -d immo_guinee_db

# Dans le prompt PostgreSQL :
\dt           # Lister les tables
\q            # Quitter
```

---

## 🧪 Étape 5 : Tests des Services

### 5.1 Test Nginx (Reverse Proxy)

```bash
# Test du health check Nginx
curl http://localhost:8080/health

# Devrait retourner : OK
```

**Dans votre navigateur :**
- Ouvrir http://localhost:8080/health
- Devrait afficher : `OK`

### 5.2 Test Laravel (Backend API)

```bash
# Test du health check Laravel
curl http://localhost:8080/api/health

# Devrait retourner du JSON :
# {"status":"ok","timestamp":1234567890}
```

**Dans votre navigateur :**
- Ouvrir http://localhost:8080/api/health
- Devrait afficher du JSON

### 5.3 Test Next.js (Frontend)

```bash
# Test du health check Next.js
curl http://localhost:3000/api/health

# Devrait retourner du JSON :
# {"uptime":123,"message":"OK","timestamp":1234567890,"status":"healthy"}
```

**Dans votre navigateur :**
- Ouvrir http://localhost:3000
- Devrait afficher la page d'accueil Next.js
- Ouvrir http://localhost:3000/api/health
- Devrait afficher du JSON

### 5.4 Test Redis

```bash
# Se connecter à Redis
docker exec -it immo_local_redis redis-cli

# Dans le prompt Redis :
PING              # Devrait retourner : PONG
KEYS *            # Lister toutes les clés
INFO memory       # Voir l'utilisation mémoire
exit              # Quitter
```

### 5.5 Test PostgreSQL Performance

```bash
# Vérifier la configuration PostgreSQL
docker exec immo_local_postgres psql -U immo_user -d immo_guinee_db -c "SHOW shared_buffers;"
# Devrait afficher : 3GB

docker exec immo_local_postgres psql -U immo_user -d immo_guinee_db -c "SHOW effective_cache_size;"
# Devrait afficher : 6GB
```

---

## 📊 Étape 6 : Tests Automatiques

### 6.1 Script de validation automatique

```bash
# Depuis /home/user/immoguinee
cd /home/user/immoguinee

# Exécuter le script de validation
./scripts/test-local.sh

# Le script va tester :
# ✅ Tous les containers sont UP
# ✅ Nginx répond (health check)
# ✅ Laravel répond (API health check)
# ✅ Next.js répond (health check)
# ✅ PostgreSQL est accessible
# ✅ Redis est accessible
# ✅ Les migrations ont été exécutées
```

### 6.2 Tests Laravel (PHPUnit)

```bash
# Exécuter les tests Laravel
docker exec immo_local_app php artisan test

# Devrait afficher :
# Tests: X passed
# Time: XX.XXs
```

### 6.3 Tests Next.js (ESLint + Build)

```bash
# Linter Next.js (dans le container)
docker exec immo_local_nextjs npm run lint

# Build Next.js (pour vérifier qu'il n'y a pas d'erreurs)
# (déjà fait lors du docker build, mais pour vérifier)
docker exec immo_local_nextjs npm run build
```

---

## 📝 Étape 7 : Vérifier les Logs

### 7.1 Logs de tous les services

```bash
# Voir les logs de tous les services
docker compose -f docker-compose.local.yml logs --tail=100

# Logs d'un service spécifique
docker compose -f docker-compose.local.yml logs -f nginx
docker compose -f docker-compose.local.yml logs -f app
docker compose -f docker-compose.local.yml logs -f nextjs
docker compose -f docker-compose.local.yml logs -f postgres
docker compose -f docker-compose.local.yml logs -f redis
docker compose -f docker-compose.local.yml logs -f queue
```

### 7.2 Logs Laravel (dans le container)

```bash
# Voir les logs Laravel
docker exec immo_local_app tail -f storage/logs/laravel.log
```

**Vérifiez qu'il n'y a pas d'erreurs critiques.**

---

## 🔍 Étape 8 : Tests de Performance

### 8.1 Test de charge basique

```bash
# Installer Apache Bench (si pas déjà installé)
# Sur Ubuntu/Debian :
# sudo apt install apache2-utils

# Test de charge sur l'API Laravel
ab -n 100 -c 10 http://localhost:8080/api/health

# -n 100 : 100 requêtes
# -c 10  : 10 requêtes simultanées

# Vous devriez voir :
# Requests per second: XX [#/sec]
# Time per request: XX [ms] (mean)
```

### 8.2 Vérifier l'utilisation des ressources

```bash
# Stats Docker en temps réel
docker stats

# Vérifier :
# - CPU usage : devrait être <50% pour chaque container
# - RAM usage : PostgreSQL ~500MB, Redis ~100MB, Laravel ~200MB, Next.js ~150MB
```

---

## ✅ Étape 9 : Checklist de Validation

### Vérifications Générales

- [ ] Tous les containers sont `Up` et `healthy`
- [ ] Aucune erreur dans les logs
- [ ] Nginx répond sur http://localhost:8080
- [ ] Laravel API répond sur http://localhost:8080/api
- [ ] Next.js répond sur http://localhost:3000
- [ ] PostgreSQL est accessible
- [ ] Redis est accessible

### Vérifications Laravel

- [ ] Les migrations ont été exécutées
- [ ] La clé APP_KEY est générée
- [ ] Les caches sont fonctionnels (Redis)
- [ ] Les tests PHPUnit passent
- [ ] Les logs ne montrent pas d'erreurs

### Vérifications Next.js

- [ ] La page d'accueil s'affiche
- [ ] Le health check répond
- [ ] Le linter ESLint passe
- [ ] Le build Next.js réussit

### Vérifications PostgreSQL

- [ ] La base de données est créée
- [ ] Les tables sont présentes
- [ ] La configuration est optimisée (shared_buffers=3GB)
- [ ] Les connexions fonctionnent

### Vérifications Redis

- [ ] Redis répond au PING
- [ ] Le cache fonctionne
- [ ] Les sessions fonctionnent
- [ ] La queue fonctionne

### Vérifications Performance

- [ ] Response time API <200ms
- [ ] Response time Next.js <500ms
- [ ] CPU usage <50%
- [ ] RAM usage <4GB total

---

## 🛑 Étape 10 : Arrêter les Services

### 10.1 Arrêt propre

```bash
# Arrêter tous les services
docker compose -f docker-compose.local.yml down

# Vérifier que tout est arrêté
docker compose -f docker-compose.local.yml ps
```

### 10.2 Nettoyage complet (optionnel)

```bash
# Arrêter et supprimer les volumes (⚠️ perte de données)
docker compose -f docker-compose.local.yml down -v

# Supprimer les images
docker rmi immoguinee/laravel:local
docker rmi immoguinee/nextjs:local

# Nettoyer Docker
docker system prune -af
```

---

## 🚨 Troubleshooting

### Problème : Un container ne démarre pas

**Solution :**

```bash
# Voir les logs du container
docker compose -f docker-compose.local.yml logs <service_name>

# Exemples :
docker compose -f docker-compose.local.yml logs app
docker compose -f docker-compose.local.yml logs postgres

# Redémarrer le service
docker compose -f docker-compose.local.yml restart <service_name>
```

### Problème : Erreur "port already in use"

**Solution :**

```bash
# Vérifier les ports utilisés
sudo lsof -i :8080    # Nginx
sudo lsof -i :3000    # Next.js
sudo lsof -i :5432    # PostgreSQL
sudo lsof -i :6379    # Redis

# Arrêter le processus qui utilise le port
kill -9 <PID>

# Ou changer les ports dans docker-compose.local.yml
```

### Problème : Erreur de connexion à la base de données

**Solution :**

```bash
# Vérifier que PostgreSQL est UP
docker compose -f docker-compose.local.yml ps postgres

# Voir les logs PostgreSQL
docker compose -f docker-compose.local.yml logs postgres

# Vérifier la connexion
docker exec -it immo_local_postgres psql -U immo_user -d immo_guinee_db

# Recréer la base de données
docker compose -f docker-compose.local.yml down -v
docker compose -f docker-compose.local.yml up -d
```

### Problème : Erreur 502 Bad Gateway

**Solution :**

```bash
# Vérifier que Laravel est UP
docker compose -f docker-compose.local.yml ps app

# Voir les logs Laravel
docker compose -f docker-compose.local.yml logs app

# Redémarrer Laravel
docker compose -f docker-compose.local.yml restart app

# Vérifier la connexion Nginx → Laravel
docker exec immo_local_nginx curl http://app:9000/
```

### Problème : Images Docker trop volumineuses

**Solution :**

```bash
# Rebuild avec cache
docker compose -f docker-compose.local.yml build

# Vérifier la taille des images
docker images | grep immoguinee

# Les images devraient être :
# - Laravel : ~350MB
# - Next.js : ~180MB
```

---

## 📊 Résultats Attendus

### Performance Locale

| Métrique                  | Attendu          |
|---------------------------|------------------|
| Temps démarrage services  | 30-60 secondes   |
| Response time Nginx       | <50ms            |
| Response time Laravel API | <100ms           |
| Response time Next.js     | <200ms           |
| CPU usage total           | <50%             |
| RAM usage total           | <4GB             |
| Build time images         | 5-10 minutes     |

### Taille des Images

| Image              | Taille Attendue |
|--------------------|-----------------|
| Laravel (Alpine)   | ~350MB          |
| Next.js (Alpine)   | ~180MB          |
| PostgreSQL (Alpine)| ~230MB          |
| Redis (Alpine)     | ~30MB           |
| Nginx (Alpine)     | ~40MB           |

---

## ✅ Validation Finale

**Si tous les tests passent ✅ :**

🎉 **Félicitations !** Votre architecture Docker optimisée fonctionne parfaitement en local !

**Vous pouvez maintenant passer au déploiement sur le VPS OVH en toute confiance.**

**Prochaine étape :** Voir [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) pour déployer sur le VPS.

---

## 📞 Support

**Questions ou problèmes ?**

1. Vérifiez les logs : `docker compose -f docker-compose.local.yml logs`
2. Consultez la section [Troubleshooting](#troubleshooting)
3. Vérifiez que Docker Desktop a au moins 8GB RAM alloués

**Tout fonctionne ? Passez au déploiement ! 🚀**
