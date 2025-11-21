# 🚀 Guide de Déploiement Production - Immo Guinée

## 📋 Table des matières

- [Prérequis](#prérequis)
- [Architecture](#architecture)
- [Préparation du VPS](#préparation-du-vps)
- [Déploiement Initial](#déploiement-initial)
- [Configuration des Services](#configuration-des-services)
- [Mises à jour](#mises-à-jour)
- [Maintenance](#maintenance)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Prérequis

### Serveur VPS OVH

- **CPU** : 6 vCPU
- **RAM** : 12 GB
- **Storage** : 100 GB NVMe
- **OS** : Ubuntu 22.04 LTS
- **IP** : Statique

### Domaine

- Domaine configuré (ex: immoguinee.com)
- Accès aux DNS
- Compte Cloudflare (recommandé)

### Outils locaux

```bash
# Sur votre machine locale
ssh
git
docker (pour tester localement)
```

---

## 🏗️ Architecture

```
Internet
    ↓
Cloudflare (CDN, WAF, DDoS Protection)
    ↓
VPS OVH (6 vCPU, 12GB RAM)
    ↓
Nginx (Reverse Proxy)
    ├─→ Next.js (Frontend) :3000
    ├─→ Laravel (Backend API) :9000
    │   ├─→ PostgreSQL :5432
    │   └─→ Redis :6379
    └─→ Queue Workers (Laravel Jobs)
```

---

## 🖥️ Préparation du VPS

### 1. Se connecter au VPS

**Sur votre machine locale :**

```bash
# Remplacer par votre IP VPS
ssh root@VOTRE_IP_VPS
```

### 2. Mettre à jour le système

**Sur le VPS :**

```bash
apt update && apt upgrade -y
```

### 3. Installer Docker et Docker Compose

**Sur le VPS :**

```bash
# Installer Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Vérifier l'installation
docker --version

# Installer Docker Compose
apt install docker-compose-plugin -y

# Vérifier l'installation
docker compose version
```

### 4. Créer un utilisateur non-root

**Sur le VPS :**

```bash
# Créer l'utilisateur
adduser immo

# Ajouter aux sudoers
usermod -aG sudo immo

# Ajouter au groupe docker
usermod -aG docker immo

# Se connecter avec le nouvel utilisateur
su - immo
```

**Désormais, connectez-vous avec :**

```bash
# Sur votre machine locale
ssh immo@VOTRE_IP_VPS
```

### 5. Configurer le pare-feu UFW

**Sur le VPS (en tant qu'immo) :**

```bash
# Installer UFW
sudo apt install ufw -y

# Configurer les règles
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS

# Activer le pare-feu
sudo ufw enable

# Vérifier le statut
sudo ufw status
```

### 6. Configurer SSH (sécurité)

**Sur le VPS :**

```bash
# Éditer la configuration SSH
sudo nano /etc/ssh/sshd_config

# Modifier les lignes suivantes :
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes

# Redémarrer SSH
sudo systemctl restart sshd
```

**Sur votre machine locale (copier votre clé SSH) :**

```bash
# Générer une clé SSH si vous n'en avez pas
ssh-keygen -t ed25519 -C "votre-email@example.com"

# Copier la clé sur le VPS
ssh-copy-id immo@VOTRE_IP_VPS
```

---

## 🚀 Déploiement Initial

### 1. Cloner le projet sur le VPS

**Sur le VPS :**

```bash
# Se placer dans le home
cd ~

# Cloner le projet
git clone https://github.com/VOTRE_USERNAME/immoguinee.git
cd immoguinee
```

### 2. Configurer les variables d'environnement

**Sur le VPS (dans /home/immo/immoguinee) :**

```bash
# Copier le fichier d'exemple
cp .env.production.example .env.production

# Éditer le fichier
nano .env.production

# Modifier les valeurs suivantes :
# - DB_PASSWORD : Mot de passe PostgreSQL FORT
# - APP_KEY : Générer avec `php artisan key:generate`
# - APP_URL : https://votre-domaine.com
# - CLOUDFLARE_API_TOKEN : Votre token Cloudflare
# - CLOUDFLARE_ZONE_ID : Votre zone ID
```

### 3. Générer APP_KEY Laravel

**Sur le VPS :**

```bash
# Dans le dossier backend
cd ~/immoguinee/backend

# Générer la clé (en local ou via Docker)
docker run --rm -v $(pwd):/app -w /app composer:2.7 composer install --no-dev
docker run --rm -v $(pwd):/app -w /app php:8.2-cli php artisan key:generate --show

# Copier la clé générée dans .env.production
```

### 4. Créer les dossiers nécessaires

**Sur le VPS (dans /home/immo/immoguinee) :**

```bash
# Créer les dossiers
mkdir -p backups/postgres
mkdir -p docker/nginx/ssl
mkdir -p scripts
mkdir -p logs

# Permissions
chmod +x scripts/*.sh
```

### 5. Build et démarrer les containers

**Sur le VPS (dans /home/immo/immoguinee) :**

```bash
# Build les images Docker
docker compose -f docker-compose.production.yml build

# Démarrer les services
docker compose -f docker-compose.production.yml up -d

# Vérifier que tout fonctionne
docker compose -f docker-compose.production.yml ps
```

**Vous devriez voir tous les services "Up" :**

```
NAME                           STATUS
immo_guinee_app_prod           Up (healthy)
immo_guinee_nextjs_prod        Up (healthy)
immo_guinee_nginx_prod         Up (healthy)
immo_guinee_postgres_prod      Up (healthy)
immo_guinee_redis_prod         Up (healthy)
immo_guinee_queue_prod         Up
immo_guinee_scheduler_prod     Up
```

### 6. Migrer la base de données

**Sur le VPS :**

```bash
# Exécuter les migrations
docker exec immo_guinee_app_prod php artisan migrate --force

# Seeder (optionnel, pour données de test)
# docker exec immo_guinee_app_prod php artisan db:seed --force
```

### 7. Optimiser Laravel

**Sur le VPS :**

```bash
# Cacher les configurations
docker exec immo_guinee_app_prod php artisan config:cache
docker exec immo_guinee_app_prod php artisan route:cache
docker exec immo_guinee_app_prod php artisan view:cache

# Générer l'autoload optimisé
docker exec immo_guinee_app_prod composer dump-autoload --optimize
```

### 8. Vérifier le déploiement

**Sur le VPS :**

```bash
# Tester Nginx
curl http://localhost/health
# Devrait retourner : OK

# Tester l'API Laravel
curl http://localhost/api/health
# Devrait retourner du JSON

# Tester Next.js
curl http://localhost:3000/api/health
# Devrait retourner du JSON
```

---

## 🔧 Configuration des Services

### Cloudflare

**Voir le guide complet : `docs/CLOUDFLARE_GUIDE.md`**

**Étapes rapides :**

1. Configurer le DNS vers l'IP du VPS
2. Activer le proxy (orange cloud)
3. SSL/TLS : Full (Strict)
4. Configurer les Page Rules
5. Activer WAF et Bot Fight Mode
6. Récupérer l'API Token

### SSL/TLS (Cloudflare Origin Certificate)

**Sur Cloudflare :**

1. Aller dans SSL/TLS > Origin Server
2. Créer un certificat (15 ans)
3. Copier le certificat et la clé

**Sur le VPS :**

```bash
# Créer les fichiers
cd ~/immoguinee/docker/nginx/ssl

# Coller le certificat
nano fullchain.pem
# Coller le contenu du certificat

# Coller la clé privée
nano privkey.pem
# Coller le contenu de la clé

# Sécuriser les fichiers
chmod 600 *.pem
```

**Activer HTTPS dans Nginx :**

```bash
# Éditer la config Nginx
nano ~/immoguinee/docker/nginx/nginx.production.conf

# Décommenter la section HTTPS (server bloc port 443)

# Redémarrer Nginx
docker compose -f docker-compose.production.yml restart nginx
```

### Backups automatiques

**Sur le VPS :**

```bash
# Tester le script de backup
cd ~/immoguinee
./scripts/backup-postgres.sh

# Vérifier que le backup a été créé
ls -lh backups/postgres/

# Configurer le cron pour backups quotidiens
crontab -e

# Ajouter cette ligne (backup à 2h du matin)
0 2 * * * /home/immo/immoguinee/scripts/backup-postgres.sh >> /var/log/immoguinee/backup.log 2>&1
```

### Monitoring

**Sur le VPS :**

```bash
# Tester le script de monitoring
./scripts/monitoring.sh

# Voir le rapport
cat /var/log/immoguinee/monitoring_$(date +%Y%m%d).log

# Configurer le cron pour monitoring toutes les heures
crontab -e

# Ajouter cette ligne
0 * * * * /home/immo/immoguinee/scripts/monitoring.sh
```

### Audit de sécurité

**Sur le VPS :**

```bash
# Exécuter l'audit de sécurité
./scripts/security-audit.sh

# Voir le rapport
cat /var/log/immoguinee/security/security_audit_*.txt

# Configurer le cron pour audit hebdomadaire (lundi à 3h)
crontab -e

# Ajouter cette ligne
0 3 * * 1 /home/immo/immoguinee/scripts/security-audit.sh
```

---

## 🔄 Mises à jour

### Mise à jour manuelle

**Sur le VPS :**

```bash
cd ~/immoguinee

# Pull les derniers changements
git pull origin main

# Rebuild les images Docker
docker compose -f docker-compose.production.yml build

# Redémarrer les services (avec downtime minimal)
docker compose -f docker-compose.production.yml up -d --force-recreate

# Migrer la base de données
docker exec immo_guinee_app_prod php artisan migrate --force

# Vider les caches
docker exec immo_guinee_app_prod php artisan cache:clear
docker exec immo_guinee_app_prod php artisan config:cache
docker exec immo_guinee_app_prod php artisan route:cache
docker exec immo_guinee_app_prod php artisan view:cache

# Redémarrer les workers
docker exec immo_guinee_app_prod php artisan queue:restart

# Purger le cache Cloudflare
./scripts/cloudflare-purge.sh all
```

### Mise à jour via GitHub Actions (automatique)

**Sur votre machine locale :**

```bash
# Configurer les secrets GitHub
# Aller dans : Settings > Secrets and variables > Actions

# Ajouter les secrets suivants :
VPS_HOST=VOTRE_IP_VPS
VPS_USER=immo
SSH_PRIVATE_KEY=VOTRE_CLE_SSH_PRIVEE
CLOUDFLARE_API_TOKEN=VOTRE_TOKEN
CLOUDFLARE_ZONE_ID=VOTRE_ZONE_ID

# Pusher sur main pour déclencher le déploiement
git add .
git commit -m "Deploy to production"
git push origin main

# Le workflow GitHub Actions va :
# 1. Tester le code
# 2. Audit de sécurité
# 3. Build les images Docker
# 4. Déployer sur le VPS
# 5. Purger le cache Cloudflare
# 6. Envoyer une notification
```

---

## 🛠️ Maintenance

### Voir les logs

**Sur le VPS :**

```bash
# Logs Nginx
docker logs immo_guinee_nginx_prod --tail 100 -f

# Logs Laravel
docker logs immo_guinee_app_prod --tail 100 -f

# Logs Next.js
docker logs immo_guinee_nextjs_prod --tail 100 -f

# Logs PostgreSQL
docker logs immo_guinee_postgres_prod --tail 100 -f

# Logs Queue Workers
docker logs immo_guinee_queue_prod --tail 100 -f

# Logs Laravel (dans storage)
docker exec immo_guinee_app_prod tail -f storage/logs/laravel.log
```

### Redémarrer un service

**Sur le VPS :**

```bash
# Redémarrer un container spécifique
docker compose -f docker-compose.production.yml restart nginx
docker compose -f docker-compose.production.yml restart app
docker compose -f docker-compose.production.yml restart nextjs

# Redémarrer tous les services
docker compose -f docker-compose.production.yml restart
```

### Nettoyer Docker

**Sur le VPS :**

```bash
# Supprimer les images non utilisées
docker image prune -af

# Supprimer les containers arrêtés
docker container prune -f

# Supprimer les volumes non utilisés (ATTENTION : perte de données)
# docker volume prune -f

# Nettoyer tout (ATTENTION)
# docker system prune -af
```

### Restaurer un backup

**Sur le VPS :**

```bash
# Lister les backups disponibles
ls -lh backups/postgres/

# Restaurer un backup
cd ~/immoguinee
BACKUP_FILE="backups/postgres/backup_immo_guinee_db_20250121_020000.sql.gz"

# Décompresser
gunzip -c $BACKUP_FILE > /tmp/restore.sql

# Restaurer dans PostgreSQL
docker exec -i immo_guinee_postgres_prod psql -U immo_user -d immo_guinee_db < /tmp/restore.sql

# Nettoyer
rm /tmp/restore.sql
```

### Scaling (augmenter les ressources)

**Sur le VPS :**

```bash
# Éditer docker-compose.production.yml
nano docker-compose.production.yml

# Modifier les replicas pour app et nextjs :
# deploy:
#   replicas: 4  # Au lieu de 2

# Relancer
docker compose -f docker-compose.production.yml up -d --scale app=4 --scale nextjs=4
```

---

## 🚨 Troubleshooting

### Problème : Le site ne répond pas

**Solutions :**

```bash
# Vérifier que tous les containers sont up
docker compose -f docker-compose.production.yml ps

# Vérifier les logs Nginx
docker logs immo_guinee_nginx_prod --tail 50

# Vérifier le pare-feu
sudo ufw status

# Tester localement
curl http://localhost/health
```

### Problème : Erreur 502 Bad Gateway

**Solutions :**

```bash
# Vérifier que Laravel est up
docker compose -f docker-compose.production.yml ps app

# Redémarrer Laravel
docker compose -f docker-compose.production.yml restart app

# Vérifier les logs
docker logs immo_guinee_app_prod --tail 50

# Vérifier la connexion PostgreSQL
docker exec immo_guinee_app_prod php artisan db:show
```

### Problème : Erreur 500 Laravel

**Solutions :**

```bash
# Voir les logs Laravel
docker exec immo_guinee_app_prod tail -100 storage/logs/laravel.log

# Vérifier les permissions
docker exec immo_guinee_app_prod ls -la storage/

# Recréer les caches
docker exec immo_guinee_app_prod php artisan config:clear
docker exec immo_guinee_app_prod php artisan cache:clear
docker exec immo_guinee_app_prod php artisan config:cache
```

### Problème : Base de données inaccessible

**Solutions :**

```bash
# Vérifier que PostgreSQL est up
docker compose -f docker-compose.production.yml ps postgres

# Voir les logs
docker logs immo_guinee_postgres_prod --tail 50

# Se connecter à PostgreSQL
docker exec -it immo_guinee_postgres_prod psql -U immo_user -d immo_guinee_db

# Vérifier les connexions actives
docker exec immo_guinee_postgres_prod psql -U immo_user -d immo_guinee_db -c "SELECT count(*) FROM pg_stat_activity;"
```

### Problème : Out of Memory

**Solutions :**

```bash
# Vérifier la mémoire
free -h

# Vérifier la consommation Docker
docker stats

# Redémarrer les services gourmands
docker compose -f docker-compose.production.yml restart

# Augmenter le swap (temporaire)
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### Problème : Disque plein

**Solutions :**

```bash
# Vérifier l'espace disque
df -h

# Nettoyer les logs anciens
sudo find /var/log -type f -name "*.log" -mtime +30 -delete

# Nettoyer Docker
docker system prune -af

# Supprimer les anciens backups
find ~/immoguinee/backups/postgres -name "*.sql.gz" -mtime +30 -delete
```

---

## 📊 Monitoring et Performances

### Métriques à surveiller

**Objectifs de performance :**

- **CPU** : <70% en moyenne
- **RAM** : <80% utilisée
- **Disque** : <80% utilisé
- **IOPS** : <1000 pour NVMe
- **Cache Hit Ratio (Cloudflare)** : >80%
- **Response Time API** : <200ms
- **Response Time Frontend** : <500ms

### Outils de monitoring (optionnel)

```bash
# Installer htop
sudo apt install htop -y

# Installer iotop (monitoring I/O)
sudo apt install iotop -y

# Installer netdata (monitoring web)
bash <(curl -Ss https://my-netdata.io/kickstart.sh)
# Accéder via : http://VOTRE_IP_VPS:19999
```

---

## ✅ Checklist de déploiement

### Avant le déploiement

- [ ] VPS configuré et accessible
- [ ] Docker et Docker Compose installés
- [ ] Utilisateur non-root créé
- [ ] Pare-feu UFW configuré
- [ ] SSH sécurisé (clé publique uniquement)
- [ ] Domaine pointé vers le VPS
- [ ] Cloudflare configuré

### Déploiement initial

- [ ] Projet cloné sur le VPS
- [ ] `.env.production` configuré
- [ ] Certificats SSL installés
- [ ] Containers Docker buildés et démarrés
- [ ] Base de données migrée
- [ ] Caches Laravel optimisés
- [ ] Tests fonctionnels passent

### Post-déploiement

- [ ] Cloudflare configuré (DNS, SSL, Cache, WAF)
- [ ] Backups automatiques configurés (cron)
- [ ] Monitoring configuré (cron)
- [ ] Audit de sécurité configuré (cron)
- [ ] GitHub Actions configuré (CI/CD)
- [ ] Logs vérifiés (pas d'erreurs)
- [ ] Performance testée (Lighthouse, GTmetrix)

---

## 🎉 Félicitations !

Votre application **Immo Guinée** est maintenant déployée en production avec :

- ⚡ **Performance** : Docker optimisé, Redis cache, PostgreSQL tunée
- 🛡️ **Sécurité** : WAF Cloudflare, SSL/TLS, Containers non-root, Audits
- 🚀 **Scalabilité** : Multi-replicas, Queue workers, CDN Cloudflare
- 📊 **Monitoring** : Scripts automatiques, Logs centralisés
- 🔄 **CI/CD** : GitHub Actions, déploiement automatique
- 💾 **Backups** : Automatiques quotidiens vers S3

**Support et maintenance :** Suivez les procédures de ce guide pour maintenir votre application en production.

---

**Questions ou problèmes ?** Consultez le [Troubleshooting](#troubleshooting) ou ouvrez une issue sur GitHub.
