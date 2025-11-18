# 💻 Configuration VS Code - Immo Guinée

## Extensions Recommandées

### Pour Laravel (PHP)
```json
{
  "recommendations": [
    "bmewburn.vscode-intelephense-client",
    "mehedidracula.php-namespace-resolver",
    "amiralizadeh9480.laravel-extra-intellisense",
    "onecentlin.laravel-blade",
    "onecentlin.laravel5-snippets",
    "ryannaddy.laravel-artisan",
    "codingyu.laravel-goto-view"
  ]
}
```

### Pour React/JavaScript
```json
{
  "recommendations": [
    "dsznajder.es7-react-js-snippets",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

### Pour Docker & DevOps
```json
{
  "recommendations": [
    "ms-azuretools.vscode-docker",
    "ms-vscode-remote.remote-containers",
    "redhat.vscode-yaml"
  ]
}
```

### Utilitaires Généraux
```json
{
  "recommendations": [
    "eamodio.gitlens",
    "streetsidesoftware.code-spell-checker",
    "wayou.vscode-todo-highlight",
    "aaron-bond.better-comments",
    "gruntfuggly.todo-tree",
    "usernamehw.errorlens"
  ]
}
```

---

## 📁 Structure VS Code

Créez ce fichier: `.vscode/extensions.json`

```json
{
  "recommendations": [
    "bmewburn.vscode-intelephense-client",
    "mehedidracula.php-namespace-resolver",
    "amiralizadeh9480.laravel-extra-intellisense",
    "onecentlin.laravel-blade",
    "onecentlin.laravel5-snippets",
    "dsznajder.es7-react-js-snippets",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-azuretools.vscode-docker",
    "eamodio.gitlens"
  ]
}
```

---

## ⚙️ Settings VS Code

Créez ce fichier: `.vscode/settings.json`

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.tabSize": 4,
  "editor.insertSpaces": true,
  "files.associations": {
    "*.blade.php": "blade"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.tabSize": 2
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.tabSize": 2
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.tabSize": 2
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.tabSize": 2
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.tabSize": 2
  },
  "[php]": {
    "editor.defaultFormatter": "bmewburn.vscode-intelephense-client",
    "editor.tabSize": 4
  },
  "php.suggest.basic": false,
  "intelephense.stubs": [
    "apache",
    "bcmath",
    "bz2",
    "calendar",
    "com_dotnet",
    "Core",
    "ctype",
    "curl",
    "date",
    "dba",
    "dom",
    "enchant",
    "exif",
    "FFI",
    "fileinfo",
    "filter",
    "fpm",
    "ftp",
    "gd",
    "gettext",
    "gmp",
    "hash",
    "iconv",
    "imap",
    "intl",
    "json",
    "ldap",
    "libxml",
    "mbstring",
    "meta",
    "mysqli",
    "oci8",
    "odbc",
    "openssl",
    "pcntl",
    "pcre",
    "PDO",
    "pdo_ibm",
    "pdo_mysql",
    "pdo_pgsql",
    "pdo_sqlite",
    "pgsql",
    "Phar",
    "posix",
    "pspell",
    "readline",
    "Reflection",
    "session",
    "shmop",
    "SimpleXML",
    "snmp",
    "soap",
    "sockets",
    "sodium",
    "SPL",
    "sqlite3",
    "standard",
    "superglobals",
    "sysvmsg",
    "sysvsem",
    "sysvshm",
    "tidy",
    "tokenizer",
    "xml",
    "xmlreader",
    "xmlrpc",
    "xmlwriter",
    "xsl",
    "Zend OPcache",
    "zip",
    "zlib"
  ],
  "emmet.includeLanguages": {
    "blade": "html",
    "javascript": "javascriptreact"
  },
  "files.exclude": {
    "**/.git": true,
    "**/.DS_Store": true,
    "**/node_modules": true,
    "**/vendor": true,
    "**/storage/framework": true,
    "**/storage/logs": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/vendor": true,
    "**/storage": true,
    "**/.expo": true,
    "**/.expo-shared": true
  },
  "files.watcherExclude": {
    "**/.git/objects/**": true,
    "**/.git/subtree-cache/**": true,
    "**/node_modules/**": true,
    "**/vendor/**": true,
    "**/storage/**": true
  }
}
```

---

## 🐛 Configuration de Débogage

