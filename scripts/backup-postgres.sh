#!/bin/bash

# ==========================================
# SCRIPT DE BACKUP AUTOMATIQUE POSTGRESQL
# ==========================================
# Description: Backup automatique avec rotation et compression
# Auteur: Immo Guinée Dev Team
# Version: 1.0.0
# ==========================================

set -e

# ==========================================
# CONFIGURATION
# ==========================================
BACKUP_DIR="/backups"
RETENTION_DAYS=30
DATE=$(date +%Y%m%d_%H%M%S)
CONTAINER_NAME="immo_guinee_postgres_prod"
DB_NAME="${DB_DATABASE:-immo_guinee_db}"
DB_USER="${DB_USERNAME:-immo_user}"

# S3 Configuration (optionnel)
S3_BUCKET="${BACKUP_S3_BUCKET:-}"
S3_ENABLED="${BACKUP_S3_ENABLED:-false}"

# Notification (optionnel)
SLACK_WEBHOOK_URL="${SLACK_WEBHOOK_URL:-}"
EMAIL_RECIPIENT="${BACKUP_EMAIL:-}"

# ==========================================
# COULEURS POUR LES LOGS
# ==========================================
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ==========================================
# FONCTIONS
# ==========================================

log_info() {
    echo -e "${GREEN}[INFO]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

send_notification() {
    local status=$1
    local message=$2

    # Notification Slack
    if [ -n "$SLACK_WEBHOOK_URL" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"🔄 Backup PostgreSQL: $status\n$message\"}" \
            "$SLACK_WEBHOOK_URL" > /dev/null 2>&1 || true
    fi

    # Notification Email (nécessite mailx ou sendmail)
    if [ -n "$EMAIL_RECIPIENT" ]; then
        echo "$message" | mail -s "Backup PostgreSQL: $status" "$EMAIL_RECIPIENT" || true
    fi
}

check_container() {
    if ! docker ps | grep -q "$CONTAINER_NAME"; then
        log_error "Le conteneur PostgreSQL n'est pas en cours d'exécution"
        send_notification "FAILED" "Le conteneur PostgreSQL n'est pas démarré"
        exit 1
    fi
}

create_backup_dir() {
    if [ ! -d "$BACKUP_DIR" ]; then
        mkdir -p "$BACKUP_DIR"
        log_info "Dossier de backup créé: $BACKUP_DIR"
    fi
}

perform_backup() {
    local backup_file="$BACKUP_DIR/backup_${DB_NAME}_${DATE}.sql"
    local compressed_file="${backup_file}.gz"

    log_info "Démarrage du backup de la base de données: $DB_NAME"

    # Backup avec pg_dump
    if docker exec "$CONTAINER_NAME" pg_dump -U "$DB_USER" -d "$DB_NAME" \
        --format=plain \
        --no-owner \
        --no-acl \
        --clean \
        --if-exists > "$backup_file"; then

        log_info "Backup SQL créé: $backup_file"

        # Compression
        log_info "Compression du backup..."
        gzip "$backup_file"

        # Vérification de la taille
        local file_size=$(du -h "$compressed_file" | cut -f1)
        log_info "Backup compressé: $compressed_file (Taille: $file_size)"

        # Upload vers S3 (si configuré)
        if [ "$S3_ENABLED" = "true" ] && [ -n "$S3_BUCKET" ]; then
            upload_to_s3 "$compressed_file"
        fi

        return 0
    else
        log_error "Échec du backup"
        rm -f "$backup_file"
        return 1
    fi
}

upload_to_s3() {
    local file=$1
    local s3_path="s3://${S3_BUCKET}/postgres/$(basename $file)"

    log_info "Upload vers S3: $s3_path"

    if command -v aws >/dev/null 2>&1; then
        if aws s3 cp "$file" "$s3_path" --storage-class STANDARD_IA; then
            log_info "Upload S3 réussi"
            # Créer un flag pour indiquer que le backup est sur S3
            touch "${file}.s3"
        else
            log_warning "Échec de l'upload S3"
        fi
    else
        log_warning "AWS CLI non installé, skip upload S3"
    fi
}

rotate_backups() {
    log_info "Rotation des backups (rétention: $RETENTION_DAYS jours)"

    # Supprimer les backups locaux de plus de X jours
    find "$BACKUP_DIR" -name "backup_*.sql.gz" -mtime +$RETENTION_DAYS -exec rm -f {} \;

    # Supprimer les flags S3 associés
    find "$BACKUP_DIR" -name "backup_*.sql.gz.s3" -mtime +$RETENTION_DAYS -exec rm -f {} \;

    # Compter les backups restants
    local backup_count=$(ls -1 "$BACKUP_DIR"/backup_*.sql.gz 2>/dev/null | wc -l)
    log_info "Backups actuels: $backup_count"
}

verify_backup() {
    local backup_file=$1

    log_info "Vérification de l'intégrité du backup..."

    # Vérifier que le fichier n'est pas vide
    if [ ! -s "$backup_file" ]; then
        log_error "Le fichier de backup est vide"
        return 1
    fi

    # Vérifier que le fichier est bien compressé
    if ! gzip -t "$backup_file" 2>/dev/null; then
        log_error "Le fichier de backup est corrompu"
        return 1
    fi

    log_info "Backup vérifié avec succès"
    return 0
}

generate_report() {
    local status=$1
    local backup_file=$2

    echo "==========================================
RAPPORT DE BACKUP POSTGRESQL
==========================================
Date: $(date '+%Y-%m-%d %H:%M:%S')
Base de données: $DB_NAME
Statut: $status
Fichier: $(basename $backup_file)
Taille: $(du -h "$backup_file" | cut -f1)
Rétention: $RETENTION_DAYS jours
S3 activé: $S3_ENABLED
=========================================="
}

# ==========================================
# SCRIPT PRINCIPAL
# ==========================================

main() {
    log_info "=========================================="
    log_info "Démarrage du backup PostgreSQL"
    log_info "=========================================="

    # Vérifications préalables
    check_container
    create_backup_dir

    # Effectuer le backup
    if perform_backup; then
        local compressed_file="$BACKUP_DIR/backup_${DB_NAME}_${DATE}.sql.gz"

        # Vérifier le backup
        if verify_backup "$compressed_file"; then
            log_info "✓ Backup réussi"

            # Générer le rapport
            generate_report "SUCCESS" "$compressed_file"

            # Rotation des anciens backups
            rotate_backups

            # Notification de succès
            send_notification "SUCCESS" "Backup PostgreSQL réussi\nFichier: $(basename $compressed_file)\nTaille: $(du -h "$compressed_file" | cut -f1)"

            exit 0
        else
            log_error "✗ Échec de la vérification du backup"
            send_notification "FAILED" "La vérification du backup a échoué"
            exit 1
        fi
    else
        log_error "✗ Échec du backup"
        send_notification "FAILED" "Le backup PostgreSQL a échoué"
        exit 1
    fi
}

# Exécuter le script principal
main "$@"
