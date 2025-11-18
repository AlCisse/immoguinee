# Liste des Tâches - ImmoGuinée

> Dernière mise à jour : 2025-11-18

---

## Phase 1 : Backend API Laravel (Semaines 1-2)

### 1.1 Configuration Base de Données
- [ ] Compléter la migration `users` (champs : phone, avatar, role, address, is_verified)
- [ ] Compléter la migration `properties` (champs : title, description, price, type, status, bedrooms, bathrooms, surface, address, latitude, longitude, images, features, user_id)
- [ ] Compléter la migration `locations` (champs : name, slug, parent_id, type, latitude, longitude)
- [ ] Compléter la migration `messages` (champs : sender_id, receiver_id, property_id, content, is_read, read_at)
- [ ] Créer migration `favorites` (user_id, property_id)
- [ ] Créer migration `alerts` (user_id, criteria, is_active)
- [ ] Créer migration `reviews` (user_id, property_id, rating, comment)
- [ ] Créer migration `property_images` (property_id, path, order, is_main)
- [ ] Exécuter les migrations : `make db-migrate`
- [ ] Créer les seeders pour données de test

### 1.2 Modèles Eloquent
- [ ] Compléter le modèle `User` (fillable, casts, relations)
- [ ] Compléter le modèle `Property` (fillable, casts, relations, scopes)
- [ ] Compléter le modèle `Location` (fillable, relations, nested set)
- [ ] Compléter le modèle `Message` (fillable, relations)
- [ ] Créer le modèle `Favorite`
- [ ] Créer le modèle `Alert`
- [ ] Créer le modèle `Review`
- [ ] Créer le modèle `PropertyImage`
- [ ] Définir toutes les relations (belongsTo, hasMany, belongsToMany)

### 1.3 Authentification API
- [ ] Installer Laravel Sanctum
- [ ] Configurer Sanctum pour tokens API
- [ ] Créer `AuthController` avec méthodes :
  - [ ] `register()` - Inscription utilisateur
  - [ ] `login()` - Connexion
  - [ ] `logout()` - Déconnexion
  - [ ] `me()` - Profil utilisateur
  - [ ] `updateProfile()` - Mise à jour profil
  - [ ] `changePassword()` - Changement mot de passe
  - [ ] `forgotPassword()` - Mot de passe oublié
  - [ ] `resetPassword()` - Réinitialisation
- [ ] Créer middleware d'authentification
- [ ] Configurer les routes auth dans `routes/api.php`

### 1.4 CRUD Propriétés
- [ ] Créer `PropertyController` avec méthodes :
  - [ ] `index()` - Liste paginée avec filtres
  - [ ] `show()` - Détail d'une propriété
  - [ ] `store()` - Création (auth requise)
  - [ ] `update()` - Modification (propriétaire uniquement)
  - [ ] `destroy()` - Suppression (propriétaire uniquement)
  - [ ] `myProperties()` - Mes annonces
- [ ] Créer `PropertyRequest` pour validation
- [ ] Créer `PropertyResource` pour transformation JSON
- [ ] Implémenter les filtres de recherche :
  - [ ] Par prix (min/max)
  - [ ] Par type (vente/location)
  - [ ] Par localisation
  - [ ] Par nombre de chambres
  - [ ] Par surface
- [ ] Configurer les routes dans `routes/api.php`

### 1.5 Gestion des Images
- [ ] Configurer MinIO dans `config/filesystems.php`
- [ ] Créer `ImageController` :
  - [ ] `upload()` - Upload image
  - [ ] `delete()` - Suppression image
  - [ ] `reorder()` - Réorganiser images
- [ ] Implémenter redimensionnement automatique (thumbnails)
- [ ] Implémenter compression des images
- [ ] Valider types et tailles de fichiers
- [ ] Générer URLs signées pour accès sécurisé

### 1.6 Système de Messagerie
- [ ] Créer `MessageController` :
  - [ ] `index()` - Conversations de l'utilisateur
  - [ ] `show()` - Messages d'une conversation
  - [ ] `store()` - Envoyer message
  - [ ] `markAsRead()` - Marquer comme lu
- [ ] Créer événement `MessageSent` pour notifications
- [ ] Configurer routes API messagerie

### 1.7 Favoris et Alertes
- [ ] Créer `FavoriteController` :
  - [ ] `index()` - Mes favoris
  - [ ] `store()` - Ajouter favori
  - [ ] `destroy()` - Retirer favori
- [ ] Créer `AlertController` :
  - [ ] `index()` - Mes alertes
  - [ ] `store()` - Créer alerte
  - [ ] `update()` - Modifier alerte
  - [ ] `destroy()` - Supprimer alerte
