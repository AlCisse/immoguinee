#!/bin/bash

# ==========================================
# SCRIPT D'INITIALISATION LARAVEL - LOCAL
# ==========================================
# Description: Configure Laravel pour les tests locaux
# Auteur: Immo Guinée Dev Team
# Version: 1.0.0
# ==========================================

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

log_error() {
    echo -e "${RED}[✗]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[⚠]${NC} $1"
}

echo ""
echo "=========================================="
echo "  INITIALISATION LARAVEL - TESTS LOCAUX  "
echo "=========================================="
echo ""

# 1. Vérifier que le conteneur est démarré
log_info "Vérification du conteneur Laravel..."
if ! docker ps | grep -q "immo_local_app"; then
    log_error "Le conteneur Laravel n'est pas démarré!"
    log_info "Démarrez-le avec: docker-compose -f docker-compose.local.yml up -d"
    exit 1
fi
log_success "Conteneur Laravel démarré"

# 2. Installer les dépendances Composer
log_info "Installation des dépendances Composer..."
docker-compose -f docker-compose.local.yml exec -T app composer install --no-interaction --prefer-dist
log_success "Dépendances Composer installées"

# 3. Générer l'APP_KEY
log_info "Génération de l'APP_KEY..."
docker-compose -f docker-compose.local.yml exec -T app php artisan key:generate --force
log_success "APP_KEY générée"

# 4. Créer le fichier .env s'il n'existe pas
log_info "Vérification du fichier .env..."
if ! docker-compose -f docker-compose.local.yml exec -T app test -f .env; then
    log_warning "Fichier .env manquant, création à partir de .env.example..."
    docker-compose -f docker-compose.local.yml exec -T app cp .env.example .env
    docker-compose -f docker-compose.local.yml exec -T app php artisan key:generate --force
    log_success "Fichier .env créé et APP_KEY générée"
else
    log_success "Fichier .env existe"
fi

# 5. Configurer les permissions
log_info "Configuration des permissions..."
docker-compose -f docker-compose.local.yml exec -T app chmod -R 775 storage bootstrap/cache
log_success "Permissions configurées"

# 6. Attendre que PostgreSQL soit prêt
log_info "Vérification de PostgreSQL..."
for i in {1..30}; do
    if docker-compose -f docker-compose.local.yml exec -T postgres pg_isready -U immo_user -d immo_guinee_db > /dev/null 2>&1; then
        log_success "PostgreSQL est prêt"
        break
    fi
    if [ $i -eq 30 ]; then
        log_error "Timeout: PostgreSQL n'est pas prêt après 30 secondes"
        exit 1
    fi
    sleep 1
done

# 7. Exécuter les migrations
log_info "Exécution des migrations..."
if docker-compose -f docker-compose.local.yml exec -T app php artisan migrate --force; then
    log_success "Migrations exécutées avec succès"
else
    log_warning "Erreur lors des migrations (peut-être déjà exécutées)"
fi

# 8. Créer le lien symbolique pour storage
log_info "Création du lien symbolique storage..."
docker-compose -f docker-compose.local.yml exec -T app php artisan storage:link || true
log_success "Lien symbolique créé"

# 9. Nettoyer les caches
log_info "Nettoyage des caches..."
docker-compose -f docker-compose.local.yml exec -T app php artisan config:clear
docker-compose -f docker-compose.local.yml exec -T app php artisan cache:clear
docker-compose -f docker-compose.local.yml exec -T app php artisan route:clear
docker-compose -f docker-compose.local.yml exec -T app php artisan view:clear
log_success "Caches nettoyés"

# 10. Vérifier que Laravel fonctionne
log_info "Test de l'API Laravel..."
sleep 3
if curl -s http://localhost:8080/api/health > /dev/null 2>&1; then
    log_success "API Laravel fonctionne!"
else
    log_warning "L'API ne répond pas encore (vérifiez les logs avec: docker-compose -f docker-compose.local.yml logs app)"
fi

echo ""
echo "=========================================="
echo -e "${GREEN}  ✓ INITIALISATION TERMINÉE  ${NC}"
echo "=========================================="
echo ""
echo "Prochaines étapes:"
echo "1. Vérifier que tout fonctionne: make test"
echo "2. Accéder à l'API: http://localhost:8080/api/health"
echo "3. Accéder à Next.js: http://localhost:3000"
echo ""
