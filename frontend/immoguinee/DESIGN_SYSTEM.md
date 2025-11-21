# 🎨 Guide du Système de Design - ImmoGuinée

Guide complet du design system moderne, sécurisé et performant pour la plateforme ImmoGuinée.

---

## 📋 Table des Matières

1. [Vision du Design](#vision-du-design)
2. [Palette de Couleurs](#palette-de-couleurs)
3. [Typographie](#typographie)
4. [Composants](#composants)
5. [Animations](#animations)
6. [Sécurité](#sécurité)
7. [Accessibilité](#accessibilité)
8. [Performance](#performance)
9. [Bonnes Pratiques](#bonnes-pratiques)

---

## 🎯 Vision du Design

### Inspiration : Airbnb
Le design s'inspire d'Airbnb pour créer une expérience moderne, épurée et professionnelle :
- **Espaces respirants** : Utilisation généreuse de l'espace blanc
- **Images grandes et attractives** : Mise en avant visuelle des propriétés
- **Typographie claire** : Hiérarchie visuelle évidente
- **Couleurs douces** : Palette apaisante et professionnelle
- **Animations subtiles** : Micro-interactions délicates

### Principes de Design
1. **Clarté** : Interface intuitive et facile à comprendre
2. **Confiance** : Design professionnel qui inspire confiance
3. **Élégance** : Détails soignés et polish visuel
4. **Performance** : Expérience fluide et rapide
5. **Accessibilité** : Utilisable par tous

---

## 🎨 Palette de Couleurs

### Couleurs Principales

#### Primary (Vert)
Utilisée pour les actions principales, CTAs et éléments de marque.

```css
primary-50:  #f0fdf4  /* Backgrounds très légers */
primary-100: #dcfce7  /* Backgrounds légers */
primary-200: #bbf7d0  /* Hover states légers */
primary-300: #86efac
primary-400: #4ade80
primary-500: #22c55e  /* Couleur principale */
primary-600: #16a34a  /* Boutons, liens */
primary-700: #15803d  /* Hover states */
primary-800: #166534  /* Texte sur fond clair */
primary-900: #14532d  /* Texte accentué */
```

**Usage** :
- Boutons principaux : `primary-600`, hover: `primary-700`
- Liens : `primary-600`
- Badges importants : `primary-600`
- Focus rings : `primary-500`

#### Secondary (Rouge)
Utilisée pour les erreurs, suppressions et actions dangereuses.

```css
secondary-500: #ef4444  /* Erreurs */
secondary-600: #dc2626  /* Boutons danger */
secondary-700: #b91c1c  /* Hover danger */
```

#### Neutral (Gris)
Utilisée pour le texte, bordures et backgrounds.

```css
neutral-50:  #fafafa  /* Background principal */
neutral-100: #f5f5f5  /* Background cards */
neutral-200: #e5e5e5  /* Bordures légères */
neutral-300: #d4d4d4  /* Bordures */
neutral-400: #a3a3a3  /* Icônes secondaires */
neutral-500: #737373  /* Texte secondaire */
neutral-600: #525252  /* Texte normal */
neutral-700: #404040  /* Boutons secondaires */
neutral-800: #262626  /* Titres */
neutral-900: #171717  /* Titres importants */
```

### Contraste et Accessibilité
Tous les contrastes respectent les normes WCAG 2.1 niveau AA :
- Texte normal : Ratio ≥ 4.5:1
- Texte large : Ratio ≥ 3:1
- Éléments UI : Ratio ≥ 3:1

---

## ✍️ Typographie

### Police : Inter
Police moderne, lisible et optimisée pour les écrans.

```css
font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
```

### Hiérarchie Typographique

```css
/* Titres principaux (Hero) */
h1: text-5xl md:text-7xl (48px → 72px)
    font-extrabold, leading-tight

/* Titres de section */
h2: text-4xl md:text-5xl (36px → 48px)
    font-bold, leading-tight

/* Sous-titres */
h3: text-2xl (24px)
    font-bold, mb-3

/* Texte normal */
body: text-base (16px)
      leading-relaxed

/* Texte secondaire */
small: text-sm (14px)
       text-neutral-600
```

### Espacement du Texte
- `leading-tight` : Titres (line-height: 1.25)
- `leading-relaxed` : Paragraphes (line-height: 1.625)
- `text-balance` : Titres pour équilibrage des lignes

---

## 🧩 Composants

### Button

#### Variantes
```typescript
primary   : Vert, actions principales
secondary : Gris, actions secondaires
outline   : Bordure, actions tertiaires
danger    : Rouge, suppressions
ghost     : Transparent, actions subtiles
```

#### Tailles
```typescript
sm : px-3 py-1.5 text-sm
md : px-5 py-2.5 text-base
lg : px-7 py-3.5 text-lg
```

#### Animations
- Hover : Changement de couleur + ombre `shadow-medium`
- Active : Réduction d'échelle `scale-95`
- Ripple : Effet d'ondulation au clic
- Loading : Spinner animé

#### Accessibilité
- `aria-busy={isLoading}` : Indique le chargement
- `disabled` : État désactivé clair
- Focus visible : Ring 2px `primary-500`

#### Sécurité
- Aucune injection HTML possible (ReactNode children)
- Props HTML natives sécurisées par TypeScript

---

### PropertyCard

#### Structure
```
┌─────────────────────────────┐
│   Image (ratio 16:9)        │ ← Hover: scale 110%
│   + Gradient overlay        │
│   + Badges (type, status)   │
├─────────────────────────────┤
│ Titre (line-clamp-1)        │
│ Description (line-clamp-2)  │
│ 📍 Location                 │
│ 🏠 Features (m², ch., sdb.) │
│ ───────────────────────────│
│ Prix           →            │
└─────────────────────────────┘
```

#### Animations
- Card : Hover lift `-translate-y-1` + `shadow-hover`
- Image : Zoom `scale-110` (500ms)
- Titre : Changement couleur vers `primary-600`
- Arrow : Translate `translate-x-1`

#### Sécurité
- Images : Next/Image avec domaines whitelistés
- Texte : Échappement HTML avec `escapeHtml()`
- Alt text : Toujours présent et descriptif

#### Performance
- Images : Lazy loading natif
- Sizes : Responsive (100vw → 50vw → 33vw)
- Quality : 85 (balance qualité/poids)

---

### Modal

#### Structure
```
Backdrop (blur + opacity)
  └─ Modal Container
       ├─ Header (titre + close)
       ├─ Content
       └─ Footer (optionnel)
```

#### Animations
- Entrance : `fade-in` backdrop + `scale-in` modal
- Exit : `fade-out` + `scale-out`

#### Accessibilité
- `role="dialog"` et `aria-modal="true"`
- Focus trap : Focus automatique au modal
- Focus restoration : Retour au focus précédent
- Keyboard : Fermeture avec `Escape`
- `aria-labelledby` : Lien au titre

#### Sécurité
- Click outside : Fermeture sécurisée
- Event propagation : `stopPropagation` sur contenu
- Body scroll : Désactivé quand ouvert

---

### Input & Textarea

#### États Visuels
```
Default   : border-neutral-300
Focus     : border-primary-500 + ring-2
Error     : border-secondary-500 + ring-2
Disabled  : bg-neutral-50 + cursor-not-allowed
```

#### Fonctionnalités
- **Icons** : Left/right icons support
- **Helper text** : Texte d'aide contextuel
- **Error display** : Message + icône
- **Character count** : Compteur (Textarea)
- **Required indicator** : Astérisque rouge

#### Accessibilité
- Labels : `htmlFor` lié à l'input
- `aria-invalid` : Indique les erreurs
- `aria-describedby` : Lié aux messages
- ID unique : Auto-généré si non fourni

#### Sécurité
- **Pas de sanitization côté composant** : Fait par validation Zod
- Type HTML natif : Protection navigateur
- maxLength : Limitation longueur

---

## 🎬 Animations

### Principes d'Animation
1. **Subtilité** : Pas de distraction
2. **Fluidité** : 60 FPS minimum
3. **Intention** : Chaque animation a un but
4. **Performance** : GPU-accelerated uniquement

### Keyframes Personnalisées

```css
/* Fade In/Out */
fadeIn: 0% opacity-0 → 100% opacity-1
fadeOut: inverse

/* Slide Up/Down */
slideUp: 0% translateY(10px) opacity-0 → 100% translateY(0) opacity-1
slideDown: 0% translateY(-10px) opacity-0 → 100% translateY(0) opacity-1

/* Scale In/Out */
scaleIn: 0% scale(0.95) opacity-0 → 100% scale(1) opacity-1
scaleOut: inverse

/* Shimmer (Loading) */
shimmer: Animation gradient de gauche à droite
```

### Durées Standards
- Micro : 150ms (hover simple)
- Court : 250ms (transitions standard)
- Moyen : 350ms (cards, modals)
- Long : 500ms (images, backgrounds)

### Fonctions de Timing
```css
smooth    : cubic-bezier(0.4, 0, 0.2, 1)  /* Défaut */
bounce-in : cubic-bezier(0.68, -0.55, 0.265, 1.55)  /* Playful */
```

### Animations GPU-Accelerated
Utiliser uniquement :
- `transform` (translate, scale, rotate)
- `opacity`
- ❌ Éviter : `width`, `height`, `margin`, `padding`

---

## 🔒 Sécurité

### Protection XSS (Cross-Site Scripting)

#### Sanitization des Inputs
```typescript
// Fichier : /utils/sanitize.ts

escapeHtml()           // Échappe < > & " ' /
sanitizeAttribute()    // Nettoie attributs HTML
sanitizeUrl()          // Valide URLs (bloque javascript:)
sanitizeEmail()        // Valide format email
sanitizeSearchTerm()   // Protège recherche/filtres
```

#### Usage
```typescript
// PropertyCard
alt={escapeHtml(property.title)}

// Formulaires (avec Zod)
const schema = z.object({
  title: z.string().max(100),
  description: z.string().max(1000),
})
```

### Content Security Policy (CSP)

Headers recommandés dans `next.config.js` :

```javascript
{
  key: 'Content-Security-Policy',
  value: `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval';
    style-src 'self' 'unsafe-inline' fonts.googleapis.com;
    img-src 'self' data: https: blob:;
    font-src 'self' fonts.gstatic.com;
    connect-src 'self' localhost:8000;
    frame-ancestors 'none';
  `
}
```

### Protection Clickjacking

```javascript
{
  key: 'X-Frame-Options',
  value: 'DENY'
}
```

### Autres Headers
```javascript
X-Content-Type-Options: 'nosniff'
Referrer-Policy: 'origin-when-cross-origin'
Permissions-Policy: 'camera=(), microphone=(), geolocation=()'
```

---

## ♿ Accessibilité

### Standards WCAG 2.1 Niveau AA

#### Navigation Clavier
- Tous les éléments interactifs : `Tab` accessible
- Focus visible : Ring 2px sur tous les éléments
- Skip links : Liens de saut (à implémenter)

#### ARIA Labels

```typescript
// Boutons d'action
<button aria-label="Fermer la modal">×</button>

// Champs requis
<span aria-label="requis">*</span>

// États de chargement
<button aria-busy={isLoading}>

// Éléments décoratifs
<svg aria-hidden="true">
```

#### Contraste de Couleurs
- Texte normal sur fond : ≥ 4.5:1
- Large texte sur fond : ≥ 3:1
- Éléments UI : ≥ 3:1

#### Screen Readers
- Alt text : Toujours présent et descriptif
- `sr-only` : Texte caché visuel, visible SR
- Labels : Associés aux inputs
- Headings : Hiérarchie H1 → H2 → H3

#### Focus Management
- Modal : Auto-focus + focus trap
- Forms : Navigation logique
- Error fields : Focus automatique

---

## ⚡ Performance

### Images avec Next/Image

```typescript
<Image
  src={imageUrl}
  alt="Description"
  fill                    // Responsive
  sizes="(max-width: 768px) 100vw,
         (max-width: 1200px) 50vw,
         33vw"             // Optimisation responsive
  loading="lazy"          // Lazy loading natif
  quality={85}            // Balance qualité/poids
  priority={false}        // true pour hero images
/>
```

#### Domaines Autorisés
```javascript
// next.config.js
images: {
  domains: [
    'localhost',
    'cloudinary.com',
    'unsplash.com',
  ]
}
```

### Optimisations CSS

#### Critical CSS
- Inline dans `<head>` : Styles ATF (Above The Fold)
- Tailwind JIT : Génère uniquement les classes utilisées

#### Animations Performantes
```css
/* ✅ GPU-accelerated */
.element {
  transform: translateX(10px);
  will-change: transform;
}

/* ❌ Layout thrashing */
.element {
  margin-left: 10px;
}
```

### Lazy Loading

#### Images
- `loading="lazy"` natif sur toutes images non-hero
- Next/Image gère automatiquement

#### Composants
```typescript
// Lazy load composants lourds
const HeavyComponent = dynamic(() => import('./Heavy'), {
  loading: () => <Spinner />,
  ssr: false
})
```

### Préchargement

```typescript
// Précharger routes importantes
<Link href="/properties" prefetch={true}>
```

### Bundle Optimization

```javascript
// next.config.js
compiler: {
  removeConsole: process.env.NODE_ENV === 'production',
}
```

---

## 📖 Bonnes Pratiques

### Structure de Composant

```typescript
// 1. Imports
import { useState } from 'react'
import { cn } from '@/utils/cn'

// 2. Types
interface ComponentProps {
  // ...
}

// 3. Composant
export default function Component({ ... }: ComponentProps) {
  // 4. Hooks
  const [state, setState] = useState()

  // 5. Handlers
  const handleClick = () => {}

  // 6. Render
  return (
    <div className={cn(/* ... */)}>
      {/* ... */}
    </div>
  )
}
```

### Utilisation de Tailwind

```typescript
// ✅ Utiliser cn() pour merge classes
className={cn(
  'base-classes',
  variant === 'primary' && 'primary-classes',
  className // Allow override
)}

// ❌ Éviter string concat
className={`base ${variant} ${className}`}
```

### Gestion d'État

```typescript
// ✅ Local state pour UI
const [isOpen, setIsOpen] = useState(false)

// ✅ Zustand pour global state
const user = useAuthStore(state => state.user)

// ❌ Props drilling excessif
<A user={user}>
  <B user={user}>
    <C user={user} />
```

### Validation de Données

```typescript
// Toujours avec Zod
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  title: z.string().max(100),
})

// React Hook Form integration
const form = useForm({
  resolver: zodResolver(schema)
})
```

### Testing (Recommandé)

```typescript
// Component tests
describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click</Button>)
  })

  it('calls onClick when clicked', () => {
    const onClick = jest.fn()
    render(<Button onClick={onClick}>Click</Button>)
    fireEvent.click(screen.getByText('Click'))
    expect(onClick).toHaveBeenCalled()
  })
})
```

---

## 🚀 Checklist de Lancement

### Design
- [ ] Palette cohérente appliquée partout
- [ ] Typographie uniforme
- [ ] Espaces respirants (padding/margin)
- [ ] Responsive mobile/tablet/desktop
- [ ] Images optimisées

### Animations
- [ ] Subtiles et non-intrusives
- [ ] 60 FPS (GPU-accelerated)
- [ ] Transitions fluides
- [ ] Pas d'animations excessives

### Sécurité
- [ ] Inputs sanitizés
- [ ] CSP headers configurés
- [ ] X-Frame-Options: DENY
- [ ] Validation Zod sur tous formulaires
- [ ] Images Next/Image avec domaines whitelistés

### Accessibilité
- [ ] Navigation clavier complète
- [ ] Focus visible partout
- [ ] ARIA labels appropriés
- [ ] Contraste WCAG AA
- [ ] Screen reader friendly
- [ ] Alt text sur toutes images

### Performance
- [ ] Lazy loading images
- [ ] Bundle optimisé
- [ ] Critical CSS inline
- [ ] Prefetch routes importantes
- [ ] Lighthouse score > 90

### SEO
- [ ] Meta tags (title, description)
- [ ] Open Graph tags
- [ ] Sitemap.xml
- [ ] Robots.txt
- [ ] Structured data (JSON-LD)

---

## 📚 Ressources

### Documentation
- [Next.js](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)

### Outils
- [Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [WAVE Accessibility](https://wave.webaim.org/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

### Inspiration
- [Airbnb Design](https://airbnb.design/)
- [Material Design](https://material.io/design)
- [Tailwind UI](https://tailwindui.com/)

---

**Version** : 1.0
**Dernière mise à jour** : 2025
**Auteur** : Claude (Assistant IA)
