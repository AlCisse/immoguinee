# 🧪 Guide de Test Local - ADAPTÉ À VOTRE MACHINE

## ⚠️ IMPORTANT - Chemins sur VOTRE Machine

**Les instructions ci-dessous utilisent des chemins GÉNÉRIQUES.**

Remplacez `/chemin/vers/immoguinee` par **le chemin réel du projet sur VOTRE machine**.

### Comment trouver le chemin de votre projet ?

**Sur votre machine locale, ouvrez un terminal et tapez :**

```bash
# Aller dans le dossier du projet
cd immoguinee  # ou le nom du dossier que vous avez cloné

# Afficher le chemin complet
pwd

# Exemple de résultat :
# /Users/votre-nom/Documents/immoguinee  (macOS)
# C:\Users\votre-nom\Documents\immoguinee  (Windows)
# /home/votre-nom/projets/immoguinee  (Linux)
```

**Utilisez CE chemin dans toutes les commandes ci-dessous !**

---

## 🚀 Quick Start - DEPUIS LE DOSSIER DU PROJET

### Étape 1 : Se placer dans le projet

```bash
# Sur macOS/Linux :
cd /chemin/vers/immoguinee

# Sur Windows (Git Bash ou WSL) :
cd /c/Users/votre-nom/Documents/immoguinee
```

**OU simplement :**

```bash
# Naviguer jusqu'au dossier où vous avez cloné le projet
cd immoguinee
```

### Étape 2 : Vérifier que vous êtes au bon endroit

```bash
# Lister les fichiers
ls -la

# Vous devriez voir :
# - docker-compose.local.yml
# - Makefile.local
# - backend/
# - frontend/
# - docker/
# - scripts/
```

### Étape 3 : Lancer le test complet

**Option A : Tout en une commande (Recommandé)**

```bash
make -f Makefile.local start-fresh
```

**Option B : Étape par étape**

```bash
# 1. Setup
make -f Makefile.local setup

# 2. Build
make -f Makefile.local build

# 3. Start
make -f Makefile.local up

# 4. Migrate
make -f Makefile.local laravel-migrate

# 5. Test
make -f Makefile.local test
```

---

## 📁 Structure des Fichiers (À VOTRE Emplacement)

Votre projet doit avoir cette structure :

```
votre-dossier-projet/  (peu importe où il est sur votre machine)
├── backend/
├── frontend/
├── docker/
├── scripts/
├── docs/
├── docker-compose.local.yml
├── Makefile.local
└── LOCAL_TESTING_README.md  (ce fichier)
```

**Peu importe que ce soit dans :**
- `/Users/votre-nom/Documents/immoguinee` (macOS)
- `C:\Users\votre-nom\projets\immoguinee` (Windows)
- `/home/votre-nom/dev/immoguinee` (Linux)
- Ou n'importe où ailleurs !

---

## 💡 IMPORTANT - Chemins Relatifs

**Toutes les commandes du Makefile utilisent des chemins RELATIFS.**

Cela signifie que **vous devez juste être dans le dossier racine du projet**.

### Exemple :

```bash
# ✅ CORRECT
cd /le/chemin/où/est/votre/projet
make -f Makefile.local test

# ❌ INCORRECT
# Être dans un autre dossier et essayer de lancer make
```

---

## 🔍 Vérification Rapide

### 1. Vérifier que vous êtes au bon endroit

```bash
# Afficher le chemin actuel
pwd

# Lister les fichiers
ls -la | grep -E "(Makefile.local|docker-compose.local.yml)"

# Si vous voyez ces fichiers → Vous êtes au bon endroit ✅
# Si vous ne les voyez pas → Naviguez jusqu'au bon dossier
```

### 2. Vérifier Docker

```bash
# Docker est installé ?
docker --version

# Docker Compose est installé ?
docker compose version
```

---

## 🚀 Commandes Simplifiées (Sans Chemin Absolu)

### Toutes les commandes depuis la RACINE du projet :

