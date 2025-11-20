# 🏅 SYSTÈME DE BADGES CERTIFIÉS - Immo Guinée

## 📋 Vue d'ensemble

Tous les propriétaires (et utilisateurs) ont un **badge de certification** qui indique leur niveau de confiance et de fiabilité sur la plateforme.

---

## 🎖️ NIVEAUX DE CERTIFICATION

### 🥉 BRONZE (Nouveau)
- **Par défaut** : Tous les nouveaux utilisateurs
- **Critères** :
  - Inscription complète
  - Email confirmé (optionnel)
  - Téléphone vérifié (optionnel)

**Badge** : Visible mais basique

---

### 🥈 ARGENT (Vérifié)
- **Critères** :
  - Bronze +
  - **1+ transaction réussie**
  - Note moyenne **≥ 3/5**
  - Téléphone vérifié

**Badge** : Badge argent visible sur les annonces

**Avantages** :
- Badge visible sur profil et annonces
- Remontée légère dans les résultats

---

### 🥇 OR (Confirmé)
- **Critères** :
  - Argent +
  - **5+ transactions réussies**
  - Note moyenne **≥ 4/5**
  - **Identité vérifiée** (CIN uploadée et validée)
  - Titre foncier vérifié (pour propriétaires)

**Badge** : Badge or visible

**Avantages** :
- Badge or visible
- Remontée automatique dans résultats
- **Réduction commission -10%**
- Support prioritaire

---

### 💎 DIAMANT (Premium)
- **Critères** :
  - Or +
  - **20+ transactions réussies**
  - Note moyenne **≥ 4.5/5**
  - **Zéro litige**
  - Temps de réponse **≤ 2h**
  - Tous documents vérifiés

**Badge** : Badge diamant visible

**Avantages** :
- Badge diamant visible
- Remontée prioritaire résultats
- **Réduction commission -30%**
- Support VIP
- Statistiques avancées
- Accès features premium

---

## 📊 CALCUL DES POINTS

Les points déterminent le niveau :

```
Points = 
  (Transactions × 10) +
  (Note moyenne × 20) +
  (Vérifications : +5 à +30) +
  (Réactivité bonus : +10 à +15) -
  (Litiges × 10)
```

---

## 🔄 MISE À JOUR AUTOMATIQUE

La certification est **recalculée automatiquement** après :
- Chaque transaction réussie
- Chaque notation reçue
- Chaque vérification document
- Chaque litige résolu

---

## 📡 API - Récupérer le badge

### Dans les propriétés

Toutes les réponses API incluent automatiquement le badge du propriétaire :

```json
{
  "success": true,
  "data": {
    "property": {
      "id": 1,
      "title": "...",
      "user": {
        "id": 5,
        "name": "John Doe",
        "certification_badge": {
          "label": "Or",
          "icon": "🥇",
          "color": "#FFD700",
          "description": "Membre confirmé"
        }
      }
    }
  }
}
```

### Profil utilisateur

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 5,
      "name": "John Doe",
      "certification": {
        "level": "gold",
        "badge": {
          "label": "Or",
          "icon": "🥇",
          "color": "#FFD700",
          "description": "Membre confirmé"
        },
        "points": 250,
        "transactions_count": 8,
        "average_rating": 4.3
      }
    }
  }
}
```

---

## 🎨 AFFICHAGE FRONTEND

### Badge sur carte propriété

```jsx
{property.user.certification_badge && (
  <div className="badge" style={{ color: property.user.certification_badge.color }}>
    {property.user.certification_badge.icon} {property.user.certification_badge.label}
  </div>
)}
```

### Badge sur profil

```jsx
{user.certification?.badge && (
  <div className="certification-badge">
    <span>{user.certification.badge.icon}</span>
    <span>{user.certification.badge.label}</span>
    <span className="description">{user.certification.badge.description}</span>
  </div>
)}
```

---

## ✅ IMPLÉMENTATION BACKEND

✅ **Modèle Certification** créé  
✅ **Relation User → Certification** ajoutée  
✅ **Helpers badge** dans User model  
✅ **CertificationService** pour calcul automatique  
✅ **Controllers mis à jour** pour inclure badges  
✅ **Seeder** pour initialiser certifications  

---

## 🚀 PROCHAINES ÉTAPES

1. **Frontend** : Afficher badges sur cartes propriétés
2. **Frontend** : Page profil avec badge visible
3. **Backend** : Job automatique pour recalculer certifications
4. **Backend** : Webhook pour mettre à jour après transactions

---

**Les propriétaires ont maintenant un badge certifié visible !** ✅

