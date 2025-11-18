# ⚡ QUICK START - Immo Guinée

## 🎯 Installation en 5 Minutes

### Étape 1: Prérequis
```bash
# Vérifier que Docker est installé
docker --version
docker-compose --version
```

Si Docker n'est pas installé:
- **Windows/Mac**: Téléchargez Docker Desktop sur https://www.docker.com/products/docker-desktop
- **Linux**: `curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh`

### Étape 2: Cloner/Télécharger le projet
```bash
# Si vous utilisez Git
git clone votre-repo.git
cd immo-guinee

# OU créer le dossier manuellement
mkdir immo-guinee && cd immo-guinee
```

### Étape 3: Placer les fichiers
Assurez-vous d'avoir cette structure:
```
immo-guinee/
├── docker-compose.yml
├── docker/
│   ├── php/
│   │   ├── Dockerfile
│   │   └── local.ini
│   ├── nginx/
│   │   └── nginx.conf
│   └── postgres/
│       └── init.sql
├── init.sh
└── Makefile
```

### Étape 4: Lancer l'installation automatique
```bash
# Rendre le script exécutable
chmod +x init.sh

# Lancer l'installation
./init.sh
```

**OU avec Make:**
```bash
make install
```

### Étape 5: Vérifier que tout fonctionne
Ouvrez votre navigateur et testez:
- ✅ http://localhost:8080 (Laravel)
- ✅ http://localhost:8081 (pgAdmin)
- ✅ http://localhost:5678 (n8n)

---

## 🚀 Commandes Essentielles

### Avec Make (Recommandé)
```bash
make up          # Démarrer les services
make down        # Arrêter les services
make logs        # Voir les logs
make shell       # Entrer dans Laravel
make db-migrate  # Exécuter les migrations
make help        # Voir toutes les commandes
```

### Sans Make (Docker Compose direct)
```bash
docker-compose up -d              # Démarrer
docker-compose down               # Arrêter
docker-compose logs -f            # Logs
docker-compose exec app bash      # Shell Laravel
docker-compose exec app php artisan migrate  # Migrations
```

---

## 📝 Configuration Laravel

### 1. Fichier .env
Le fichier `backend/.env` devrait contenir:
```env
DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=immo_guinee_db
DB_USERNAME=immo_user
DB_PASSWORD=immo_pass_secure_123

REDIS_HOST=redis
CACHE_DRIVER=redis
QUEUE_CONNECTION=redis

MAIL_HOST=mailhog
MAIL_PORT=1025
```

### 2. Première migration
```bash
make shell
php artisan migrate
exit
```

### 3. Créer un utilisateur admin
```bash
make shell
php artisan tinker

# Dans Tinker:
User::create([
    'name' => 'Admin',
    'email' => 'admin@immguinee.gn',
    'password' => bcrypt('password123'),
    'role' => 'admin'
]);
exit
```

---

## 🤖 Configuration n8n

1. Ouvrez http://localhost:5678
2. Connectez-vous avec:
   - Username: `admin`
   - Password: `admin123`
3. Créez votre premier workflow
4. Consultez `GUIDE_AGENTS_IA.md` pour les exemples

---

## 🗄️ Accès à la Base de Données

### Via pgAdmin (Interface graphique)
1. Ouvrez http://localhost:8081
2. Email: `admin@immguinee.local`
3. Password: `admin123`
4. Ajoutez un serveur:
   - Host: `postgres`
   - Port: `5432`
   - Database: `immo_guinee_db`
   - Username: `immo_user`
   - Password: `immo_pass_secure_123`

### Via Terminal
```bash
docker-compose exec postgres psql -U immo_user -d immo_guinee_db
```

---

## 📧 Test des Emails

1. Ouvrez http://localhost:8025 (MailHog)
2. Tous les emails envoyés par Laravel apparaîtront ici
3. Testez avec:
```bash
make shell
php artisan tinker

Mail::raw('Test email', function($message) {
    $message->to('test@example.com')->subject('Test');
});
```

---

## 💾 Stockage de Fichiers (MinIO)

1. Ouvrez http://localhost:9001
2. Username: `minio_admin`
3. Password: `minio_password_123`
4. Le bucket `immo-guinee` est créé automatiquement

---

## 🔍 Elasticsearch

- URL: http://localhost:9200
- Test: `curl http://localhost:9200/_cat/health`

---

## ❓ Problèmes Courants

### Port déjà utilisé
```bash
# Identifier le processus utilisant le port 8080
lsof -i :8080

# Tuer le processus (remplacez PID)
kill -9 PID
```

### Les conteneurs ne démarrent pas
```bash
# Voir les logs d'erreur
docker-compose logs

# Reconstruire les images
docker-compose build --no-cache
docker-compose up -d
```

### PostgreSQL ne démarre pas
```bash
# Vérifier l'état
docker-compose ps postgres

# Redémarrer
docker-compose restart postgres

# Voir les logs
docker-compose logs postgres
```

### Erreur de permissions Laravel
```bash
docker-compose exec app chmod -R 775 storage bootstrap/cache
docker-compose exec app chown -R www-data:www-data storage bootstrap/cache
```

### "Database does not exist"
```bash
# Se connecter à PostgreSQL
docker-compose exec postgres psql -U immo_user

# Créer la base si nécessaire
CREATE DATABASE immo_guinee_db;
\q
```

---

## 🎓 Prochaines Étapes

### Pour les Débutants Laravel:
1. Suivez le tutoriel officiel: https://laravel.com/docs/installation
2. Regardez Laracasts: https://laracasts.com
3. Lisez le code généré par `php artisan make:model`

### Pour les Débutants React:
1. Tutoriel officiel: https://react.dev/learn
2. Installez React: `cd frontend && npx create-react-app .`
3. Démarrez: `npm start`

### Pour n8n:
1. Documentation: https://docs.n8n.io
2. Exemples de workflows: https://n8n.io/workflows
3. Consultez `GUIDE_AGENTS_IA.md`

---

## 📚 Documentation Complète

- `README.md` - Documentation détaillée
- `GUIDE_AGENTS_IA.md` - Guide des agents IA avec n8n
- `Makefile` - Liste de toutes les commandes disponibles

---

## 🆘 Besoin d'Aide?

### Vérifier l'état des services
```bash
make status
# OU
docker-compose ps
```

### Redémarrer tout
```bash
make restart
# OU
docker-compose restart
```

### Tout supprimer et recommencer
```bash
make clean
make install
```

---

## 🎉 C'est Parti!

Votre environnement est prêt ! Vous pouvez maintenant:
- ✅ Développer votre API Laravel
- ✅ Créer votre frontend React
- ✅ Configurer vos agents IA dans n8n
- ✅ Tester vos emails dans MailHog
- ✅ Gérer votre base de données dans pgAdmin

**Bon développement! 🚀**
