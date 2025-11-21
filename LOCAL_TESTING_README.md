# 🧪 Guide de Test Local - Quick Start

## 🎯 Objectif

Tester **toute l'architecture Docker optimisée** sur votre machine locale avant de déployer sur le VPS OVH.

---

## ⚡ Quick Start (3 commandes)

```bash
# 1. Setup initial (première fois seulement)
make -f Makefile.local setup

# 2. Build et démarrer
make -f Makefile.local build
make -f Makefile.local up

# 3. Migrer la base de données
make -f Makefile.local laravel-migrate

# 4. Tester tout
make -f Makefile.local test
```

**OU en une seule commande :**

```bash
make -f Makefile.local start-fresh
```

✅ **C'est tout !** Les services sont maintenant accessibles :
- **Nginx** : http://localhost:8080
- **Next.js** : http://localhost:3000
- **Laravel API** : http://localhost:8080/api/health

---

## 📋 Prérequis

### Logiciels

- ✅ Docker Desktop (version récente)
- ✅ Docker Compose V2
- ✅ Git

### Ressources

- 🖥️ **RAM** : Au moins 8GB disponibles
- 💾 **Disque** : 20GB libres
- ⚡ **CPU** : 4 cores recommandés

### Vérifier les versions

```bash
docker --version        # Docker version 24.x ou supérieur
docker compose version  # Docker Compose version v2.x ou supérieur
```

---

## 🚀 Installation Complète

### Étape 1 : Setup Initial

```bash
# Se placer dans le dossier du projet
cd /home/user/immoguinee

# Première installation (crée .env, installe dépendances, génère clés)
make -f Makefile.local setup
```

**Ce que fait `setup` :**
1. Copie `.env.example` vers `.env`
2. Installe les dépendances Composer
3. Génère la clé `APP_KEY` Laravel

### Étape 2 : Build les Images

```bash
# Build les images Docker (5-10 minutes)
make -f Makefile.local build
```

**Images créées :**
- `immoguinee/laravel:local` (~350MB)
- `immoguinee/nextjs:local` (~180MB)

### Étape 3 : Démarrer les Services

```bash
# Démarrer tous les containers
make -f Makefile.local up

# Attendre 30 secondes que tous les services soient healthy
# Les services démarrent automatiquement
```

**Services démarrés :**
- PostgreSQL (port 5432)
- Redis (port 6379)
- Laravel/PHP-FPM
- Next.js (port 3000)
- Nginx (port 8080)
- Queue Worker

### Étape 4 : Initialiser la Base de Données

```bash
# Exécuter les migrations
make -f Makefile.local laravel-migrate

# (Optionnel) Seeder des données de test
make -f Makefile.local laravel-seed
```

### Étape 5 : Tester Tout

```bash
# Tests automatiques complets (~30 secondes)
make -f Makefile.local test

# OU tests rapides (~5 secondes)
make -f Makefile.local test-quick

# OU health checks seulement
make -f Makefile.local health
```

---

## ✅ Vérification Manuelle

### 1. Vérifier que tout tourne

```bash
# Voir le statut de tous les services
make -f Makefile.local status

# Tous les services doivent être "Up" et idéalement "(healthy)"
```

### 2. Tester les endpoints

**Dans votre navigateur :**

- http://localhost:8080/health → Devrait afficher `OK`
- http://localhost:8080/api/health → Devrait afficher du JSON
- http://localhost:3000 → Page d'accueil Next.js
- http://localhost:3000/api/health → JSON avec `uptime`, `status`

**En ligne de commande :**

```bash
# Nginx
curl http://localhost:8080/health

# Laravel API
curl http://localhost:8080/api/health

# Next.js
curl http://localhost:3000/api/health
```

### 3. Vérifier les logs

```bash
# Voir les logs de tous les services
make -f Makefile.local logs

# Logs d'un service spécifique
make -f Makefile.local logs SERVICE=nginx
make -f Makefile.local logs SERVICE=app
make -f Makefile.local logs SERVICE=nextjs

# OU commandes individuelles
make -f Makefile.local logs-nginx
make -f Makefile.local logs-laravel
make -f Makefile.local logs-nextjs
```

---

## 📊 Commandes Utiles

### Gestion des Services

```bash
make -f Makefile.local help      # Afficher l'aide complète
make -f Makefile.local status    # Statut des services
make -f Makefile.local restart   # Redémarrer tout
make -f Makefile.local down      # Arrêter tout
make -f Makefile.local up        # Démarrer tout
```

### Laravel

```bash
make -f Makefile.local laravel-shell     # Shell dans le container Laravel
make -f Makefile.local laravel-migrate   # Exécuter les migrations
make -f Makefile.local laravel-seed      # Seeder la BDD
make -f Makefile.local laravel-fresh     # Reset + migrate + seed
make -f Makefile.local laravel-test      # Tests PHPUnit
```

### Base de Données

```bash
make -f Makefile.local db-shell          # Shell PostgreSQL
make -f Makefile.local db-reset          # Reset complet de la BDD
```

### Tests

```bash
make -f Makefile.local test              # Tests complets (~30s)
make -f Makefile.local test-quick        # Tests rapides (~5s)
make -f Makefile.local health            # Health checks seulement
```

### Stats et Logs

```bash
make -f Makefile.local stats             # Stats Docker (CPU, RAM)
make -f Makefile.local logs              # Tous les logs
make -f Makefile.local logs-nginx        # Logs Nginx
make -f Makefile.local logs-laravel      # Logs Laravel
```

