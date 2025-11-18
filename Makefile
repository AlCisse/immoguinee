.PHONY: help install up down restart logs clean db-migrate db-fresh test

# Couleurs
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[1;33m
NC := \033[0m

help: ## Afficher l'aide
	@echo "$(BLUE)Plateforme Immobilière Guinée - Commandes disponibles$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""

install: ## Installation initiale du projet
	@echo "$(YELLOW)Installation du projet...$(NC)"
	@chmod +x init.sh
	@./init.sh

up: ## Démarrer tous les services
	@echo "$(YELLOW)Démarrage des services...$(NC)"
	@docker-compose up -d
	@echo "$(GREEN)✓ Services démarrés$(NC)"

down: ## Arrêter tous les services
	@echo "$(YELLOW)Arrêt des services...$(NC)"
	@docker-compose down
	@echo "$(GREEN)✓ Services arrêtés$(NC)"

restart: ## Redémarrer tous les services
	@echo "$(YELLOW)Redémarrage des services...$(NC)"
	@docker-compose restart
	@echo "$(GREEN)✓ Services redémarrés$(NC)"

logs: ## Voir les logs en temps réel
	@docker-compose logs -f

logs-app: ## Voir les logs Laravel
	@docker-compose logs -f app

logs-nginx: ## Voir les logs Nginx
	@docker-compose logs -f nginx

logs-postgres: ## Voir les logs PostgreSQL
	@docker-compose logs -f postgres

ps: ## Voir l'état des services
	@docker-compose ps

shell: ## Entrer dans le conteneur Laravel
	@docker-compose exec app bash

shell-db: ## Entrer dans PostgreSQL
	@docker-compose exec postgres psql -U immo_user -d immo_guinee_db

db-migrate: ## Exécuter les migrations
	@echo "$(YELLOW)Exécution des migrations...$(NC)"
	@docker-compose exec app php artisan migrate
	@echo "$(GREEN)✓ Migrations terminées$(NC)"

db-fresh: ## Reset et re-migration de la base de données
	@echo "$(YELLOW)Reset de la base de données...$(NC)"
	@docker-compose exec app php artisan migrate:fresh --seed
	@echo "$(GREEN)✓ Base de données réinitialisée$(NC)"

db-seed: ## Peupler la base de données
	@docker-compose exec app php artisan db:seed

cache-clear: ## Vider tous les caches
	@echo "$(YELLOW)Nettoyage des caches...$(NC)"
	@docker-compose exec app php artisan cache:clear
	@docker-compose exec app php artisan config:clear
	@docker-compose exec app php artisan route:clear
	@docker-compose exec app php artisan view:clear
	@echo "$(GREEN)✓ Caches vidés$(NC)"

optimize: ## Optimiser Laravel
	@echo "$(YELLOW)Optimisation de Laravel...$(NC)"
	@docker-compose exec app php artisan optimize
	@docker-compose exec app php artisan config:cache
	@docker-compose exec app php artisan route:cache
	@docker-compose exec app php artisan view:cache
	@echo "$(GREEN)✓ Laravel optimisé$(NC)"

test: ## Exécuter les tests
	@docker-compose exec app php artisan test

test-coverage: ## Tests avec couverture de code
	@docker-compose exec app php artisan test --coverage

composer-install: ## Installer les dépendances Composer
	@docker-compose exec app composer install

composer-update: ## Mettre à jour les dépendances Composer
	@docker-compose exec app composer update

npm-install: ## Installer les dépendances npm (frontend)
	@docker-compose exec node npm install

npm-dev: ## Démarrer le serveur de développement React
	@docker-compose exec node npm run dev

queue-work: ## Démarrer le worker de queue
	@docker-compose exec app php artisan queue:work

queue-restart: ## Redémarrer le worker de queue
	@docker-compose exec app php artisan queue:restart

tinker: ## Ouvrir Laravel Tinker
	@docker-compose exec app php artisan tinker

backup-db: ## Sauvegarder la base de données
	@echo "$(YELLOW)Sauvegarde de la base de données...$(NC)"
	@mkdir -p backups
	@docker-compose exec postgres pg_dump -U immo_user immo_guinee_db > backups/backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "$(GREEN)✓ Sauvegarde créée dans backups/$(NC)"

restore-db: ## Restaurer la dernière sauvegarde
	@echo "$(YELLOW)Restauration de la base de données...$(NC)"
	@docker-compose exec -T postgres psql -U immo_user -d immo_guinee_db < $$(ls -t backups/*.sql | head -1)
	@echo "$(GREEN)✓ Base de données restaurée$(NC)"

clean: ## Nettoyer Docker (⚠️  supprime les volumes)
	@echo "$(YELLOW)Nettoyage Docker...$(NC)"
	@docker-compose down -v
	@docker system prune -f
	@echo "$(GREEN)✓ Nettoyage terminé$(NC)"

build: ## Reconstruire les images Docker
	@echo "$(YELLOW)Reconstruction des images...$(NC)"
	@docker-compose build --no-cache
	@echo "$(GREEN)✓ Images reconstruites$(NC)"

stats: ## Voir les statistiques des conteneurs
	@docker stats --no-stream

status: ## Vérifier l'état de tous les services
	@echo "$(BLUE)État des services:$(NC)"
	@echo ""
	@docker-compose ps
	@echo ""
	@echo "$(BLUE)URLs disponibles:$(NC)"
	@echo "  Laravel API:        http://localhost:8080"
	@echo "  React Web:          http://localhost:3000"
	@echo "  pgAdmin:            http://localhost:8081"
	@echo "  n8n:                http://localhost:5678"
	@echo "  MailHog:            http://localhost:8025"
	@echo "  MinIO Console:      http://localhost:9001"
	@echo "  Elasticsearch:      http://localhost:9200"
