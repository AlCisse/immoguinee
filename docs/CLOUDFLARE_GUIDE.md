# 🌐 Guide Cloudflare - Configuration Complète

## Table des matières

- [Configuration initiale](#configuration-initiale)
- [DNS et Proxy](#dns-et-proxy)
- [SSL/TLS](#ssltls)
- [Cache et Performance](#cache-et-performance)
- [WAF et Sécurité](#waf-et-sécurité)
- [Page Rules](#page-rules)
- [API et Purge automatique](#api-et-purge-automatique)
- [Monitoring](#monitoring)

---

## 🚀 Configuration initiale

### 1. Créer un compte Cloudflare

1. Aller sur https://cloudflare.com
2. Créer un compte gratuit ou Pro
3. Ajouter votre domaine `votre-domaine.com`
4. Suivre les instructions pour changer les nameservers chez votre registrar

### 2. Récupérer les tokens d'API

```bash
# Aller dans : Mon profil > Tokens API
# Créer un token avec les permissions :
# - Zone > Zone > Read
# - Zone > Cache Purge > Purge
```

**Variables à configurer :**

```env
CLOUDFLARE_API_TOKEN=votre_token_api
CLOUDFLARE_ZONE_ID=votre_zone_id
```

---

## 🌍 DNS et Proxy

### Configuration DNS recommandée

| Type  | Nom             | Contenu              | Proxy | TTL  |
|-------|-----------------|----------------------|-------|------|
| A     | @               | IP_VPS_OVH           | ✅     | Auto |
| A     | www             | IP_VPS_OVH           | ✅     | Auto |
| CNAME | api             | votre-domaine.com    | ✅     | Auto |
| CNAME | cdn             | votre-domaine.com    | ✅     | Auto |
| TXT   | @               | v=spf1 include:...   | ❌     | Auto |

### Activer le Proxy Orange Cloud

- **Activer le proxy** (orange cloud) pour tous les enregistrements web
- Cela active le CDN, cache, et protection DDoS
- Les requêtes passent par les serveurs Cloudflare

---

## 🔒 SSL/TLS

### Configuration SSL/TLS

**Aller dans : SSL/TLS > Vue d'ensemble**

```
Mode SSL/TLS : Full (Strict) ✅
```

**Options recommandées :**

1. **Always Use HTTPS** : ON ✅
   - Force toutes les requêtes HTTP vers HTTPS

2. **Automatic HTTPS Rewrites** : ON ✅
   - Réécrit automatiquement les liens HTTP en HTTPS

3. **Minimum TLS Version** : TLS 1.2 ✅
   - Sécurité renforcée

4. **Opportunistic Encryption** : ON ✅

5. **TLS 1.3** : ON ✅
   - Performance améliorée

### Certificat SSL Origin

**Aller dans : SSL/TLS > Origin Server**

1. Créer un certificat Origin
2. Copier le certificat et la clé privée
3. Les placer dans `docker/nginx/ssl/`

```bash
# Sur le VPS
mkdir -p docker/nginx/ssl/
nano docker/nginx/ssl/fullchain.pem   # Coller le certificat
nano docker/nginx/ssl/privkey.pem     # Coller la clé privée
chmod 600 docker/nginx/ssl/*.pem
```

### HSTS (HTTP Strict Transport Security)

**Aller dans : SSL/TLS > Edge Certificates**

```
Enable HSTS : ON
Max Age Header : 12 months
Include Subdomains : ON
Preload : ON
No-Sniff Header : ON
```

---

## ⚡ Cache et Performance

### Niveau de cache

**Aller dans : Caching > Configuration**

```
Caching Level : Standard ✅
Browser Cache TTL : 4 hours
```

### Types de fichiers à cacher

**Extensions à cacher agressivement :**

```
.jpg, .jpeg, .png, .gif, .webp, .avif, .svg, .ico
.css, .js
.woff, .woff2, .ttf, .eot
.mp4, .webm
.pdf, .zip
```

### Configuration du cache

**Aller dans : Caching > Configuration**

```yaml
# Cache niveau Standard
- HTML : 2 heures (avec purge automatique)
- CSS/JS : 1 an (avec versioning)
- Images : 1 an
- API : Bypass cache
```

### Auto Minify

**Aller dans : Speed > Optimization**

```
Auto Minify :
  ✅ JavaScript
  ✅ CSS
  ✅ HTML
```

### Brotli Compression

```
Brotli : ON ✅
```

Plus performant que Gzip !

### Polish (Images)

**Plan Pro uniquement**

```
Polish : Lossless ou Lossy
WebP : ON
```

### Argo Smart Routing

**Plan Pro/Business**

```
Argo Smart Routing : ON
```

Réduit la latence de 30% en moyenne.

---

## 🛡️ WAF et Sécurité

### Web Application Firewall

**Aller dans : Security > WAF**

```yaml
WAF Managed Rules : ON ✅

Ruleset activés :
  - Cloudflare Managed Ruleset
  - Cloudflare OWASP Core Ruleset
  - Cloudflare Exposed Credentials Check
```

### Security Level

**Aller dans : Security > Settings**

```
Security Level : Medium ou High
```

### Bot Fight Mode

```
Bot Fight Mode : ON ✅
```

Bloque les bots malveillants automatiquement.

### DDoS Protection

**Automatique sur tous les plans !**

```
HTTP DDoS Attack Protection : ON ✅
Network-layer DDoS Attack Protection : ON ✅
```

### Rate Limiting

**Aller dans : Security > WAF > Rate limiting rules**

**Exemple de règle :**

```yaml
Rule 1 : Limite API
  - If : (http.request.uri.path contains "/api/")
  - Then : Rate limit
  - Requests : 100 requêtes / 60 secondes
  - Action : Block
  - Duration : 600 secondes

Rule 2 : Limite Login
  - If : (http.request.uri.path eq "/api/login")
  - Then : Rate limit
  - Requests : 5 requêtes / 60 secondes
  - Action : Challenge (CAPTCHA)
```

### Hotlink Protection

**Aller dans : Scrape Shield**

```
Hotlink Protection : ON ✅
```

Empêche d'autres sites d'utiliser vos images.

---

## 📜 Page Rules

**Aller dans : Rules > Page Rules**

### Règle 1 : Cache API Bypass

```yaml
URL : votre-domaine.com/api/*
Settings :
  - Cache Level : Bypass
  - Disable Performance
```

### Règle 2 : Cache Assets Agressif

```yaml
URL : votre-domaine.com/storage/*
Settings :
  - Cache Level : Cache Everything
  - Edge Cache TTL : 1 month
  - Browser Cache TTL : 1 month
```

### Règle 3 : Cache Pages Next.js

```yaml
URL : votre-domaine.com/*
Settings :
  - Cache Level : Cache Everything
  - Edge Cache TTL : 2 hours
  - Browser Cache TTL : 4 hours
```

### Règle 4 : Force HTTPS Admin

```yaml
URL : votre-domaine.com/admin/*
Settings :
  - Always Use HTTPS : ON
  - Security Level : High
```

---

## 🔄 API et Purge automatique

### Script de purge cache

**Créer : `scripts/cloudflare-purge.sh`**

```bash
#!/bin/bash

ZONE_ID="${CLOUDFLARE_ZONE_ID}"
API_TOKEN="${CLOUDFLARE_API_TOKEN}"

# Purge tout le cache
purge_all() {
    curl -X POST "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/purge_cache" \
        -H "Authorization: Bearer ${API_TOKEN}" \
        -H "Content-Type: application/json" \
        --data '{"purge_everything":true}'
}

# Purge URLs spécifiques
purge_urls() {
    local urls=("$@")
    local json_urls=$(printf '%s\n' "${urls[@]}" | jq -R . | jq -s .)

    curl -X POST "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/purge_cache" \
        -H "Authorization: Bearer ${API_TOKEN}" \
        -H "Content-Type: application/json" \
        --data "{\"files\":${json_urls}}"
}

# Purge par tags
purge_tags() {
    local tags=("$@")
    local json_tags=$(printf '%s\n' "${tags[@]}" | jq -R . | jq -s .)

    curl -X POST "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/purge_cache" \
        -H "Authorization: Bearer ${API_TOKEN}" \
        -H "Content-Type: application/json" \
        --data "{\"tags\":${json_tags}}"
}

# Utilisation :
# ./cloudflare-purge.sh all
# ./cloudflare-purge.sh urls "https://votre-domaine.com/page1" "https://votre-domaine.com/page2"
# ./cloudflare-purge.sh tags "homepage" "products"

case "$1" in
    all)
        purge_all
        ;;
    urls)
        shift
        purge_urls "$@"
        ;;
    tags)
        shift
        purge_tags "$@"
        ;;
    *)
        echo "Usage: $0 {all|urls|tags} [args]"
        exit 1
        ;;
esac
```

**Rendre exécutable :**

```bash
chmod +x scripts/cloudflare-purge.sh
```

### Purge automatique après déploiement

**Dans Laravel - Event Listener :**

```php
// app/Listeners/PurgeCloudflareCache.php
namespace App\Listeners;

use Illuminate\Support\Facades\Http;

class PurgeCloudflareCache
{
    public function handle($event)
    {
        $zoneId = config('services.cloudflare.zone_id');
        $apiToken = config('services.cloudflare.api_token');

        Http::withHeaders([
            'Authorization' => "Bearer {$apiToken}",
            'Content-Type' => 'application/json',
        ])->post("https://api.cloudflare.com/client/v4/zones/{$zoneId}/purge_cache", [
            'purge_everything' => true,
        ]);
    }
}
```

**Enregistrer dans EventServiceProvider :**

```php
protected $listen = [
    PropertyCreated::class => [
        PurgeCloudflareCache::class,
    ],
    PropertyUpdated::class => [
        PurgeCloudflareCache::class,
    ],
];
```

### Webhook de purge

**Créer une route API :**

```php
// routes/api.php
Route::post('/cloudflare/purge', function () {
    Artisan::call('cloudflare:purge');
    return response()->json(['status' => 'success']);
})->middleware('auth:sanctum');
```

**Appeler depuis GitHub Actions :**

```yaml
- name: Purge Cloudflare Cache
  run: |
    curl -X POST https://votre-domaine.com/api/cloudflare/purge \
      -H "Authorization: Bearer ${{ secrets.API_TOKEN }}"
```

---

## 📊 Monitoring

### Cloudflare Analytics

**Aller dans : Analytics & Logs > Traffic**

Surveiller :
- Nombre de requêtes
- Bandwidth économisé
- Cache hit ratio (objectif : >80%)
- Menaces bloquées

### Cache Hit Ratio optimal

**Objectif : >80%**

- Si <80% : Augmenter les TTL et les Page Rules
- Si >95% : Parfait ! 🎉

### Performance Insights

**Aller dans : Speed > Observatory**

- Core Web Vitals
- Performance Score
- Recommandations d'optimisation

### Logs en temps réel

**Plan Pro/Business uniquement**

**Aller dans : Analytics & Logs > Logs**

- Activer Logpush
- Envoyer vers S3, Datadog, ou autre

---

## 🎯 Checklist complète

### ✅ Configuration de base

- [ ] DNS configuré avec proxy ON
- [ ] SSL/TLS Full (Strict) activé
- [ ] Always Use HTTPS activé
- [ ] HSTS activé
- [ ] Minimum TLS 1.2

### ✅ Performance

- [ ] Cache configuré (Standard)
- [ ] Auto Minify activé (JS, CSS, HTML)
- [ ] Brotli activé
- [ ] Page Rules créées
- [ ] Browser Cache TTL : 4 heures

### ✅ Sécurité

- [ ] WAF activé avec rulesets
- [ ] Security Level : Medium/High
- [ ] Bot Fight Mode activé
- [ ] Rate Limiting configuré
- [ ] Hotlink Protection activé
- [ ] DDoS Protection activé (automatique)

### ✅ API et Automatisation

- [ ] API Token créé avec bonnes permissions
- [ ] Script de purge créé et testé
- [ ] Purge automatique après déploiement
- [ ] Webhook de purge configuré

### ✅ Monitoring

- [ ] Analytics consultées régulièrement
- [ ] Cache Hit Ratio >80%
- [ ] Alertes configurées (optionnel)
- [ ] Logs activés (plan Pro)

---

## 🚨 Troubleshooting

### Problème : Cache Hit Ratio faible

**Solutions :**

1. Augmenter les TTL dans Page Rules
2. Vérifier que le proxy (orange cloud) est activé
3. S'assurer que les headers Cache-Control sont corrects
4. Utiliser "Cache Everything" pour les assets statiques

### Problème : Erreur 525 (SSL Handshake Failed)

**Solutions :**

1. Vérifier que Nginx écoute sur le port 443
2. Vérifier que le certificat SSL Origin est bien installé
3. S'assurer que le mode SSL est "Full (Strict)"

### Problème : Erreur 521 (Web Server Down)

**Solutions :**

1. Vérifier que le VPS est accessible
2. Vérifier que Nginx est démarré
3. Vérifier les logs Nginx : `docker logs immo_guinee_nginx_prod`

### Problème : API ne fonctionne pas

**Solutions :**

1. Vérifier que le cache est bypassé pour `/api/*`
2. Désactiver "Rocket Loader" pour l'API
3. Vérifier les headers CORS

---

## 📚 Ressources

- [Documentation Cloudflare](https://developers.cloudflare.com/)
- [Cloudflare Community](https://community.cloudflare.com/)
- [API Cloudflare](https://api.cloudflare.com/)
- [Status Cloudflare](https://www.cloudflarestatus.com/)

---

## 🎉 Résultat attendu

Avec cette configuration Cloudflare optimale :

- ⚡ **Performance** : Temps de chargement réduit de 40-60%
- 🛡️ **Sécurité** : Protection DDoS, WAF, Bot protection
- 💰 **Coûts** : Bandwidth réduit de 60-80%
- 🌍 **Global** : CDN avec 300+ points de présence
- 📊 **Cache Hit Ratio** : >80%

**Votre site sera ultra-rapide et ultra-sécurisé ! 🚀**
