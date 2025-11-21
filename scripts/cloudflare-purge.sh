#!/bin/bash

# ==========================================
# SCRIPT DE PURGE CACHE CLOUDFLARE
# ==========================================
# Description: Purge le cache Cloudflare
# Auteur: Immo Guinée Dev Team
# Version: 1.0.0
# ==========================================

set -e

# ==========================================
# CONFIGURATION
# ==========================================
ZONE_ID="${CLOUDFLARE_ZONE_ID}"
API_TOKEN="${CLOUDFLARE_API_TOKEN}"

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# ==========================================
# FONCTIONS
# ==========================================

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

check_config() {
    if [ -z "$ZONE_ID" ] || [ -z "$API_TOKEN" ]; then
        log_error "Variables CLOUDFLARE_ZONE_ID et CLOUDFLARE_API_TOKEN requises"
        log_info "Configurez-les dans .env.production ou en variables d'environnement"
        exit 1
    fi
}

# Purge tout le cache
purge_all() {
    log_info "Purging all Cloudflare cache..."

    local response=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/purge_cache" \
        -H "Authorization: Bearer ${API_TOKEN}" \
        -H "Content-Type: application/json" \
        --data '{"purge_everything":true}')

    local success=$(echo "$response" | grep -o '"success":[^,]*' | cut -d: -f2)

    if [ "$success" = "true" ]; then
        log_info "✅ All cache purged successfully!"
    else
        log_error "❌ Failed to purge cache"
        echo "$response"
        exit 1
    fi
}

# Purge URLs spécifiques
purge_urls() {
    local urls=("$@")

    if [ ${#urls[@]} -eq 0 ]; then
        log_error "No URLs provided"
        exit 1
    fi

    log_info "Purging ${#urls[@]} specific URLs..."

    # Créer le JSON array
    local json_urls="["
    for url in "${urls[@]}"; do
        json_urls+="\"$url\","
    done
    json_urls="${json_urls%,}]"  # Enlever la dernière virgule

    local response=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/purge_cache" \
        -H "Authorization: Bearer ${API_TOKEN}" \
        -H "Content-Type: application/json" \
        --data "{\"files\":${json_urls}}")

    local success=$(echo "$response" | grep -o '"success":[^,]*' | cut -d: -f2)

    if [ "$success" = "true" ]; then
        log_info "✅ URLs purged successfully!"
        for url in "${urls[@]}"; do
            log_info "  - $url"
        done
    else
        log_error "❌ Failed to purge URLs"
        echo "$response"
        exit 1
    fi
}

# Purge par tags (Plan Pro/Business)
purge_tags() {
    local tags=("$@")

    if [ ${#tags[@]} -eq 0 ]; then
        log_error "No tags provided"
        exit 1
    fi

    log_info "Purging ${#tags[@]} tags..."

    # Créer le JSON array
    local json_tags="["
    for tag in "${tags[@]}"; do
        json_tags+="\"$tag\","
    done
    json_tags="${json_tags%,}]"  # Enlever la dernière virgule

    local response=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/purge_cache" \
        -H "Authorization: Bearer ${API_TOKEN}" \
        -H "Content-Type: application/json" \
        --data "{\"tags\":${json_tags}}")

    local success=$(echo "$response" | grep -o '"success":[^,]*' | cut -d: -f2)

    if [ "$success" = "true" ]; then
        log_info "✅ Tags purged successfully!"
        for tag in "${tags[@]}"; do
            log_info "  - $tag"
        done
    else
        log_error "❌ Failed to purge tags"
        echo "$response"
        exit 1
    fi
}

# Purge par préfixe
purge_prefix() {
    local prefix=$1

    if [ -z "$prefix" ]; then
        log_error "No prefix provided"
        exit 1
    fi

    log_info "Purging cache with prefix: $prefix"

    local response=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/purge_cache" \
        -H "Authorization: Bearer ${API_TOKEN}" \
        -H "Content-Type: application/json" \
        --data "{\"prefixes\":[\"$prefix\"]}")

    local success=$(echo "$response" | grep -o '"success":[^,]*' | cut -d: -f2)

    if [ "$success" = "true" ]; then
        log_info "✅ Prefix purged successfully!"
    else
        log_error "❌ Failed to purge prefix"
        echo "$response"
        exit 1
    fi
}

# Afficher l'aide
show_help() {
    cat << EOF
Usage: $0 COMMAND [ARGS]

Commandes disponibles :

  all                    Purge tout le cache Cloudflare
  urls URL1 [URL2...]    Purge des URLs spécifiques
  tags TAG1 [TAG2...]    Purge par tags (Plan Pro/Business)
  prefix PREFIX          Purge par préfixe (ex: /api/)
  help                   Affiche cette aide

Exemples :

  # Purger tout le cache
  $0 all

  # Purger des URLs spécifiques
  $0 urls "https://immoguinee.com/" "https://immoguinee.com/properties"

  # Purger par tags
  $0 tags "homepage" "properties" "blog"

  # Purger par préfixe
  $0 prefix "/api/"

Variables d'environnement requises :
  CLOUDFLARE_ZONE_ID    ID de la zone Cloudflare
  CLOUDFLARE_API_TOKEN  Token API avec permissions de purge

EOF
}

# ==========================================
# SCRIPT PRINCIPAL
# ==========================================

main() {
    if [ $# -eq 0 ]; then
        show_help
        exit 1
    fi

    local command=$1
    shift

    case "$command" in
        all)
            check_config
            purge_all
            ;;
        urls)
            check_config
            if [ $# -eq 0 ]; then
                log_error "Usage: $0 urls URL1 [URL2...]"
                exit 1
            fi
            purge_urls "$@"
            ;;
        tags)
            check_config
            if [ $# -eq 0 ]; then
                log_error "Usage: $0 tags TAG1 [TAG2...]"
                exit 1
            fi
            purge_tags "$@"
            ;;
        prefix)
            check_config
            if [ $# -eq 0 ]; then
                log_error "Usage: $0 prefix PREFIX"
                exit 1
            fi
            purge_prefix "$1"
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            log_error "Unknown command: $command"
            show_help
            exit 1
            ;;
    esac
}

# Exécuter le script
main "$@"
