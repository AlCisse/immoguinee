#!/bin/bash

# Script d'initialisation du projet Immo Guinée
# Ce script configure automatiquement l'environnement de développement

set -e

echo "🏠 =========================================="
echo "   Initialisation Plateforme Immo Guinée"
echo "=========================================== 🏠"
echo ""

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Vérifier que Docker est installé
if ! command -v docker &> /dev/null; then
    print_error "Docker n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

print_success "Docker et Docker Compose sont installés"

# Créer la structure des dossiers
print_info "Création de la structure des dossiers..."

mkdir -p backend/storage/app/public
mkdir -p backend/storage/framework/{cache,sessions,views}
mkdir -p backend/storage/logs
mkdir -p backend/bootstrap/cache
mkdir -p frontend
mkdir -p mobile
mkdir -p n8n/workflows

print_success "Structure des dossiers créée"

# Vérifier les ports disponibles
print_info "Vérification des ports..."

PORTS=(8080 3000 5432 8081 6379 9200 1025 8025 5678 9000 9001)
for port in "${PORTS[@]}"; do
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_error "Le port $port est déjà utilisé. Veuillez libérer ce port."
        exit 1
    fi
done

print_success "Tous les ports nécessaires sont disponibles"

# Démarrer Docker Compose
print_info "Démarrage des services Docker..."
docker-compose up -d

# Attendre que PostgreSQL soit prêt
print_info "Attente du démarrage de PostgreSQL..."
sleep 10

MAX_TRIES=30
COUNT=0
until docker-compose exec -T postgres pg_isready -U immo_user > /dev/null 2>&1; do
    COUNT=$((COUNT+1))
    if [ $COUNT -gt $MAX_TRIES ]; then
        print_error "PostgreSQL n'a pas démarré dans le temps imparti"
        exit 1
    fi
    echo -n "."
    sleep 2
done
echo ""
print_success "PostgreSQL est prêt"

# Installer Laravel si le dossier backend est vide
if [ ! -f "backend/artisan" ]; then
    print_info "Installation de Laravel..."
    docker-compose exec -T app composer create-project laravel/laravel . --prefer-dist
    print_success "Laravel installé"
    
    # Copier le fichier .env
    if [ -f "backend/.env.example" ]; then
        docker-compose exec -T app cp .env.example .env
    fi
    
    # Générer la clé d'application
    docker-compose exec -T app php artisan key:generate
    print_success "Clé d'application Laravel générée"
    
    # Configurer les permissions
    docker-compose exec -T app chmod -R 775 storage bootstrap/cache
    docker-compose exec -T app chown -R www-data:www-data storage bootstrap/cache
    print_success "Permissions configurées"
else
    print_info "Laravel est déjà installé"
fi

# Créer le bucket MinIO
print_info "Configuration de MinIO..."
sleep 5

docker-compose exec -T minio sh -c "
    mc alias set myminio http://localhost:9000 minio_admin minio_password_123 || true
    mc mb myminio/immo-guinee --ignore-existing || true
    mc policy set download myminio/immo-guinee || true
" 2>/dev/null || print_info "MinIO sera configuré manuellement"

print_success "MinIO configuré"

echo ""
echo "🎉 =========================================="
echo "   Installation terminée avec succès!"
echo "=========================================== 🎉"
echo ""
echo "📋 Services disponibles:"
echo ""
echo "   🌐 Laravel API:        http://localhost:8080"
echo "   ⚛️  React Web:         http://localhost:3000"
echo "   🗄️  pgAdmin:           http://localhost:8081"
echo "      └─ Email: admin@immguinee.local"
echo "      └─ Pass:  admin123"
echo ""
echo "   🤖 n8n:               http://localhost:5678"
echo "      └─ User: admin"
echo "      └─ Pass: admin123"
echo ""
echo "   📧 MailHog:           http://localhost:8025"
echo "   💾 MinIO Console:     http://localhost:9001"
echo "      └─ User: minio_admin"
echo "      └─ Pass: minio_password_123"
echo ""
echo "   🔍 Elasticsearch:     http://localhost:9200"
echo ""
echo "📝 Prochaines étapes:"
echo ""
echo "   1. Configurer le fichier backend/.env"
echo "   2. Créer les migrations: docker-compose exec app php artisan migrate"
echo "   3. Installer React: cd frontend && npx create-react-app ."
echo "   4. Créer vos agents IA dans n8n"
echo ""
echo "🛠️  Commandes utiles:"
echo ""
echo "   Voir les logs:         docker-compose logs -f"
echo "   Arrêter les services:  docker-compose down"
echo "   Entrer dans Laravel:   docker-compose exec app bash"
echo ""
echo "📖 Consultez le README.md pour plus d'informations"
echo ""
