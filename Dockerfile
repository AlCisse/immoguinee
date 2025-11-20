# Dockerfile personnalisé pour n8n avec Docker CLI
FROM n8nio/n8n:latest

# Passer en root pour installer des packages
USER root

# Installer Docker CLI et Docker Compose V2
RUN apk add --no-cache \
    docker-cli \
    docker-compose

# Créer le groupe docker s'il n'existe pas et ajouter l'utilisateur node
RUN addgroup -S docker 2>/dev/null || true && \
    addgroup node docker 2>/dev/null || true

# Revenir à l'utilisateur node
USER node

# Définir le répertoire de travail
WORKDIR /home/node

# Labels pour documentation
LABEL maintainer="Immo Guinée Dev Team"
LABEL description="n8n avec Docker CLI pour gestion des conteneurs"
LABEL version="1.0.0"