- [ ] Créer Job `ProcessAlerts` pour notifications

### 1.8 Recherche Elasticsearch
- [ ] Installer package Laravel Scout
- [ ] Configurer driver Elasticsearch
- [ ] Indexer le modèle `Property`
- [ ] Implémenter recherche full-text
- [ ] Ajouter suggestions de recherche
- [ ] Configurer synonymes et stemming français

### 1.9 Localisations
- [ ] Créer `LocationController` :
  - [ ] `index()` - Liste des régions/villes
  - [ ] `show()` - Détails localisation
  - [ ] `properties()` - Propriétés par localisation
- [ ] Importer données géographiques Guinée
- [ ] Implémenter recherche géographique (radius)

### 1.10 Reviews et Ratings
- [ ] Créer `ReviewController` :
  - [ ] `index()` - Reviews d'une propriété
  - [ ] `store()` - Ajouter review
  - [ ] `update()` - Modifier review
  - [ ] `destroy()` - Supprimer review
- [ ] Calculer et cacher les ratings moyens

---

## Phase 2 : Sécurité et Performance (Semaine 2)

### 2.1 Sécurité
- [ ] Configurer CORS pour frontend
- [ ] Implémenter rate limiting API
- [ ] Ajouter validation email utilisateur
- [ ] Configurer 2FA (optionnel)
- [ ] Auditer les permissions (Gates & Policies)
- [ ] Protéger contre les injections SQL
- [ ] Sanitizer les entrées utilisateur

### 2.2 Performance
- [ ] Configurer cache Redis pour queries fréquentes
- [ ] Implémenter eager loading (N+1)
- [ ] Ajouter index database appropriés
- [ ] Configurer queues pour jobs lourds
- [ ] Optimiser requêtes Eloquent
- [ ] Implémenter pagination cursor

### 2.3 Monitoring
- [ ] Configurer logging structuré
- [ ] Ajouter health check endpoint
- [ ] Monitorer performance queries
- [ ] Alertes erreurs critiques

---

## Phase 3 : Agents IA n8n (Semaine 3)

