# Demo Tutors Page

Cette page de démonstration présente toutes les fonctionnalités de la plateforme GoCours pour la recherche et la sélection de tuteurs avec des données mock complètes.

## Fonctionnalités Implémentées

### 🔍 **Recherche Textuelle**
- Recherche par nom du tuteur, bio, et headline
- Interface de recherche en temps réel
- Affichage des termes de recherche actifs

### 🎛️ **Filtres Avancés**
- **Matières** : Filtrage par sujets d'enseignement
- **Fourchette de prix** : Filtres min/max pour le tarif horaire
- **Localisation** : Recherche par ville avec autocomplétion
- **Note minimale** : Filtrage par évaluation (1-5 étoiles)
- **Format d'enseignement** : En ligne, en personne, ou les deux
- **Langues** : Filtrage par langues parlées
- **Expérience** : Années d'expérience minimales
- **Tuteurs vérifiés** : Option pour afficher uniquement les profils vérifiés

### 📊 **Tri et Organisation**
- **Par note** : Les mieux notés en premier
- **Par prix** : Croissant ou décroissant  
- **Par avis** : Plus d'avis en premier
- **Par date** : Les plus récents en premier
- **Par expérience** : Les plus expérimentés en premier

### ❤️ **Système de Favoris**
- Ajout/suppression des tuteurs favoris
- Persistance dans le localStorage
- Indicateurs visuels pour les favoris

### 📱 **Interface Responsive**
- Sidebar de filtres collapsible sur mobile
- Grille adaptive (1-4 colonnes selon l'écran)
- Navigation tactile optimisée

### 📄 **Pagination**
- Navigation par pages avec contrôles avancés
- 12 tuteurs par page
- Compteur de résultats
- Navigation "Précédent/Suivant"

### ✨ **États Avancés**
- Animations de chargement (skeletons)
- État vide avec actions suggérées
- Gestion d'erreur avec retry
- Indicateurs de filtres actifs

## Structure des Composants

```
src/components/demo/
├── DemoDataProvider.tsx     # Context provider pour les données mock
├── DemoTutorsPage.tsx      # Page principale avec toute la logique
├── demo-example.tsx        # Exemples d'utilisation
├── index.ts               # Exports du module
└── README.md              # Cette documentation
```

## Utilisation

### Intégration Basique

```tsx
import { DemoDataProvider, DemoTutorsPage } from '@/src/components/demo';

export default function TutorsDemo() {
  return (
    <DemoDataProvider>
      <DemoTutorsPage />
    </DemoDataProvider>
  );
}
```

### Intégration dans une Page Existante

```tsx
import { DemoDataProvider, DemoTutorsPage } from '@/src/components/demo';

export default function MyPage() {
  return (
    <div>
      <h1>Mon Application</h1>
      <DemoDataProvider>
        <DemoTutorsPage />
      </DemoDataProvider>
    </div>
  );
}
```

## Données Mock

Les données sont générées à partir de `src/lib/mock-data.ts` et incluent :

- **12 tuteurs** avec profils complets
- **Données réalistes** : photos, bio, qualifications
- **Localisation européenne** : 12 villes à travers l'Europe
- **Variété de sujets** : mathématiques, sciences, langues, informatique
- **Évaluations** : notes entre 3.5 et 5.0 avec commentaires
- **Tarifs** : entre €35 et €65 par heure

## Composants Réutilisés

La page démo utilise les composants existants du projet :

- `TutorCard` : Cartes individuelles des tuteurs
- `TutorGrid` : Grille avec pagination et états de chargement
- `FilterSidebar` : Panneau de filtres complet
- Composants UI : `Button`, `Input`, `Select`, `Card`, etc.

## Performance

- **Filtrage côté client** pour une expérience fluide
- **Memoization** des calculs coûteux (tri, filtrage)
- **Pagination** pour limiter le DOM
- **Lazy loading** des états (800ms de délai simulé)

## Personnalisation

### Modifier le Nombre d'Éléments par Page
```tsx
// Dans DemoTutorsPage.tsx
const ITEMS_PER_PAGE = 8; // au lieu de 12
```

### Ajouter des Options de Tri
```tsx
// Ajouter dans SORT_OPTIONS
{ value: 'alphabetical', label: 'Alphabetical' }
```

### Personnaliser les Données
```tsx
// Modifier dans src/lib/mock-data.ts
export const mockTutors = generateMockTutors();
```

## États de l'Interface

1. **Chargement** : Skeletons animés pendant 800ms
2. **Résultats** : Grille de tuteurs avec contrôles
3. **Aucun résultat** : Message avec action de reset des filtres
4. **Erreur** : Message d'erreur avec bouton retry

Cette implémentation démontre une interface complète et professionnelle pour la recherche de tuteurs, prête pour la production.