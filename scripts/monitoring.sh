#!/bin/bash

# ==========================================
# SCRIPT DE MONITORING SYSTÈME
# ==========================================
# Description: Surveillance CPU, RAM, Disque, Docker, Logs
# Auteur: Immo Guinée Dev Team
# Version: 1.0.0
# ==========================================

set -e

# ==========================================
# CONFIGURATION
# ==========================================
LOG_DIR="/var/log/immoguinee"
REPORT_FILE="$LOG_DIR/monitoring_$(date +%Y%m%d).log"
ALERT_EMAIL="${MONITORING_EMAIL:-}"
SLACK_WEBHOOK="${SLACK_WEBHOOK_URL:-}"

# Seuils d'alerte
CPU_THRESHOLD=80
RAM_THRESHOLD=85
DISK_THRESHOLD=85
CONTAINER_CHECK_INTERVAL=60

# Containers à surveiller
CONTAINERS=(
    "immo_guinee_postgres_prod"
    "immo_guinee_redis_prod"
    "immo_guinee_app_prod"
    "immo_guinee_nextjs_prod"
    "immo_guinee_nginx_prod"
    "immo_guinee_queue_prod"
)

# ==========================================
# COULEURS
# ==========================================
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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
    echo -e "${RED}[ERROR]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$REPORT_FILE"
}

log_section() {
    echo -e "\n${BLUE}========================================${NC}" | tee -a "$REPORT_FILE"
    echo -e "${BLUE}$1${NC}" | tee -a "$REPORT_FILE"
    echo -e "${BLUE}========================================${NC}\n" | tee -a "$REPORT_FILE"
}

send_alert() {
    local severity=$1
    local message=$2

    # Slack
    if [ -n "$SLACK_WEBHOOK" ]; then
        local emoji="⚠️"
        [ "$severity" = "CRITICAL" ] && emoji="🚨"
        [ "$severity" = "WARNING" ] && emoji="⚠️"
        [ "$severity" = "INFO" ] && emoji="ℹ️"

        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"$emoji [$severity] Immo Guinée Monitoring\n$message\"}" \
            "$SLACK_WEBHOOK" > /dev/null 2>&1 || true
    fi

    # Email
    if [ -n "$ALERT_EMAIL" ]; then
        echo "$message" | mail -s "[$severity] Monitoring Immo Guinée" "$ALERT_EMAIL" || true
    fi
}

# ==========================================
# MONITORING SYSTÈME
# ==========================================

check_cpu() {
    log_section "CPU USAGE"

    # CPU global
    local cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | sed 's/%us,//')
    local cpu_idle=$(top -bn1 | grep "Cpu(s)" | awk '{print $8}' | sed 's/%id,//')
    local cpu_used=$(echo "100 - $cpu_idle" | bc 2>/dev/null || echo "0")

    log_info "CPU Usage: ${cpu_used}%"
    log_info "CPU Idle: ${cpu_idle}%"

    # Load average
    local load_avg=$(uptime | awk -F'load average:' '{print $2}')
    log_info "Load Average:$load_avg"

    # Alert si seuil dépassé
    if (( $(echo "$cpu_used > $CPU_THRESHOLD" | bc -l 2>/dev/null || echo 0) )); then
        log_warning "⚠️  CPU usage élevé: ${cpu_used}% (seuil: ${CPU_THRESHOLD}%)"
        send_alert "WARNING" "CPU usage élevé: ${cpu_used}%"
    fi

    # Top 5 processus consommant le plus de CPU
    log_info "\nTop 5 processus CPU:"
    ps aux --sort=-%cpu | head -6 | tail -5 | tee -a "$REPORT_FILE"
}

check_memory() {
    log_section "MEMORY USAGE"

    # Mémoire totale et utilisée
    local mem_total=$(free -m | awk 'NR==2{print $2}')
    local mem_used=$(free -m | awk 'NR==2{print $3}')
    local mem_free=$(free -m | awk 'NR==2{print $4}')
    local mem_available=$(free -m | awk 'NR==2{print $7}')
    local mem_percent=$(echo "scale=2; ($mem_used / $mem_total) * 100" | bc)

    log_info "Total RAM: ${mem_total} MB"
    log_info "Used RAM: ${mem_used} MB (${mem_percent}%)"
    log_info "Free RAM: ${mem_free} MB"
    log_info "Available RAM: ${mem_available} MB"

    # Swap
    local swap_total=$(free -m | awk 'NR==3{print $2}')
    local swap_used=$(free -m | awk 'NR==3{print $3}')
    log_info "Swap Used: ${swap_used} MB / ${swap_total} MB"

    # Alert si seuil dépassé
    if (( $(echo "$mem_percent > $RAM_THRESHOLD" | bc -l 2>/dev/null || echo 0) )); then
        log_warning "⚠️  RAM usage élevé: ${mem_percent}% (seuil: ${RAM_THRESHOLD}%)"
        send_alert "WARNING" "RAM usage élevé: ${mem_percent}%\nUsed: ${mem_used}MB / ${mem_total}MB"
    fi

    # Top 5 processus consommant le plus de RAM
    log_info "\nTop 5 processus RAM:"
    ps aux --sort=-%mem | head -6 | tail -5 | tee -a "$REPORT_FILE"
}

