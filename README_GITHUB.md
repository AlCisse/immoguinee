# 🏠 Plateforme Immobilière Guinée

> Une plateforme immobilière complète et moderne pour le marché guinéen, avec agents IA intégrés

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Docker](https://img.shields.io/badge/docker-ready-brightgreen.svg)](docker-compose.yml)
[![Laravel](https://img.shields.io/badge/laravel-10-red.svg)](https://laravel.com)
[![React](https://img.shields.io/badge/react-18-blue.svg)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/postgresql-16-blue.svg)](https://postgresql.org)

## 📋 Aperçu

Plateforme complète de gestion immobilière inspirée d'Immowelt.de, adaptée au marché guinéen avec :
- ✅ Backend API Laravel + PostgreSQL
- ✅ Frontend React.js responsive
- ✅ Application mobile React Native
- ✅ 7 Agents IA avec n8n
- ✅ Recherche avancée Elasticsearch
- ✅ Stockage MinIO S3-compatible
- ✅ Cache Redis multi-niveaux
- ✅ Infrastructure Docker complète

## 🚀 Démarrage Rapide

### Prérequis
- Docker Desktop (≥ 20.10)
- 8GB RAM minimum
- 20GB espace disque

### Installation en 3 minutes

```bash
# 1. Cloner le projet
git clone https://github.com/votre-repo/immo-guinee.git
cd immo-guinee

# 2. Lancer l'installation automatique
chmod +x init.sh && ./init.sh

# 3. Vérifier
make status
```

### Accès aux services

| Service | URL | Identifiants |
|---------|-----|--------------|
| **Laravel API** | http://localhost:8080 | - |
| **React Web** | http://localhost:3000 | - |
| **pgAdmin** | http://localhost:8081 | admin@immguinee.local / admin123 |
| **n8n (IA)** | http://localhost:5678 | admin / admin123 |
| **MailHog** | http://localhost:8025 | - |
| **MinIO** | http://localhost:9001 | minio_admin / minio_password_123 |

## 📚 Documentation

- 📖 [**Guide Complet**](README.md) - Documentation détaillée
- ⚡ [**Quick Start**](QUICKSTART.md) - Installation rapide
- 🤖 [**Agents IA**](GUIDE_AGENTS_IA.md) - Configuration n8n
- 🏗️ [**Architecture**](ARCHITECTURE.md) - Schémas techniques
- ✅ [**Checklist**](CHECKLIST.md) - Plan de développement
- 💻 [**VS Code Setup**](VSCODE_SETUP.md) - Configuration IDE

## 🛠️ Stack Technique

### Backend
- **Framework**: Laravel 10
- **Language**: PHP 8.2
- **Database**: PostgreSQL 16
- **Cache**: Redis 7
- **Search**: Elasticsearch 8
- **Storage**: MinIO (S3-compatible)

### Frontend
- **Web**: React 18 + TailwindCSS
- **Mobile**: React Native + Expo
- **State**: React Query + Context API

### DevOps & IA
- **Container**: Docker + Docker Compose
- **Automation**: n8n
- **AI**: Claude AI integration
- **Email**: MailHog (dev) / SMTP (prod)

## 🎯 Fonctionnalités

### Pour les Utilisateurs
- 🔍 Recherche avancée avec filtres intelligents
- 📱 Application mobile native iOS/Android
- 💬 Messagerie interne temps réel
- ⭐ Favoris et alertes personnalisées
- 📊 Tableau de bord complet

### Pour les Agents/Agences
- 📈 Analytics et statistiques détaillées
- 🎨 Publication d'annonces simplifiée
- 📸 Upload multiple d'images optimisé
- 🤝 Gestion des rendez-vous
- ⚡ Mise en avant des annonces

### Agents IA (n8n)
1. 🛡️ **Modération automatique** - Vérification des annonces
2. 🔍 **Recherche intelligente** - Compréhension des requêtes
3. 📱 **Notifications** - Alertes personnalisées
4. 💰 **Estimation prix** - IA de valorisation
5. 💬 **Chatbot support** - Assistance 24/7
6. 📊 **Analytics** - Insights automatiques
7. 📸 **Qualité photos** - Vérification automatique

## 🗄️ Structure du Projet

```
immo-guinee/
├── backend/              # Laravel API
│   ├── app/
│   ├── database/
│   ├── routes/
│   └── ...
├── frontend/             # React Web App
│   ├── src/
│   ├── public/
│   └── ...
├── mobile/               # React Native App
│   ├── src/
│   ├── assets/
│   └── ...
├── docker/               # Docker configurations
│   ├── php/
│   ├── nginx/
│   └── postgres/
├── n8n/                  # n8n workflows
│   └── workflows/
├── docker-compose.yml    # Services configuration
├── Makefile              # Commands shortcuts
└── README.md             # This file
```

## 📦 Services Docker

Le projet inclut 12 services Docker :
- **app** - Laravel PHP-FPM
- **nginx** - Serveur web
- **postgres** - Base de données PostgreSQL
- **pgadmin** - Interface graphique BDD
- **redis** - Cache et queues
- **elasticsearch** - Moteur de recherche
- **mailhog** - Test emails
- **n8n** - Automatisation & IA
- **node** - React/React Native
- **minio** - Stockage fichiers
- **queue** - Worker Laravel
- **scheduler** - Cron Laravel

## 🔧 Commandes Utiles

```bash
# Gestion des services
make up              # Démarrer tous les services
make down            # Arrêter tous les services
make restart         # Redémarrer
make logs            # Voir les logs
make status          # État des services

# Laravel
make shell           # Entrer dans le conteneur
make db-migrate      # Lancer les migrations
make db-fresh        # Reset BDD + seed
make cache-clear     # Vider les caches
make tinker          # Console interactive

# Maintenance
make backup-db       # Sauvegarder PostgreSQL
make clean           # Nettoyer (⚠️ supprime data)
make help            # Toutes les commandes
```

## 🔐 Sécurité

- ✅ Authentification JWT pour l'API
- ✅ CSRF Protection
- ✅ XSS Prevention
- ✅ SQL Injection protection (Eloquent ORM)
- ✅ Rate limiting
- ✅ Input validation & sanitization
- ✅ HTTPS ready
- ✅ Logs d'audit

## 🚀 Déploiement

### Développement
```bash
make install
make up
```

### Production
Voir le guide de déploiement complet dans [README.md](README.md)

### Mobile
```bash
# Android
cd mobile && eas build --platform android

# iOS
cd mobile && eas build --platform ios
```

## 📊 Performance

Objectifs de performance :
- ⚡ API Response: < 200ms
- ⚡ Page Load: < 2s
- ⚡ Search Results: < 500ms
- ⚡ Cache Hit Rate: > 80%

## 🌍 Spécificités Guinée

- 🇬🇳 Localisation complète en français
- 💵 Support Franc Guinéen (GNF)
- 📱 Intégration Orange Money / MTN Money
- 📞 Préfixe téléphonique +224
- 🗺️ Villes et quartiers guinéens
- 🕐 Timezone: Africa/Conakry

## 🤝 Contribution

Les contributions sont les bienvenues ! Voir [CONTRIBUTING.md](CONTRIBUTING.md)

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add some AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 License

Ce projet est sous licence MIT. Voir [LICENSE](LICENSE) pour plus de détails.

## 👥 Auteurs

- **Votre Nom** - *Initial work* - [YourGithub](https://github.com/yourusername)

Voir aussi la liste des [contributeurs](https://github.com/yourusername/immo-guinee/contributors).

## 🙏 Remerciements

- Laravel Framework
- React Community
- n8n Team
- Anthropic (Claude AI)
- Communauté open source

## 📞 Support

- 📧 Email: support@immguinee.gn
- 🌐 Site: https://immguinee.gn
- 💬 Discord: [Rejoindre](https://discord.gg/your-invite)

## 🗺️ Roadmap

- [x] Infrastructure Docker complète
- [x] API Laravel de base
- [x] Agents IA n8n
- [ ] Frontend React (en cours)
- [ ] App mobile React Native (en cours)
- [ ] Intégration Mobile Money
- [ ] Tests automatisés
- [ ] CI/CD Pipeline
- [ ] Déploiement production
- [ ] Version 1.0 🎉

## ⭐ Star History

Si ce projet vous aide, n'hésitez pas à lui donner une ⭐ !

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/immo-guinee&type=Date)](https://star-history.com/#yourusername/immo-guinee&Date)

---

**Fait avec ❤️ en Guinée 🇬🇳**
