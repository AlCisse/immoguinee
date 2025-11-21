#!/bin/bash

# ==========================================
# SCRIPT D'AUDIT DE SÉCURITÉ
# ==========================================
# Description: Audit complet des vulnérabilités
# Laravel, Next.js, Docker, Système
# Auteur: Immo Guinée Dev Team
# Version: 1.0.0
# ==========================================

set -e

# ==========================================
# CONFIGURATION
# ==========================================
REPORT_DIR="/var/log/immoguinee/security"
REPORT_FILE="$REPORT_DIR/security_audit_$(date +%Y%m%d_%H%M%S).txt"
ALERT_EMAIL="${SECURITY_EMAIL:-}"
SLACK_WEBHOOK="${SLACK_WEBHOOK_URL:-}"

# ==========================================
# COULEURS
# ==========================================
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# ==========================================
# FONCTIONS
# ==========================================

log_info() {
    echo -e "${GREEN}[INFO]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$REPORT_FILE"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$REPORT_FILE"
}

log_error() {
    echo -e "${RED}[CRITICAL]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$REPORT_FILE"
}

log_section() {
    echo -e "\n${PURPLE}========================================${NC}" | tee -a "$REPORT_FILE"
    echo -e "${PURPLE}$1${NC}" | tee -a "$REPORT_FILE"
    echo -e "${PURPLE}========================================${NC}\n" | tee -a "$REPORT_FILE"
}