```bash
# Se placer dans le projet
cd immoguinee  # (ou le nom que vous avez donné au dossier)

# Aide
make -f Makefile.local help

# Setup initial
make -f Makefile.local setup

# Build et start
make -f Makefile.local build
make -f Makefile.local up

# Migrations
make -f Makefile.local laravel-migrate

# Tests
make -f Makefile.local test

# Status
make -f Makefile.local status

# Logs
make -f Makefile.local logs

# Arrêter
make -f Makefile.local down

# Nettoyer
make -f Makefile.local clean
```

---

## 📊 Services Accessibles

Une fois lancé, les services sont sur **localhost** :

- **Nginx** : http://localhost:8080
- **Next.js** : http://localhost:3000
- **Laravel API** : http://localhost:8080/api/health

**Ces URLs sont les MÊMES peu importe où le projet est sur votre disque !**

---

## 🚨 Erreurs Courantes

### Erreur : "No such file or directory"

**Cause :** Vous n'êtes pas dans le bon dossier.

**Solution :**

```bash
# Trouver le projet
find ~ -name "docker-compose.local.yml" 2>/dev/null

# Aller dans le dossier trouvé
cd /chemin/trouvé

# OU cloner à nouveau le projet
git clone https://github.com/AlCisse/immoguinee.git
cd immoguinee
```

### Erreur : "Makefile.local not found"

**Cause :** Vous n'êtes pas dans la racine du projet, ou les fichiers ne sont pas à jour.

**Solution :**

```bash
# Vérifier que vous êtes dans le bon dossier
ls -la | grep Makefile.local

# Si le fichier n'existe pas, pull les dernières modifications
git pull origin claude/optimize-docker-architecture-019M2GQwr2fow6eeS5ezWbVt

# OU checkout la branche
git checkout claude/optimize-docker-architecture-019M2GQwr2fow6eeS5ezWbVt
```

### Erreur : "docker: command not found"

**Cause :** Docker Desktop n'est pas installé.

**Solution :**

- **macOS/Windows** : Installer [Docker Desktop](https://www.docker.com/products/docker-desktop)
- **Linux** : `sudo apt install docker.io docker-compose-plugin`

---

## ✅ Checklist de Démarrage

Avant de commencer, vérifiez :

- [ ] Docker Desktop est installé et démarré
- [ ] Vous êtes dans le dossier racine du projet (là où se trouve `Makefile.local`)
- [ ] Vous avez au moins 8GB RAM disponibles
- [ ] Vous avez au moins 20GB d'espace disque

### Comment vérifier ?

```bash
# 1. Docker tourne ?
docker info

# 2. Bon dossier ?
ls Makefile.local && echo "✅ Bon dossier" || echo "❌ Mauvais dossier"

# 3. RAM disponible ?
# macOS : Activity Monitor → Memory
# Windows : Task Manager → Performance → Memory
# Linux : free -h

# 4. Espace disque ?
df -h .
```

---

## 🎯 Workflow Complet Simplifié

```bash
# 1. Cloner le projet (si pas déjà fait)
git clone https://github.com/AlCisse/immoguinee.git
cd immoguinee

# 2. Checkout la branche optimisée
git checkout claude/optimize-docker-architecture-019M2GQwr2fow6eeS5ezWbVt

# 3. Lancer TOUT en une commande
make -f Makefile.local start-fresh

# 4. Si tout passe → Prêt pour la production ! 🚀
```

---

## 📚 Documentation

- **Guide complet** : `docs/LOCAL_TESTING_GUIDE.md`
- **Toutes les commandes** : `make -f Makefile.local help`
- **Déploiement production** : `docs/DEPLOYMENT_GUIDE.md`

---

## 🎉 Résultat Attendu

Si tout fonctionne :

```
========================================
✓ ALL TESTS PASSED!
========================================

🎉 Your Docker architecture is working perfectly!

Total tests: 35
Passed: 35
Failed: 0
Pass rate: 100%
```

---

## 💬 Questions ?

**Où suis-je ?**

```bash
pwd  # Affiche le chemin actuel
```

**Les fichiers sont-ils là ?**

```bash
ls -la | grep -E "(Makefile|docker-compose)"
```

**Docker fonctionne ?**

```bash
docker ps
```

**Tout recommencer ?**

```bash
make -f Makefile.local clean-all
make -f Makefile.local start-fresh
```

---

**L'essentiel : Être dans le dossier du projet, peu importe où il se trouve ! 📁**
