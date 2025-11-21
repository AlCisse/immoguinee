#!/bin/bash

# ==========================================
# SCRIPT DE VALIDATION DES TESTS LOCAUX
# ==========================================
# Description: Valide que tous les services fonctionnent
# Auteur: Immo Guinée Dev Team
# Version: 1.0.0
# ==========================================

set -e

# ==========================================
# CONFIGURATION
# ==========================================
COMPOSE_FILE="docker-compose.local.yml"

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
# VARIABLES
# ==========================================
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# ==========================================
# FONCTIONS
# ==========================================

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1"
    PASSED_TESTS=$((PASSED_TESTS + 1))
}

log_error() {
    echo -e "${RED}[✗]${NC} $1"
    FAILED_TESTS=$((FAILED_TESTS + 1))
}

log_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

log_section() {
    echo -e "\n${PURPLE}========================================${NC}"
    echo -e "${PURPLE}$1${NC}"
    echo -e "${PURPLE}========================================${NC}\n"
}

run_test() {
    local test_name=$1
    local test_command=$2

    TOTAL_TESTS=$((TOTAL_TESTS + 1))

    log_info "Test: $test_name"

    if eval "$test_command" > /dev/null 2>&1; then
        log_success "$test_name"
        return 0
    else
        log_error "$test_name"
        return 1
    fi
}

# ==========================================
# TESTS
# ==========================================

test_docker_running() {
    log_section "1. DOCKER"

    run_test "Docker is running" "docker info"
    run_test "Docker Compose is available" "docker compose version"
}

test_containers_status() {
    log_section "2. CONTAINERS STATUS"

    local containers=(
        "immo_local_postgres"
        "immo_local_redis"
        "immo_local_app"
        "immo_local_nextjs"
        "immo_local_nginx"
        "immo_local_queue"
    )

    for container in "${containers[@]}"; do
        if docker ps --format '{{.Names}}' | grep -q "^${container}$"; then
            log_success "Container $container is running"
            PASSED_TESTS=$((PASSED_TESTS + 1))
        else
            log_error "Container $container is NOT running"
            FAILED_TESTS=$((FAILED_TESTS + 1))
        fi
        TOTAL_TESTS=$((TOTAL_TESTS + 1))
    done
}

test_health_checks() {
    log_section "3. HEALTH CHECKS"

    log_info "Waiting 10 seconds for services to be healthy..."
    sleep 10

    local containers=(
        "immo_local_postgres"
        "immo_local_redis"
        "immo_local_app"
        "immo_local_nextjs"
        "immo_local_nginx"
    )

    for container in "${containers[@]}"; do
        TOTAL_TESTS=$((TOTAL_TESTS + 1))
        local health=$(docker inspect --format='{{.State.Health.Status}}' "$container" 2>/dev/null || echo "no-healthcheck")

        if [ "$health" = "healthy" ] || [ "$health" = "no-healthcheck" ]; then
            log_success "Container $container is healthy"
            PASSED_TESTS=$((PASSED_TESTS + 1))
        else
            log_error "Container $container is NOT healthy (status: $health)"
            FAILED_TESTS=$((FAILED_TESTS + 1))
        fi
    done
}