send_alert() {
    local severity=$1
    local message=$2

    if [ -n "$SLACK_WEBHOOK" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"🔒 [$severity] Security Audit\n$message\"}" \
            "$SLACK_WEBHOOK" > /dev/null 2>&1 || true
    fi

    if [ -n "$ALERT_EMAIL" ]; then
        echo "$message" | mail -s "[$severity] Security Audit Immo Guinée" "$ALERT_EMAIL" || true
    fi
}

# ==========================================
# AUDITS DE DÉPENDANCES
# ==========================================

audit_composer() {
    log_section "AUDIT COMPOSER (Laravel)"

    if [ ! -f "backend/composer.json" ]; then
        log_warning "composer.json not found"
        return
    fi

    cd backend

    log_info "Running composer audit..."
    if composer audit --format=json > /tmp/composer_audit.json 2>&1; then
        log_info "✓ No vulnerabilities found in Composer packages"
    else
        local vuln_count=$(cat /tmp/composer_audit.json | grep -c "cve" 2>/dev/null || echo "0")
        if [ "$vuln_count" -gt "0" ]; then
            log_error "✗ Found $vuln_count vulnerabilities in Composer packages"
            cat /tmp/composer_audit.json | tee -a "$REPORT_FILE"
            send_alert "CRITICAL" "Vulnérabilités Composer détectées: $vuln_count"
        fi
    fi

    # Vérifier les packages obsolètes
    log_info "\nChecking outdated packages..."
    composer outdated --direct --format=json > /tmp/composer_outdated.json 2>&1 || true
    local outdated_count=$(cat /tmp/composer_outdated.json | grep -c "name" 2>/dev/null || echo "0")
    if [ "$outdated_count" -gt "0" ]; then
        log_warning "⚠️  $outdated_count packages are outdated"
        composer outdated --direct | tee -a "$REPORT_FILE"
    fi

    cd ..
}

audit_npm() {
    log_section "AUDIT NPM (Next.js)"

    if [ ! -f "frontend/immoguinee/package.json" ]; then
        log_warning "package.json not found"
        return
    fi

    cd frontend/immoguinee

    log_info "Running npm audit..."
    if npm audit --json > /tmp/npm_audit.json 2>&1; then
        log_info "✓ No vulnerabilities found in npm packages"
    else
        local npm_audit=$(cat /tmp/npm_audit.json)
        local critical=$(echo "$npm_audit" | grep -o '"critical":[0-9]*' | cut -d: -f2 || echo "0")
        local high=$(echo "$npm_audit" | grep -o '"high":[0-9]*' | cut -d: -f2 || echo "0")
        local moderate=$(echo "$npm_audit" | grep -o '"moderate":[0-9]*' | cut -d: -f2 || echo "0")
        local low=$(echo "$npm_audit" | grep -o '"low":[0-9]*' | cut -d: -f2 || echo "0")

        log_error "✗ NPM Vulnerabilities found:"
        log_error "  Critical: $critical"
        log_error "  High: $high"
        log_error "  Moderate: $moderate"
        log_error "  Low: $low"

        if [ "$critical" -gt "0" ] || [ "$high" -gt "0" ]; then
            send_alert "CRITICAL" "Vulnérabilités NPM critiques: $critical critical, $high high"
        fi

        npm audit | tee -a "$REPORT_FILE"
    fi

    cd ../..
}

# ==========================================
# AUDITS LARAVEL
# ==========================================

audit_laravel_security() {
    log_section "AUDIT SÉCURITÉ LARAVEL"

    cd backend

    # Vérifier .env
    log_info "Checking .env configuration..."
    if [ -f ".env" ]; then
        # APP_DEBUG doit être false en production
        if grep -q "APP_DEBUG=true" .env; then
            log_error "✗ APP_DEBUG is true (should be false in production)"
            send_alert "CRITICAL" "APP_DEBUG est activé en production!"
        else
            log_info "✓ APP_DEBUG is false"
        fi

        # APP_ENV doit être production
        if ! grep -q "APP_ENV=production" .env; then
            log_warning "⚠️  APP_ENV is not set to production"
        else
            log_info "✓ APP_ENV is production"
        fi

        # Vérifier APP_KEY
        if ! grep -q "APP_KEY=base64:" .env; then
            log_error "✗ APP_KEY is not properly set"
        else
            log_info "✓ APP_KEY is properly configured"
        fi
    fi

    # Vérifier les permissions des fichiers
    log_info "\nChecking file permissions..."
    if [ -d "storage" ]; then
        local storage_perms=$(stat -c "%a" storage)
        if [ "$storage_perms" != "775" ]; then
            log_warning "⚠️  storage/ permissions are $storage_perms (recommended: 775)"
        else
            log_info "✓ storage/ permissions are correct"
        fi
    fi

    # Vérifier les routes non protégées
    log_info "\nChecking routes..."
    if [ -f "routes/api.php" ]; then
        local unprotected_routes=$(grep -c "Route::" routes/api.php 2>/dev/null || echo "0")
        local protected_routes=$(grep -c "middleware" routes/api.php 2>/dev/null || echo "0")
        log_info "Total API routes: $unprotected_routes"
        log_info "Protected routes: $protected_routes"

        if [ "$protected_routes" -lt "$(($unprotected_routes / 2))" ]; then
            log_warning "⚠️  Many routes are not protected by middleware"
        fi
    fi

    # Vérifier la configuration CORS
    log_info "\nChecking CORS configuration..."
    if [ -f "config/cors.php" ]; then
        if grep -q "'allowed_origins' => \['*'\]" config/cors.php; then
            log_warning "⚠️  CORS allows all origins (*)"
        else
            log_info "✓ CORS is properly configured"
        fi
    fi

    cd ..
}

# ==========================================
# AUDITS NEXT.JS
# ==========================================

audit_nextjs_security() {
    log_section "AUDIT SÉCURITÉ NEXT.JS"

    cd frontend/immoguinee

    # Vérifier next.config.js
    log_info "Checking next.config.js..."
    if [ -f "next.config.js" ]; then
        # Vérifier les headers de sécurité
        if grep -q "Content-Security-Policy" next.config.js; then
            log_info "✓ Content-Security-Policy is configured"
        else
            log_warning "⚠️  Content-Security-Policy is not configured"
        fi

        if grep -q "X-Frame-Options" next.config.js; then
            log_info "✓ X-Frame-Options is configured"
        else
            log_warning "⚠️  X-Frame-Options is not configured"
        fi

        # Vérifier removeConsole en production
        if grep -q "removeConsole" next.config.js; then
            log_info "✓ removeConsole is configured"
        else
            log_warning "⚠️  console.log will be present in production"
        fi
    fi

    # Vérifier les variables d'environnement exposées
    log_info "\nChecking exposed environment variables..."
    if [ -f ".env.local" ]; then
        local public_vars=$(grep -c "NEXT_PUBLIC_" .env.local 2>/dev/null || echo "0")
        log_info "Public environment variables: $public_vars"

        # Vérifier si des secrets sont exposés
        if grep -q "NEXT_PUBLIC.*SECRET" .env.local; then
            log_error "✗ Secret values are exposed via NEXT_PUBLIC_"
            send_alert "CRITICAL" "Secrets exposés dans les variables Next.js publiques"
        fi
    fi

    cd ../..
}

# ==========================================
# AUDITS DOCKER
# ==========================================

audit_docker_security() {
    log_section "AUDIT SÉCURITÉ DOCKER"

    # Vérifier les images Docker
    log_info "Checking Docker images..."
    docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}" | tee -a "$REPORT_FILE"

    # Vérifier les conteneurs en root
    log_info "\nChecking containers running as root..."
    for container in $(docker ps --format "{{.Names}}"); do
        local user=$(docker exec "$container" whoami 2>/dev/null || echo "unknown")
        if [ "$user" = "root" ]; then
            log_warning "⚠️  $container is running as root"
        else
            log_info "✓ $container is running as $user"
        fi
    done

    # Vérifier les volumes montés
    log_info "\nChecking Docker volumes..."
    docker volume ls | tee -a "$REPORT_FILE"

    # Scan d'images (si Trivy est installé)
    if command -v trivy >/dev/null 2>&1; then
        log_info "\nScanning Docker images with Trivy..."
        for image in $(docker images --format "{{.Repository}}:{{.Tag}}" | grep immoguinee); do
            log_info "Scanning $image..."
            trivy image --severity HIGH,CRITICAL "$image" | tee -a "$REPORT_FILE"
        done
    else
        log_info "Trivy not installed, skipping image scanning"
        log_info "Install with: curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin"
    fi
}

