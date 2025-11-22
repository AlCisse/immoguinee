# 🔧 CORRECTION URGENTE - Erreur 500 Laravel

## 🐛 Problème Identifié

L'erreur 500 de Laravel était causée par plusieurs problèmes:

1. ❌ **Dockerfile de production utilisé pour les tests locaux**
   - OPcache désactivait la détection des modifications
   - Configs Laravel mises en cache (config:cache, route:cache)
   - Impossible de modifier le code à chaud

2. ❌ **APP_KEY manquante**
   - Laravel ne peut pas démarrer sans clé de chiffrement

3. ❌ **Migrations non exécutées**
   - Base de données non initialisée

4. ❌ **CORS non configuré**
   - Next.js ne pouvait pas communiquer avec Laravel

## ✅ Solutions Apportées

### 1. Nouveau Dockerfile pour le développement local
- `docker/php/Dockerfile.local` - Image PHP optimisée pour le développement
- OPcache avec détection des modifications activée
- Affichage des erreurs activé
- Pas de mise en cache des configs

### 2. Docker-compose mis à jour
- Utilise maintenant `Dockerfile.local` au lieu de `Dockerfile.production`
- Variables d'environnement complètes ajoutées
- APP_URL et APP_NAME configurés

### 3. Script d'initialisation Laravel
- `scripts/setup-laravel-local.sh` - Automatise toute la configuration
- Installe les dépendances Composer
- Génère l'APP_KEY automatiquement
- Exécute les migrations
- Configure les permissions

### 4. Configuration CORS
- `backend/config/cors.php` - Autorise Next.js à communiquer
- `backend/bootstrap/app.php` - Middleware CORS activé
- `frontend/immoguinee/.env.local.example` - URL API corrigée

### 5. Makefile simplifié
- Nouvelle commande `make laravel-setup` pour initialiser Laravel
- Workflow `make start-fresh` complètement automatisé

---

## 🚀 PROCÉDURE DE CORRECTION RAPIDE

### Étape 1: Mettre à jour le code local

```bash
cd C:\Users\hassa\OneDrive\Bureau\immo-guinee
git pull origin claude/optimize-docker-architecture-019M2GQwr2fow6eeS5ezWbVt
```

### Étape 2: Nettoyer l'environnement Docker

```bash
# Arrêter tous les conteneurs
docker-compose -f docker-compose.local.yml down -v

# Supprimer les anciennes images (optionnel mais recommandé)
docker rmi immoguinee/laravel:local
docker rmi immoguinee/nextjs:local
```

### Étape 3: Créer les fichiers .env

```bash
# Laravel
cd backend
copy .env.example .env
cd ..

# Next.js
cd frontend\immoguinee
copy .env.local.example .env.local
cd ..\..
```

### Étape 4: Rebuilder les images

```bash
docker-compose -f docker-compose.local.yml build --no-cache
```

### Étape 5: Démarrer les services

```bash
docker-compose -f docker-compose.local.yml up -d
```

### Étape 6: Attendre que les services démarrent (30 secondes)

```bash
timeout /t 30
```

### Étape 7: Initialiser Laravel

```bash
# Rendre le script exécutable (Git Bash ou WSL)
chmod +x scripts/setup-laravel-local.sh

# Exécuter le script d'initialisation
bash scripts/setup-laravel-local.sh
```

**OU si vous avez Make installé:**

```bash
make laravel-setup
```

### Étape 8: Vérifier que tout fonctionne

```bash
# Test Nginx
curl http://localhost:8080/health

# Test Laravel API
curl http://localhost:8080/api/health

# Test Next.js
curl http://localhost:3000
```

**Réponse attendue de Laravel:**
```json
{
  "status": "ok",
  "service": "Immo Guinée API",
  "version": "1.0.0",
  "timestamp": "2025-11-22T00:00:00.000000Z"
}
```

### Étape 9: Tester le signup

1. Ouvrir http://localhost:3000 dans votre navigateur
2. Aller sur la page d'inscription
3. Remplir le formulaire
4. Cliquer sur "S'inscrire"

**L'erreur "Network Error" ne devrait plus apparaître!**

---

## 🆘 SI LE PROBLÈME PERSISTE

### Vérifier les logs Laravel

```bash
docker-compose -f docker-compose.local.yml logs app --tail=100
```

### Vérifier les logs Nginx

```bash
docker-compose -f docker-compose.local.yml logs nginx --tail=100
```

### Vérifier les logs Next.js

```bash
docker-compose -f docker-compose.local.yml logs nextjs --tail=100
```

### Accéder au conteneur Laravel pour déboguer

```bash
docker exec -it immo_local_app bash

# Une fois dans le conteneur:
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan migrate --force
exit
```

### Vérifier que PostgreSQL est prêt

```bash
docker-compose -f docker-compose.local.yml exec postgres pg_isready -U immo_user -d immo_guinee_db
```

### Vérifier que Redis fonctionne

```bash
docker-compose -f docker-compose.local.yml exec redis redis-cli ping
# Doit retourner: PONG
```

---

## 📋 CHECKLIST DE VÉRIFICATION

- [ ] Git pull effectué
- [ ] Fichier `backend/.env` créé
- [ ] Fichier `frontend/immoguinee/.env.local` créé
- [ ] Images Docker rebuilder
- [ ] Services démarrés
- [ ] Script `setup-laravel-local.sh` exécuté
- [ ] APP_KEY générée
- [ ] Migrations exécutées
- [ ] API Laravel répond sur http://localhost:8080/api/health
- [ ] Next.js accessible sur http://localhost:3000
- [ ] Signup fonctionne sans erreur

---

## 🎯 RÉSUMÉ DES FICHIERS MODIFIÉS

```
✅ Nouveaux fichiers:
   - docker/php/Dockerfile.local
   - scripts/setup-laravel-local.sh
   - backend/config/cors.php
   - QUICK_FIX_ERROR_500.md (ce fichier)

✅ Fichiers modifiés:
   - docker-compose.local.yml (utilise Dockerfile.local)
   - backend/bootstrap/app.php (CORS activé)
   - frontend/immoguinee/.env.local.example (URL API corrigée)
   - Makefile.local (nouvelles commandes)
```

---

## 💡 COMMANDES UTILES

```bash
# Workflow complet automatisé (si Make est installé)
make start-fresh

# OU manuellement:
make clean
make setup
make build
make up
make laravel-setup
make test-quick

# Redémarrer un service spécifique
docker-compose -f docker-compose.local.yml restart app
docker-compose -f docker-compose.local.yml restart nginx
docker-compose -f docker-compose.local.yml restart nextjs

# Voir tous les conteneurs
docker-compose -f docker-compose.local.yml ps

# Voir les stats (CPU, RAM)
docker stats
```

---

## 📞 BESOIN D'AIDE ?

Si le problème persiste après avoir suivi toutes les étapes:

1. Collectez les logs:
   ```bash
   docker-compose -f docker-compose.local.yml logs > debug-logs.txt
   ```

2. Vérifiez les fichiers de configuration:
   ```bash
   docker exec -it immo_local_app cat .env
   docker exec -it immo_local_app php artisan config:show
   ```

3. Partagez les informations collectées pour un diagnostic plus approfondi.

---

**Bonne chance! 🚀**