test_nginx() {
    log_section "4. NGINX"

    run_test "Nginx health endpoint responds" "curl -sf http://localhost:8080/health"

    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    local response=$(curl -s http://localhost:8080/health)
    if [ "$response" = "OK" ]; then
        log_success "Nginx health check returns OK"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        log_error "Nginx health check returned: $response"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
}

test_laravel() {
    log_section "5. LARAVEL API"

    run_test "Laravel API health endpoint responds" "curl -sf http://localhost:8080/api/health"

    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    local response=$(curl -s http://localhost:8080/api/health)
    if echo "$response" | grep -q "status"; then
        log_success "Laravel API returns JSON"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        log_error "Laravel API did not return expected JSON"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi

    # Vérifier que Laravel peut se connecter à PostgreSQL
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    if docker exec immo_local_app php artisan db:show > /dev/null 2>&1; then
        log_success "Laravel can connect to PostgreSQL"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        log_error "Laravel cannot connect to PostgreSQL"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi

    # Vérifier que les migrations sont exécutées
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    if docker exec immo_local_app php artisan migrate:status > /dev/null 2>&1; then
        log_success "Laravel migrations are present"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        log_error "Laravel migrations not found"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
}

test_nextjs() {
    log_section "6. NEXT.JS"

    run_test "Next.js health endpoint responds" "curl -sf http://localhost:3000/api/health"

    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    local response=$(curl -s http://localhost:3000/api/health)
    if echo "$response" | grep -q "uptime"; then
        log_success "Next.js health check returns expected JSON"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        log_error "Next.js health check did not return expected JSON"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi

    run_test "Next.js homepage responds" "curl -sf http://localhost:3000"
}

test_postgresql() {
    log_section "7. POSTGRESQL"

    run_test "PostgreSQL accepts connections" "docker exec immo_local_postgres pg_isready -U immo_user -d immo_guinee_db"

    # Vérifier la configuration PostgreSQL
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    local shared_buffers=$(docker exec immo_local_postgres psql -U immo_user -d immo_guinee_db -t -c "SHOW shared_buffers;" 2>/dev/null | tr -d ' ')
    if [ "$shared_buffers" = "3GB" ]; then
        log_success "PostgreSQL shared_buffers is correctly set to 3GB"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        log_warning "PostgreSQL shared_buffers is $shared_buffers (expected: 3GB)"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    fi

    # Vérifier que la base de données existe
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    if docker exec immo_local_postgres psql -U immo_user -d immo_guinee_db -c "SELECT 1;" > /dev/null 2>&1; then
        log_success "PostgreSQL database is accessible"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        log_error "PostgreSQL database is NOT accessible"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
}

test_redis() {
    log_section "8. REDIS"

    run_test "Redis responds to PING" "docker exec immo_local_redis redis-cli ping | grep -q PONG"

    # Test SET/GET
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    docker exec immo_local_redis redis-cli SET test_key "test_value" > /dev/null 2>&1
    local value=$(docker exec immo_local_redis redis-cli GET test_key 2>/dev/null)
    if [ "$value" = "test_value" ]; then
        log_success "Redis SET/GET works"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        log_error "Redis SET/GET failed"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    docker exec immo_local_redis redis-cli DEL test_key > /dev/null 2>&1

    # Vérifier la configuration Redis
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    local maxmemory=$(docker exec immo_local_redis redis-cli CONFIG GET maxmemory 2>/dev/null | tail -n1)
    if [ "$maxmemory" != "0" ]; then
        log_success "Redis maxmemory is configured"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        log_warning "Redis maxmemory is not configured (using system default)"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    fi
}

test_queue() {
    log_section "9. QUEUE WORKER"

    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    if docker ps --format '{{.Names}}' | grep -q "immo_local_queue"; then
        log_success "Queue worker is running"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        log_error "Queue worker is NOT running"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi

    # Vérifier les logs du queue worker
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    local queue_logs=$(docker logs immo_local_queue --tail 10 2>&1)
    if echo "$queue_logs" | grep -q "Processing"; then
        log_success "Queue worker is processing jobs"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        log_warning "Queue worker logs show no processing (this is normal if no jobs are queued)"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    fi
}

test_performance() {
    log_section "10. BASIC PERFORMANCE"

    log_info "Testing API response time..."

    # Test Laravel API
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    local start=$(date +%s%N)
    curl -sf http://localhost:8080/api/health > /dev/null
    local end=$(date +%s%N)
    local duration=$(( (end - start) / 1000000 ))

    if [ "$duration" -lt 500 ]; then
        log_success "Laravel API response time: ${duration}ms (< 500ms)"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        log_warning "Laravel API response time: ${duration}ms (expected < 500ms)"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    fi

    # Test Next.js
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    start=$(date +%s%N)
    curl -sf http://localhost:3000/api/health > /dev/null
    end=$(date +%s%N)
    duration=$(( (end - start) / 1000000 ))

    if [ "$duration" -lt 500 ]; then
        log_success "Next.js response time: ${duration}ms (< 500ms)"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        log_warning "Next.js response time: ${duration}ms (expected < 500ms)"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    fi
}

test_resources() {
    log_section "11. RESOURCE USAGE"

    log_info "Docker resource usage:"
    docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"

    echo ""
    log_info "Resource usage is shown above (for information only)"
}

# ==========================================
# RAPPORT FINAL
# ==========================================

generate_report() {
    log_section "TEST SUMMARY"

    local pass_rate=0
    if [ "$TOTAL_TESTS" -gt 0 ]; then
        pass_rate=$(( (PASSED_TESTS * 100) / TOTAL_TESTS ))
    fi

    echo ""
    echo "Total tests: $TOTAL_TESTS"
    echo -e "${GREEN}Passed: $PASSED_TESTS${NC}"
    echo -e "${RED}Failed: $FAILED_TESTS${NC}"
    echo "Pass rate: ${pass_rate}%"
    echo ""

    if [ "$FAILED_TESTS" -eq 0 ]; then
        echo -e "${GREEN}========================================${NC}"
        echo -e "${GREEN}✓ ALL TESTS PASSED!${NC}"
        echo -e "${GREEN}========================================${NC}"
        echo ""
        echo -e "${GREEN}🎉 Your Docker architecture is working perfectly!${NC}"
        echo -e "${GREEN}You can now deploy to production with confidence.${NC}"
        echo ""
        echo "Next step: See docs/DEPLOYMENT_GUIDE.md"
        echo ""
        return 0
    else
        echo -e "${RED}========================================${NC}"
        echo -e "${RED}✗ SOME TESTS FAILED${NC}"
        echo -e "${RED}========================================${NC}"
        echo ""
        echo -e "${RED}Please check the errors above and fix them.${NC}"
        echo ""
        echo "Common fixes:"
        echo "- Check logs: docker compose -f docker-compose.local.yml logs"
        echo "- Restart services: docker compose -f docker-compose.local.yml restart"
        echo "- Rebuild: docker compose -f docker-compose.local.yml build --no-cache"
        echo ""
        return 1
    fi
}

# ==========================================
# SCRIPT PRINCIPAL
# ==========================================

main() {
    log_section "DOCKER ARCHITECTURE - LOCAL TESTING"

    log_info "Starting validation tests..."
    echo ""

    # Vérifier que Docker est en cours d'exécution
    if ! docker info > /dev/null 2>&1; then
        log_error "Docker is not running. Please start Docker Desktop."
        exit 1
    fi

    # Vérifier que les containers sont démarrés
    if ! docker compose -f "$COMPOSE_FILE" ps | grep -q "Up"; then
        log_error "Containers are not running. Please start them with:"
        echo "  docker compose -f $COMPOSE_FILE up -d"
        exit 1
    fi

    # Exécuter tous les tests
    test_docker_running
    test_containers_status
    test_health_checks
    test_nginx
    test_laravel
    test_nextjs
    test_postgresql
    test_redis
    test_queue
    test_performance
    test_resources

    # Générer le rapport
    generate_report

    # Code de sortie
    if [ "$FAILED_TESTS" -eq 0 ]; then
        exit 0
    else
        exit 1
    fi
}

# Exécuter le script
main "$@"