# ==========================================
# AUDITS SYSTÈME
# ==========================================

audit_system_security() {
    log_section "AUDIT SÉCURITÉ SYSTÈME"

    # Vérifier les mises à jour disponibles
    log_info "Checking system updates..."
    local updates=$(apt list --upgradable 2>/dev/null | grep -c "upgradable" || echo "0")
    log_info "System updates available: $updates"
    if [ "$updates" -gt "50" ]; then
        log_warning "⚠️  Many system updates are available"
    fi

    # Vérifier le firewall
    log_info "\nChecking firewall status..."
    if command -v ufw >/dev/null 2>&1; then
        ufw status | tee -a "$REPORT_FILE"
    else
        log_warning "UFW firewall not installed"
    fi

    # Vérifier les ports ouverts
    log_info "\nChecking open ports..."
    netstat -tuln 2>/dev/null | grep LISTEN | tee -a "$REPORT_FILE"

    # Vérifier les utilisateurs système
    log_info "\nChecking users with UID 0 (root privileges)..."
    awk -F: '$3 == 0 {print $1}' /etc/passwd | tee -a "$REPORT_FILE"

    # Vérifier les tentatives de connexion échouées
    log_info "\nFailed login attempts (last 24h):"
    local failed_attempts=$(grep "Failed password" /var/log/auth.log 2>/dev/null | grep "$(date +%b\ %d)" | wc -l || echo "0")
    log_info "Failed attempts: $failed_attempts"
    if [ "$failed_attempts" -gt "100" ]; then
        log_warning "⚠️  High number of failed login attempts"
        send_alert "WARNING" "Nombre élevé de tentatives de connexion échouées: $failed_attempts"
    fi

    # Vérifier SSL/TLS
    log_info "\nChecking SSL certificates..."
    if [ -d "docker/nginx/ssl" ]; then
        for cert in docker/nginx/ssl/*.pem; do
            if [ -f "$cert" ]; then
                local expiry=$(openssl x509 -enddate -noout -in "$cert" 2>/dev/null | cut -d= -f2)
                log_info "Certificate: $(basename $cert) - Expires: $expiry"
            fi
        done
    else
        log_warning "⚠️  No SSL certificates found"
    fi
}

# ==========================================
# AUDITS SQL INJECTION
# ==========================================

audit_sql_injection() {
    log_section "AUDIT SQL INJECTION"

    cd backend

    log_info "Scanning for potential SQL injection vulnerabilities..."

    # Rechercher les requêtes SQL non sécurisées
    local unsafe_queries=0

    # Rechercher DB::raw() sans paramètres bindés
    if grep -r "DB::raw" app/ 2>/dev/null | grep -v "->bindings" > /tmp/sql_raw.txt; then
        unsafe_queries=$((unsafe_queries + $(wc -l < /tmp/sql_raw.txt)))
        log_warning "⚠️  Found DB::raw() usage without parameter binding:"
        cat /tmp/sql_raw.txt | head -10 | tee -a "$REPORT_FILE"
    fi

    # Rechercher les requêtes concaténées
    if grep -r '\$.*\.' app/ 2>/dev/null | grep -i "select\|insert\|update\|delete" > /tmp/sql_concat.txt; then
        log_warning "⚠️  Found string concatenation in SQL queries (potential SQL injection):"
        cat /tmp/sql_concat.txt | head -5 | tee -a "$REPORT_FILE"
    fi

    if [ "$unsafe_queries" -gt "0" ]; then
        log_warning "Found $unsafe_queries potentially unsafe SQL queries"
        send_alert "WARNING" "Potentielles vulnérabilités SQL Injection détectées"
    else
        log_info "✓ No obvious SQL injection vulnerabilities found"
    fi

    cd ..
}

# ==========================================
# AUDITS XSS
# ==========================================

audit_xss() {
    log_section "AUDIT XSS (Cross-Site Scripting)"

    # Laravel
    cd backend
    log_info "Checking Laravel for XSS vulnerabilities..."

    # Rechercher {!! !!} non échappé
    if grep -r "{!!" resources/views/ 2>/dev/null > /tmp/xss_laravel.txt; then
        local xss_count=$(wc -l < /tmp/xss_laravel.txt)
        log_warning "⚠️  Found $xss_count instances of unescaped output {!! !!}"
        cat /tmp/xss_laravel.txt | head -10 | tee -a "$REPORT_FILE"
    else
        log_info "✓ No unescaped Blade output found"
    fi

    cd ..

    # Next.js
    cd frontend/immoguinee
    log_info "\nChecking Next.js for XSS vulnerabilities..."

    # Rechercher dangerouslySetInnerHTML
    if grep -r "dangerouslySetInnerHTML" . 2>/dev/null | grep -v node_modules > /tmp/xss_nextjs.txt; then
        local xss_count=$(wc -l < /tmp/xss_nextjs.txt)
        log_warning "⚠️  Found $xss_count instances of dangerouslySetInnerHTML"
        cat /tmp/xss_nextjs.txt | head -10 | tee -a "$REPORT_FILE"
    else
        log_info "✓ No dangerouslySetInnerHTML usage found"
    fi

    cd ../..
}

# ==========================================
# RAPPORT FINAL
# ==========================================

generate_report() {
    log_section "SECURITY AUDIT SUMMARY"

    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')

    cat << EOF | tee -a "$REPORT_FILE"

==========================================
RAPPORT D'AUDIT DE SÉCURITÉ
==========================================
Date: $timestamp
Rapport: $REPORT_FILE

✓ Audit terminé avec succès

Recommandations:
1. Corrigez toutes les vulnérabilités CRITICAL en priorité
2. Mettez à jour les packages obsolètes
3. Configurez les headers de sécurité manquants
4. Activez le firewall et limitez les ports ouverts
5. Configurez SSL/TLS pour HTTPS
6. Activez les logs d'audit pour toutes les opérations sensibles

Pour plus de détails, consultez le rapport complet.
==========================================
EOF
}

# ==========================================
# SCRIPT PRINCIPAL
# ==========================================

main() {
    mkdir -p "$REPORT_DIR"

    log_info "=========================================="
    log_info "DÉMARRAGE DE L'AUDIT DE SÉCURITÉ"
    log_info "=========================================="

    # Exécuter tous les audits
    audit_composer
    audit_npm
    audit_laravel_security
    audit_nextjs_security
    audit_docker_security
    audit_system_security
    audit_sql_injection
    audit_xss

    # Générer le rapport final
    generate_report

    log_info "\n✓ Audit de sécurité terminé"
    log_info "Rapport disponible: $REPORT_FILE"
}

# Exécuter le script
main "$@"