Créez ce fichier: `.vscode/launch.json`

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Listen for Xdebug (Laravel)",
      "type": "php",
      "request": "launch",
      "port": 9003,
      "pathMappings": {
        "/var/www": "${workspaceFolder}/backend"
      }
    },
    {
      "name": "Launch Chrome (React)",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/frontend"
    }
  ]
}
```

---

## 📝 Snippets Personnalisés

Créez ce fichier: `.vscode/snippets.code-snippets`

```json
{
  "Laravel Controller": {
    "prefix": "lcontroller",
    "body": [
      "<?php",
      "",
      "namespace App\\Http\\Controllers;",
      "",
      "use Illuminate\\Http\\Request;",
      "",
      "class ${1:Name}Controller extends Controller",
      "{",
      "    public function index()",
      "    {",
      "        ${2:// Code}",
      "    }",
      "}"
    ],
    "description": "Créer un controller Laravel"
  },
  "Laravel Model": {
    "prefix": "lmodel",
    "body": [
      "<?php",
      "",
      "namespace App\\Models;",
      "",
      "use Illuminate\\Database\\Eloquent\\Factories\\HasFactory;",
      "use Illuminate\\Database\\Eloquent\\Model;",
      "",
      "class ${1:Name} extends Model",
      "{",
      "    use HasFactory;",
      "",
      "    protected \\$fillable = [",
      "        ${2:'field'}",
      "    ];",
      "}"
    ],
    "description": "Créer un model Laravel"
  },
  "React Component": {
    "prefix": "rfc",
    "body": [
      "import React from 'react';",
      "",
      "const ${1:ComponentName} = () => {",
      "  return (",
      "    <div>",
      "      ${2:// Content}",
      "    </div>",
      "  );",
      "};",
      "",
      "export default ${1:ComponentName};"
    ],
    "description": "Créer un composant React fonctionnel"
  },
  "React Component with Props": {
    "prefix": "rfcp",
    "body": [
      "import React from 'react';",
      "",
      "interface ${1:ComponentName}Props {",
      "  ${2:prop}: ${3:type};",
      "}",
      "",
      "const ${1:ComponentName}: React.FC<${1:ComponentName}Props> = ({ ${2:prop} }) => {",
      "  return (",
      "    <div>",
      "      ${4:// Content}",
      "    </div>",
      "  );",
      "};",
      "",
      "export default ${1:ComponentName};"
    ],
    "description": "Créer un composant React avec props"
  }
}
```

---

## 🎨 Configuration Prettier

Créez ce fichier: `.prettierrc`

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

---

## 📏 Configuration ESLint

Créez ce fichier: `.eslintrc.json`

```json
{
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "plugins": ["react"],
  "rules": {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off"
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
```

---

## 🔧 Tâches VS Code

Créez ce fichier: `.vscode/tasks.json`

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Docker: Start All",
      "type": "shell",
      "command": "docker-compose up -d",
      "group": {
        "kind": "build",
        "isDefault": true
      }
    },
    {
      "label": "Docker: Stop All",
      "type": "shell",
      "command": "docker-compose down"
    },
    {
      "label": "Laravel: Migrate",
      "type": "shell",
      "command": "docker-compose exec app php artisan migrate"
    },
    {
      "label": "Laravel: Clear Cache",
      "type": "shell",
      "command": "docker-compose exec app php artisan cache:clear"
    },
    {
      "label": "React: Start",
      "type": "shell",
      "command": "npm start",
      "options": {
        "cwd": "${workspaceFolder}/frontend"
      }
    }
  ]
}
```

---

## ⌨️ Raccourcis Clavier Utiles

### Général
- `Ctrl+Shift+P` : Palette de commandes
- `Ctrl+P` : Recherche rapide de fichiers
- `Ctrl+Shift+F` : Recherche globale
- `Ctrl+`` : Terminal intégré

### Édition
- `Alt+Up/Down` : Déplacer ligne
- `Ctrl+D` : Sélectionner mot suivant
- `Ctrl+Shift+L` : Sélectionner toutes occurrences
- `Ctrl+/` : Commenter/Décommenter

### Navigation
- `Ctrl+Click` : Aller à définition
- `Alt+Left/Right` : Navigation historique
- `Ctrl+Tab` : Changer de fichier

---

## 📦 Installation Rapide

```bash
# 1. Créer le dossier .vscode
mkdir -p .vscode

# 2. Copier les fichiers de configuration
# (Les fichiers sont disponibles dans le dossier config/)

# 3. Installer les extensions recommandées
code --install-extension bmewburn.vscode-intelephense-client
code --install-extension dsznajder.es7-react-js-snippets
code --install-extension esbenp.prettier-vscode
code --install-extension ms-azuretools.vscode-docker
```

---

## 🎯 Workflow de Développement Optimal

### 1. Démarrer la journée
```bash
# Terminal 1: Docker
make up && make logs

# Terminal 2: Laravel
make shell

# Terminal 3: React
cd frontend && npm start
```

### 2. Développement
- Utiliser les snippets pour générer du code rapidement
- Formatter automatiquement avec Prettier (Ctrl+S)
- Déboguer avec les breakpoints

### 3. Avant de commiter
```bash
# Vérifier le code
npm run lint
php artisan test

# Formater
npm run format
```

---

Cette configuration vous donnera un environnement de développement professionnel et productif ! 🚀