### Nettoyage

```bash
make -f Makefile.local clean             # Arrêter + supprimer volumes
make -f Makefile.local clean-all         # Nettoyage complet (⚠️ supprime les images)
```

---

## 🧪 Script de Test Automatique

Le script `scripts/test-local.sh` valide **automatiquement** tous les services.

### Exécution

```bash
# Via le Makefile (recommandé)
make -f Makefile.local test

# OU directement
./scripts/test-local.sh
```

### Ce qui est testé

✅ Docker est en cours d'exécution
✅ Tous les containers sont UP
✅ Tous les services sont healthy
✅ Nginx répond (health check)
✅ Laravel API répond (health check + connexion BDD)
✅ Next.js répond (health check + homepage)
✅ PostgreSQL accepte les connexions
✅ Configuration PostgreSQL (shared_buffers, etc.)
✅ Redis répond au PING + SET/GET
✅ Queue Worker est actif
✅ Performance (response time <500ms)
✅ Resource usage

### Résultat attendu

```
========================================
✓ ALL TESTS PASSED!
========================================

🎉 Your Docker architecture is working perfectly!
You can now deploy to production with confidence.

Total tests: 35
Passed: 35
Failed: 0
Pass rate: 100%
```

---

## 🚨 Troubleshooting

### Problème : Un container ne démarre pas

```bash
# Voir les logs du container
make -f Makefile.local logs SERVICE=<nom_service>

# Redémarrer le service
docker compose -f docker-compose.local.yml restart <nom_service>
```

### Problème : Erreur "port already in use"

```bash
# Vérifier quel processus utilise le port
sudo lsof -i :8080    # Nginx
sudo lsof -i :3000    # Next.js
sudo lsof -i :5432    # PostgreSQL
sudo lsof -i :6379    # Redis

# Tuer le processus
kill -9 <PID>
```

### Problème : Erreur de connexion à la BDD

```bash
# Redémarrer PostgreSQL
docker compose -f docker-compose.local.yml restart postgres

# Attendre 10 secondes
sleep 10

# Re-migrer
make -f Makefile.local laravel-migrate
```

### Problème : Les tests échouent

```bash
# Voir les logs détaillés
make -f Makefile.local logs

# Redémarrer tous les services
make -f Makefile.local restart

# Attendre 30 secondes
sleep 30

# Re-tester
make -f Makefile.local test
```

### Problème : Tout va mal

```bash
# Nettoyer complètement et recommencer
make -f Makefile.local clean-all
make -f Makefile.local build
make -f Makefile.local up
make -f Makefile.local laravel-migrate
make -f Makefile.local test
```

---

## 📊 Métriques Attendues

### Performance

| Métrique                 | Attendu          |
|--------------------------|------------------|
| Temps démarrage services | 30-60 secondes   |
| Response time Nginx      | <50ms            |
| Response time Laravel    | <100ms           |
| Response time Next.js    | <200ms           |
| CPU usage total          | <50%             |
| RAM usage total          | <4GB             |

### Taille des Images

| Image              | Taille   |
|--------------------|----------|
| Laravel (Alpine)   | ~350MB   |
| Next.js (Alpine)   | ~180MB   |
| PostgreSQL         | ~230MB   |
| Redis              | ~30MB    |
| Nginx              | ~40MB    |

---

## ✅ Checklist de Validation

### Avant de déployer en production

- [ ] Tous les tests passent (`make test`)
- [ ] Tous les containers sont healthy
- [ ] Nginx répond sur http://localhost:8080
- [ ] Laravel API répond
- [ ] Next.js répond sur http://localhost:3000
- [ ] PostgreSQL fonctionne
- [ ] Redis fonctionne
- [ ] Les migrations ont été exécutées
- [ ] Response time <500ms
- [ ] CPU usage <50%
- [ ] RAM usage <4GB
- [ ] Aucune erreur dans les logs

**Si toutes les cases sont cochées ✅** → Vous êtes prêt pour la production !

---

## 📚 Documentation Complète

Pour plus de détails, consultez :

- **[LOCAL_TESTING_GUIDE.md](docs/LOCAL_TESTING_GUIDE.md)** - Guide complet (50+ pages)
- **[DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md)** - Guide de déploiement VPS
- **[OPTIMIZATION_SUMMARY.md](docs/OPTIMIZATION_SUMMARY.md)** - Détails techniques

---

## 🎉 Résultat

**Si tous les tests passent :**

```
========================================
✓ ALL TESTS PASSED!
========================================

🎉 Your Docker architecture is working perfectly!
```

**Vous pouvez maintenant déployer sur le VPS OVH en toute confiance ! 🚀**

---

## 📞 Aide

**Commandes essentielles :**

```bash
make -f Makefile.local help          # Aide complète
make -f Makefile.local start-fresh   # Tout en une commande
make -f Makefile.local test          # Tests automatiques
make -f Makefile.local status        # Statut des services
make -f Makefile.local logs          # Voir les logs
```

**En cas de problème :**

1. Vérifier les logs : `make -f Makefile.local logs`
2. Redémarrer : `make -f Makefile.local restart`
3. Nettoyer et recommencer : `make -f Makefile.local clean-all`
4. Consulter [LOCAL_TESTING_GUIDE.md](docs/LOCAL_TESTING_GUIDE.md)

**Tout fonctionne ? Passez au déploiement production ! 🚀**
