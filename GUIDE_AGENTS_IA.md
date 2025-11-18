# 🤖 Guide des Agents IA avec n8n pour Immo Guinée

## Vue d'ensemble

Ce guide vous aidera à créer des agents IA dans n8n pour automatiser et améliorer votre plateforme immobilière.

## Accès à n8n

- URL: http://localhost:5678
- Username: admin
- Password: admin123

## 🎯 Agents IA Recommandés

### 1. Agent Modération d'Annonces 🛡️

**Objectif**: Vérifier automatiquement la qualité et la validité des annonces

**Workflow n8n**:
```
Trigger (Webhook) → Analyse du texte → Vérification images → Validation prix → Webhook réponse
```

**Fonctionnalités**:
- ✅ Détection de contenu inapproprié
- ✅ Vérification de la cohérence des informations
- ✅ Analyse des images (qualité, pertinence)
- ✅ Validation des prix selon le marché
- ✅ Détection de doublons

**Intégrations nécessaires**:
- Claude AI API (pour l'analyse de texte)
- Webhook depuis Laravel
- PostgreSQL (pour vérifier les doublons)

**Code Laravel pour déclencher**:
```php
// Dans PropertyController.php
use Illuminate\Support\Facades\Http;

public function store(Request $request)
{
    $property = Property::create($request->validated());
    
    // Appeler l'agent de modération
    $response = Http::post('http://n8n:5678/webhook/moderate-property', [
        'property_id' => $property->id,
        'title' => $property->title,
        'description' => $property->description,
        'price' => $property->price,
        'images' => $property->images
    ]);
    
    $moderationResult = $response->json();
    
    if ($moderationResult['approved']) {
        $property->status = 'active';
    } else {
        $property->status = 'pending_review';
        $property->moderation_notes = $moderationResult['notes'];
    }
    
    $property->save();
    
    return response()->json($property);
}
```

---

### 2. Agent Recherche Intelligente 🔍

**Objectif**: Améliorer les résultats de recherche avec IA

**Workflow n8n**:
```
Webhook recherche → Analyse intention → Enrichissement query → Elasticsearch → Ranking IA → Réponse
```

**Fonctionnalités**:
- 🎯 Comprendre l'intention de l'utilisateur
- 🎯 Suggestions de recherches similaires
- 🎯 Correction orthographique automatique
- 🎯 Ranking intelligent des résultats
- 🎯 Personnalisation selon l'historique

**Exemple de prompt Claude**:
```
Analysez cette requête de recherche immobilière et extrayez:
- Type de bien recherché
- Budget estimé
- Localisation souhaitée
- Caractéristiques importantes
- Intention (achat, location, colocation)

Requête: "{user_query}"
Retournez au format JSON.
```

---

### 3. Agent Notifications Intelligentes 📱

**Objectif**: Envoyer des notifications pertinentes au bon moment

**Workflow n8n**:
```
Schedule/Trigger → Analyse utilisateur → Sélection annonces → Personnalisation → Envoi SMS/Email/Push
```

**Fonctionnalités**:
- 📧 Alertes nouvelles annonces matchant critères
- 📧 Rappels visites planifiées
- 📧 Suggestions personnalisées
- 📧 Baisse de prix sur annonces favorites
- 📧 Expiration prochaine d'annonces

**Configuration SMS (Guinée)**:
```javascript
// Node n8n pour SMS Orange Money
{
  "method": "POST",
  "url": "https://api.orange.com/smsmessaging/v1/outbound/tel:+224...",
  "headers": {
    "Authorization": "Bearer {{$env.ORANGE_API_KEY}}",
    "Content-Type": "application/json"
  },
  "body": {
    "outboundSMSMessageRequest": {
      "address": "tel:+224{{$node["Get Users"].json["phone"]}}",
      "senderAddress": "ImmoGuinee",
      "outboundSMSTextMessage": {
        "message": "{{$node["Generate Message"].json["text"]}}"
      }
    }
  }
}
```

---

### 4. Agent Estimation Prix 💰

**Objectif**: Estimer automatiquement la valeur d'un bien

**Workflow n8n**:
```
Webhook → Récupérer données similaires → Analyse marché → Calcul IA → Retour estimation
```

**Fonctionnalités**:
- 💵 Analyse des prix du quartier
- 💵 Comparaison avec biens similaires
- 💵 Prise en compte des tendances
- 💵 Facteurs de variation (état, commodités)
- 💵 Confidence score

**Algorithme de base**:
```python
# Dans un node Code de n8n
import statistics

def estimate_price(property_data, similar_properties):
    """
    Estime le prix d'un bien immobilier
    """
    prices = [p['price'] for p in similar_properties]
    
    # Prix médian comme base
    base_price = statistics.median(prices)
    
    # Ajustements
    surface_adjustment = (property_data['surface'] - avg_surface) * price_per_sqm
    condition_adjustment = property_data['condition_score'] * 0.1
    location_adjustment = property_data['location_score'] * 0.15
    
    estimated_price = base_price + surface_adjustment + condition_adjustment + location_adjustment
    
    return {
        'estimated_price': estimated_price,
        'confidence': calculate_confidence(similar_properties),
        'price_range': {
            'min': estimated_price * 0.9,
            'max': estimated_price * 1.1
        }
    }
```

---

### 5. Agent Chatbot Support 💬

**Objectif**: Répondre automatiquement aux questions fréquentes

**Workflow n8n**:
```
Webhook message → Analyse question → RAG (base connaissance) → Génération réponse → Envoi
```

**Fonctionnalités**:
- 💬 Réponses instantanées 24/7
- 💬 Escalade vers humain si nécessaire
- 💬 Multilingue (Français + langues locales)
- 💬 Contexte conversationnel
- 💬 Suggestions d'annonces

**Base de connaissance à créer**:
```json
{
  "faqs": [
    {
      "question": "Comment publier une annonce?",
      "answer": "Pour publier une annonce sur Immo Guinée, suivez ces étapes...",
      "keywords": ["publier", "annonce", "poster", "ajouter"]
    },
    {
      "question": "Quels sont les frais?",
      "answer": "Les frais de publication dépendent du type d'annonce...",
      "keywords": ["prix", "coût", "frais", "payer"]
    }
  ]
}
```

---

### 6. Agent Analytics & Insights 📊

**Objectif**: Analyser les données et générer des rapports

**Workflow n8n**:
```
Schedule (journalier) → Requêtes DB → Analyse IA → Génération insights → Envoi rapport
```

**Fonctionnalités**:
- 📈 Tendances du marché
- 📈 Performance des annonces
- 📈 Comportement utilisateurs
- 📈 Prédictions
- 📈 Alertes anomalies

**Requêtes utiles**:
```sql
-- Top quartiers par demande
SELECT location, COUNT(*) as views
FROM property_views
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY location
ORDER BY views DESC
LIMIT 10;

-- Evolution des prix
SELECT 
    DATE_TRUNC('month', created_at) as month,
    property_type,
    AVG(price) as avg_price
FROM properties
GROUP BY month, property_type
ORDER BY month DESC;
```

---

### 7. Agent Qualité des Photos 📸

**Objectif**: Vérifier et améliorer la qualité des photos

**Workflow n8n**:
```
Upload photo → Analyse qualité → Détection objets → Suggestions → Optimisation auto
```

**Fonctionnalités**:
- 📷 Vérification résolution minimum
- 📷 Détection de photos inappropriées
- 📷 Suggestions d'angles manquants
- 📷 Optimisation automatique (compression, recadrage)
- 📷 Ajout de watermark

**Intégration avec Claude Vision**:
```javascript
// Node n8n pour analyse d'image
const analyzeImage = async (imageUrl) => {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'anthropic-api-key': process.env.ANTHROPIC_API_KEY,
      'content-type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'url',
              url: imageUrl
            }
          },
          {
            type: 'text',
            text: 'Analysez cette photo immobilière et donnez: qualité (0-10), type de pièce, présence de personnes, professionnalisme. Format JSON.'
          }
        ]
      }]
    })
  });
  
  return await response.json();
};
```

---

## 🔧 Configuration des Webhooks dans Laravel

### 1. Créer une route pour les webhooks n8n

```php
// routes/api.php
Route::post('/webhooks/n8n/{agent}', [WebhookController::class, 'handle'])
    ->middleware('verify.n8n.signature');
```

### 2. Middleware de sécurité

```php
// app/Http/Middleware/VerifyN8NSignature.php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class VerifyN8NSignature
{
    public function handle(Request $request, Closure $next)
    {
        $signature = $request->header('X-N8N-Signature');
        $payload = $request->getContent();
        
        $expectedSignature = hash_hmac('sha256', $payload, config('services.n8n.secret'));
        
        if (!hash_equals($expectedSignature, $signature)) {
            abort(403, 'Invalid signature');
        }
        
        return $next($request);
    }
}
```

---

## 📝 Templates de Workflows n8n

### Template 1: Workflow de Modération Simple

```json
{
  "name": "Modération Annonces",
  "nodes": [
    {
      "parameters": {
        "path": "moderate-property",
        "method": "POST"
      },
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook"
    },
    {
      "parameters": {
        "authentication": "predefinedCredentialType",
        "nodeCredentialType": "anthropicApi",
        "prompt": "Analysez cette annonce immobilière et déterminez si elle respecte nos règles:\n\nTitre: {{$json[\"title\"]}}\nDescription: {{$json[\"description\"]}}\nPrix: {{$json[\"price\"]}} GNF\n\nRègles:\n- Pas de contenu offensant\n- Prix cohérent avec le marché\n- Description claire et détaillée\n\nRetournez: {\"approved\": boolean, \"confidence\": 0-1, \"issues\": []}"
      },
      "name": "Claude AI",
      "type": "n8n-nodes-base.openAi"
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{$json}}"
      },
      "name": "Respond to Webhook",
      "type": "n8n-nodes-base.respondToWebhook"
    }
  ],
  "connections": {
    "Webhook": {
      "main": [[{"node": "Claude AI", "type": "main", "index": 0}]]
    },
    "Claude AI": {
      "main": [[{"node": "Respond to Webhook", "type": "main", "index": 0}]]
    }
  }
}
```

---

## 🚀 Mise en Production

### Variables d'environnement n8n

Ajoutez ces variables dans votre fichier `.env` ou directement dans n8n:

```env
# APIs
ANTHROPIC_API_KEY=your_claude_api_key
OPENAI_API_KEY=your_openai_key (si nécessaire)

# Services Guinée
ORANGE_MONEY_API_KEY=your_orange_key
MTN_MONEY_API_KEY=your_mtn_key
SMS_API_KEY=your_sms_provider_key

# Webhooks
N8N_WEBHOOK_SECRET=your_secure_secret_key
LARAVEL_API_URL=http://app:80/api

# Database
N8N_DB_TYPE=postgresdb
N8N_DB_HOST=postgres
N8N_DB_PORT=5432
N8N_DB_NAME=n8n_db
N8N_DB_USER=immo_user
N8N_DB_PASSWORD=immo_pass_secure_123
```

---

## 📚 Ressources

- [Documentation n8n](https://docs.n8n.io)
- [Claude AI API](https://docs.anthropic.com)
- [Workflows communautaires](https://n8n.io/workflows)
- [Forum n8n](https://community.n8n.io)

---

## 🎓 Prochaines Étapes

1. ✅ Se connecter à n8n (http://localhost:5678)
2. ✅ Créer votre premier workflow de test
3. ✅ Configurer les credentials API (Claude, SMS, etc.)
4. ✅ Importer les templates fournis
5. ✅ Tester chaque agent individuellement
6. ✅ Intégrer avec Laravel via webhooks
7. ✅ Monitorer et optimiser les performances

---

**💡 Astuce**: Commencez par l'agent le plus simple (notifications) avant d'implémenter les agents complexes (estimation prix, analyse IA).