check_disk() {
    log_section "DISK USAGE"

    # Utilisation des disques
    df -h | grep -E '^/dev/' | tee -a "$REPORT_FILE" | while read line; do
        local usage=$(echo $line | awk '{print $5}' | sed 's/%//')
        local mount=$(echo $line | awk '{print $6}')

        if [ "$usage" -gt "$DISK_THRESHOLD" ]; then
            log_warning "⚠️  Disque plein: $mount ($usage%)"
            send_alert "WARNING" "Disque plein: $mount utilise $usage% (seuil: ${DISK_THRESHOLD}%)"
        fi
    done

    # IOPS (si disponible)
    if command -v iostat >/dev/null 2>&1; then
        log_info "\nDisk I/O Statistics:"
        iostat -x 1 2 | tail -n +4 | head -10 | tee -a "$REPORT_FILE"
    fi

    # Inodes
    log_info "\nInode Usage:"
    df -i | grep -E '^/dev/' | tee -a "$REPORT_FILE"
}

check_docker() {
    log_section "DOCKER CONTAINERS"

    # Status de tous les containers
    log_info "Container Status:"
    docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Image}}" | tee -a "$REPORT_FILE"

    # Vérifier chaque container critique
    for container in "${CONTAINERS[@]}"; do
        if docker ps | grep -q "$container"; then
            log_info "✓ $container: Running"

            # Stats du container
            local stats=$(docker stats --no-stream --format "{{.Name}}: CPU {{.CPUPerc}} | RAM {{.MemUsage}}" "$container")
            log_info "  └─ $stats"
        else
            log_error "✗ $container: Not running!"
            send_alert "CRITICAL" "Container arrêté: $container"
        fi
    done

    # Docker system info
    log_info "\nDocker System:"
    docker system df | tee -a "$REPORT_FILE"
}

check_network() {
    log_section "NETWORK STATS"

    # Connexions actives
    local connections=$(netstat -an 2>/dev/null | grep ESTABLISHED | wc -l)
    log_info "Active connections: $connections"

    # Ports en écoute
    log_info "\nListening ports:"
    netstat -tlnp 2>/dev/null | grep LISTEN | awk '{print $4, $7}' | tee -a "$REPORT_FILE"

    # Bandwidth (si disponible)
    if command -v vnstat >/dev/null 2>&1; then
        log_info "\nNetwork Bandwidth:"
        vnstat -d | tail -10 | tee -a "$REPORT_FILE"
    fi
}

check_logs() {
    log_section "APPLICATION LOGS"

    # Laravel errors (dernières 24h)
    log_info "Laravel Errors (last 24h):"
    if [ -f "backend/storage/logs/laravel.log" ]; then
        local error_count=$(grep -c "ERROR" backend/storage/logs/laravel.log 2>/dev/null || echo "0")
        log_info "Total errors: $error_count"

        if [ "$error_count" -gt "10" ]; then
            log_warning "⚠️  Nombre élevé d'erreurs Laravel: $error_count"
            send_alert "WARNING" "Nombre élevé d'erreurs Laravel: $error_count dans les dernières 24h"

            # Afficher les dernières erreurs
            log_info "\nLast 5 Laravel errors:"
            grep "ERROR" backend/storage/logs/laravel.log | tail -5 | tee -a "$REPORT_FILE"
        fi
    fi

    # Nginx errors
    log_info "\nNginx Errors (last 100 lines):"
    docker logs immo_guinee_nginx_prod 2>&1 | grep -i error | tail -10 | tee -a "$REPORT_FILE" || log_info "No nginx errors"

    # PostgreSQL logs
    log_info "\nPostgreSQL slow queries:"
    docker exec immo_guinee_postgres_prod psql -U immo_user -d immo_guinee_db -c \
        "SELECT query, calls, total_time, mean_time FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 5;" 2>/dev/null | tee -a "$REPORT_FILE" || log_info "pg_stat_statements not available"
}

check_security() {
    log_section "SECURITY CHECKS"

    # Failed SSH attempts
    log_info "Failed SSH attempts (last 24h):"
    local failed_ssh=$(grep "Failed password" /var/log/auth.log 2>/dev/null | grep "$(date +%b\ %d)" | wc -l || echo "0")
    log_info "Failed attempts: $failed_ssh"

    if [ "$failed_ssh" -gt "50" ]; then
        log_warning "⚠️  Nombre élevé de tentatives SSH échouées: $failed_ssh"
        send_alert "WARNING" "Nombre élevé de tentatives SSH échouées: $failed_ssh"
    fi

    # Process suspects
    log_info "\nListening services:"
    lsof -i -P -n 2>/dev/null | grep LISTEN | tee -a "$REPORT_FILE" || netstat -tlnp 2>/dev/null | grep LISTEN | tee -a "$REPORT_FILE"
}

generate_summary() {
    log_section "MONITORING SUMMARY"

    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    local hostname=$(hostname)
    local uptime=$(uptime -p)

    cat << EOF | tee -a "$REPORT_FILE"
Serveur: $hostname
Date: $timestamp
Uptime: $uptime

Status: ✓ Monitoring completed
Report: $REPORT_FILE

Consultez le rapport complet pour plus de détails.
EOF
}

# ==========================================
# SCRIPT PRINCIPAL
# ==========================================

main() {
    # Créer le dossier de logs
    mkdir -p "$LOG_DIR"

    log_info "=========================================="
    log_info "DÉMARRAGE DU MONITORING"
    log_info "=========================================="

    # Exécuter tous les checks
    check_cpu
    check_memory
    check_disk
    check_docker
    check_network
    check_logs
    check_security

    # Générer le résumé
    generate_summary

    log_info "\n✓ Monitoring terminé avec succès"
}

# Exécuter le script
main "$@"