### 3.1 Configuration n8n
- [ ] Accéder à n8n (http://localhost:5678)
- [ ] Configurer credentials Claude AI (Anthropic)
- [ ] Configurer webhook Laravel → n8n
- [ ] Tester connexion API Laravel

### 3.2 Agent 1 : Modération Automatique
- [ ] Créer workflow n8n
- [ ] Trigger : nouvelle annonce créée
- [ ] Analyser contenu avec Claude AI
- [ ] Vérifier :
  - [ ] Langue appropriée
  - [ ] Pas de contenu interdit
  - [ ] Informations cohérentes
- [ ] Actions : approuver / rejeter / signaler
- [ ] Notifier utilisateur du résultat

### 3.3 Agent 2 : Recherche Intelligente
- [ ] Créer workflow n8n
- [ ] Trigger : requête utilisateur en langage naturel
- [ ] Parser la requête avec Claude AI
- [ ] Convertir en filtres structurés
- [ ] Exécuter recherche Elasticsearch
- [ ] Retourner résultats pertinents

### 3.4 Agent 3 : Notifications Personnalisées
- [ ] Créer workflow n8n
- [ ] Trigger : nouvelle propriété ajoutée
- [ ] Matcher avec alertes utilisateurs
- [ ] Générer message personnalisé avec Claude
- [ ] Envoyer notification (email/push)

### 3.5 Agent 4 : Estimation de Prix
- [ ] Créer workflow n8n
- [ ] Trigger : demande estimation
- [ ] Collecter données propriété
- [ ] Analyser marché comparable
- [ ] Générer estimation avec Claude AI
- [ ] Retourner fourchette de prix

### 3.6 Agent 5 : Chatbot Support
- [ ] Créer workflow n8n
- [ ] Trigger : message utilisateur
- [ ] Analyser intention avec Claude AI
- [ ] Répondre aux questions fréquentes
- [ ] Escalader vers humain si nécessaire

### 3.7 Agent 6 : Analytics Automatiques
- [ ] Créer workflow n8n
- [ ] Trigger : hebdomadaire (cron)
- [ ] Collecter métriques plateforme
- [ ] Générer rapport avec Claude AI
- [ ] Envoyer rapport aux admins

### 3.8 Agent 7 : Qualité Photos
- [ ] Créer workflow n8n
- [ ] Trigger : upload image
- [ ] Analyser qualité avec Claude Vision
- [ ] Vérifier :
  - [ ] Résolution suffisante
  - [ ] Luminosité correcte
  - [ ] Contenu approprié
- [ ] Suggérer améliorations

---

## Phase 4 : Frontend React (Semaines 4-5)

### 4.1 Setup Projet React
- [ ] Initialiser projet React avec Vite
- [ ] Configurer TailwindCSS v4
- [ ] Installer dépendances (axios, react-query, react-router)
- [ ] Configurer structure dossiers
- [ ] Setup ESLint et Prettier
- [ ] Configurer variables environnement

### 4.2 Composants UI de Base
- [ ] Créer composants réutilisables :
  - [ ] Button
  - [ ] Input
  - [ ] Select
  - [ ] Modal
  - [ ] Card
  - [ ] Spinner
  - [ ] Alert
  - [ ] Pagination
- [ ] Créer layout principal (Header, Footer, Sidebar)
- [ ] Implémenter thème et variables CSS
- [ ] Assurer responsive design

### 4.3 Authentification Frontend
- [ ] Créer context Auth
- [ ] Page inscription
- [ ] Page connexion
- [ ] Page mot de passe oublié
- [ ] Gestion tokens (storage, refresh)
- [ ] Routes protégées
- [ ] Redirection après auth

### 4.4 Pages Publiques
- [ ] Page d'accueil :
  - [ ] Hero section
  - [ ] Recherche rapide
  - [ ] Propriétés en vedette
  - [ ] Statistiques
- [ ] Page liste propriétés :
  - [ ] Filtres avancés
  - [ ] Vue liste/grille
  - [ ] Tri (prix, date, pertinence)
  - [ ] Pagination
- [ ] Page détail propriété :
  - [ ] Galerie images
  - [ ] Informations détaillées
  - [ ] Carte localisation
  - [ ] Formulaire contact
  - [ ] Propriétés similaires
- [ ] Page recherche :
  - [ ] Barre recherche
  - [ ] Suggestions
  - [ ] Résultats
- [ ] Pages statiques (À propos, Contact, CGU)

### 4.5 Espace Utilisateur
- [ ] Dashboard utilisateur
- [ ] Profil et paramètres
- [ ] Mes annonces :
  - [ ] Liste mes propriétés
  - [ ] Créer annonce
  - [ ] Modifier annonce
  - [ ] Supprimer annonce
  - [ ] Statistiques vues
- [ ] Mes favoris
- [ ] Mes alertes
- [ ] Mes messages :
  - [ ] Liste conversations
  - [ ] Chat en temps réel
  - [ ] Notifications

### 4.6 Interface Admin
- [ ] Dashboard admin :
  - [ ] Statistiques globales
  - [ ] Graphiques
  - [ ] Activité récente
- [ ] Gestion utilisateurs :
  - [ ] Liste utilisateurs
  - [ ] Détails utilisateur
  - [ ] Bannir/débannir
- [ ] Gestion annonces :
  - [ ] Modération
  - [ ] Approuver/rejeter
  - [ ] Signalements
- [ ] Gestion localisations
- [ ] Paramètres plateforme

### 4.7 Fonctionnalités Avancées
- [ ] Upload images avec preview
- [ ] Drag & drop réorganisation
- [ ] Carte interactive (Leaflet/Mapbox)
- [ ] Notifications temps réel
- [ ] Mode sombre (optionnel)
- [ ] PWA (optionnel)

---

## Phase 5 : Application Mobile React Native (Semaines 6-7)

### 5.1 Setup Projet Mobile
- [ ] Initialiser projet Expo
- [ ] Configurer navigation (React Navigation)
- [ ] Installer dépendances natives
- [ ] Configurer variables environnement
- [ ] Setup structure projet

### 5.2 Écrans Authentification
- [ ] Écran splash
- [ ] Écran onboarding
- [ ] Écran connexion
- [ ] Écran inscription
- [ ] Écran mot de passe oublié

### 5.3 Écrans Principaux
- [ ] Écran accueil :
  - [ ] Recherche
  - [ ] Propriétés récentes
  - [ ] Catégories
- [ ] Écran liste propriétés :
  - [ ] Liste scrollable
  - [ ] Filtres
  - [ ] Pull to refresh
- [ ] Écran détail propriété :
  - [ ] Swiper images
  - [ ] Informations
  - [ ] Actions (favoris, contact, partage)
- [ ] Écran carte :
  - [ ] Carte avec markers
  - [ ] Géolocalisation
  - [ ] Clusters

### 5.4 Écrans Utilisateur
- [ ] Profil
- [ ] Mes annonces
- [ ] Créer annonce :
  - [ ] Formulaire multi-étapes
  - [ ] Prise photo caméra
  - [ ] Sélection galerie
- [ ] Mes favoris
- [ ] Mes messages
- [ ] Paramètres

### 5.5 Fonctionnalités Natives
- [ ] Notifications push (Expo Notifications)
- [ ] Géolocalisation (Expo Location)
- [ ] Caméra (Expo Camera)
- [ ] Galerie photos (Expo ImagePicker)
- [ ] Partage (Expo Sharing)
- [ ] Deep linking

### 5.6 Build et Publication
- [ ] Configurer app.json/app.config.js
- [ ] Générer icônes et splash screens
- [ ] Build Android (APK/AAB)
- [ ] Build iOS (IPA)
- [ ] Soumettre Google Play Store
- [ ] Soumettre Apple App Store

---

## Phase 6 : Tests (Continue)

### 6.1 Tests Backend
- [ ] Tests unitaires Models
- [ ] Tests unitaires Services
- [ ] Tests Feature Controllers
- [ ] Tests API endpoints
- [ ] Tests authentification
- [ ] Tests permissions
- [ ] Coverage minimum 80%

### 6.2 Tests Frontend
- [ ] Tests unitaires composants (Jest)
- [ ] Tests intégration (React Testing Library)
- [ ] Tests E2E (Cypress/Playwright)
- [ ] Tests accessibilité

### 6.3 Tests Mobile
- [ ] Tests unitaires (Jest)
- [ ] Tests composants (React Native Testing Library)
- [ ] Tests E2E (Detox)

### 6.4 Tests Performance
- [ ] Load testing API (k6/Artillery)
- [ ] Benchmark temps de réponse
- [ ] Test montée en charge

---

## Phase 7 : DevOps et Déploiement (Semaine 8)

### 7.1 CI/CD
- [ ] Configurer GitHub Actions
- [ ] Pipeline tests automatiques
- [ ] Pipeline build automatique
- [ ] Pipeline déploiement staging
- [ ] Pipeline déploiement production

### 7.2 Infrastructure Production
- [ ] Provisionner serveur (DigitalOcean/AWS)
- [ ] Configurer DNS
- [ ] Installer certificat SSL (Let's Encrypt)
- [ ] Configurer Nginx production
- [ ] Configurer PostgreSQL production
- [ ] Configurer Redis production
- [ ] Configurer backups automatiques

### 7.3 Monitoring Production
- [ ] Configurer logging centralisé
- [ ] Alertes erreurs (Sentry/Bugsnag)
- [ ] Monitoring uptime
- [ ] Monitoring performance (New Relic/Datadog)
- [ ] Dashboard métriques

### 7.4 Sécurité Production
- [ ] Audit sécurité
- [ ] Configurer firewall
- [ ] Hardening serveur
- [ ] Rotation secrets
- [ ] Plan de disaster recovery

---

## Phase 8 : Post-Lancement

### 8.1 SEO et Marketing
- [ ] Optimiser meta tags
- [ ] Générer sitemap
- [ ] Configurer robots.txt
- [ ] Schema.org markup
- [ ] Open Graph tags
- [ ] Analytics (Google Analytics/Plausible)

### 8.2 Intégrations Paiement
- [ ] Intégrer Orange Money
- [ ] Intégrer MTN Mobile Money
- [ ] Système d'abonnements premium
- [ ] Facturation automatique

### 8.3 Fonctionnalités Futures
- [ ] Visite virtuelle 360°
- [ ] Statistiques avancées vendeurs
- [ ] Programme parrainage
- [ ] API publique pour partenaires
- [ ] Multi-langue (Français, Anglais, Soussou, Malinké, Pular)

---

## Résumé des Priorités

### Priorité Haute (MVP)
1. Backend API complète (auth, properties, images, search)
2. Frontend React (pages principales, espace utilisateur)
3. Tests de base

### Priorité Moyenne
4. Agents IA n8n (modération, notifications)
5. Application mobile
6. CI/CD

### Priorité Basse (Post-MVP)
7. Agents IA avancés
8. Intégrations paiement
9. Fonctionnalités futures

---

## Estimation Temps Total

| Phase | Durée Estimée |
|-------|---------------|
| Backend API | 2 semaines |
| Sécurité/Performance | 0.5 semaine |
| Agents IA | 1 semaine |
| Frontend React | 2 semaines |
| App Mobile | 2 semaines |
| Tests | Continue |
| DevOps/Déploiement | 1 semaine |

**Total MVP : 8-10 semaines**

---

## Notes

- Cocher les cases au fur et à mesure de l'avancement
- Mettre à jour ce fichier régulièrement
- Ajouter des sous-tâches si nécessaire
- Documenter les décisions techniques importantes
