# Dashboard Components

Ce répertoire contient tous les composants nécessaires pour les pages dashboard de GoCours.

## Structure des composants

### 1. **DashboardContent.tsx** - Composant principal
- Gère le fetch des données depuis `/api/dashboard`
- Affichage conditionnel selon le rôle (tutor/student)
- Gestion des états de chargement et d'erreur
- Point d'entrée principal utilisé dans `/app/dashboard/page.tsx`

### 2. **DashboardSkeleton.tsx** - État de chargement
- Skeletons pour les cards de statistiques
- Skeletons pour l'activité récente
- Skeletons pour les actions rapides
- Layout identique au contenu réel

### 3. **TutorDashboard.tsx** - Dashboard pour tuteurs
- **Statistiques** : revenus, réservations, évaluations, étudiants
- **Activité récente** : réservations et avis récents
- **Actions rapides** : Créer session, Gérer profil, Voir planning
- **Insights de performance** : taux de complétion, temps de réponse
- **Messages non lus**

### 4. **StudentDashboard.tsx** - Dashboard pour étudiants
- **Statistiques** : sessions, favorites, dépenses
- **Sessions à venir** : prochaines sessions programmées
- **Activité récente** : historique des actions
- **Tuteurs favoris** : liste des tuteurs sauvegardés
- **Actions rapides** : Chercher tuteurs, Mes réservations
- **Objectifs d'apprentissage**

### 5. **StatsCards.tsx** - Cartes statistiques réutilisables
- Cards responsive avec icônes colorées
- Support des tendances (positive/négative)
- Formatage automatique des valeurs (argent, nombres)
- Animations hover
- Types d'icônes : calendar, dollar, star, users, book, heart, clock, trending

### 6. **RecentActivity.tsx** - Timeline d'activité
- Timeline design avec icônes
- Support de différents types d'activité : booking, review, session, message
- Badges de statut colorés
- Actions contextuelles (liens vers détails)
- Formatage intelligent des dates ("il y a X temps")
- Affichage des métadonnées (matière, montant, etc.)

## Types de données

### Dashboard API Response
```typescript
type DashboardApiResponse = {
  user: UserProfile;
  role: Role;
  tutorProfile?: TutorProfile;
  studentProfile?: StudentProfile;
  stats: { /* statistiques spécifiques au rôle */ };
  recentActivity: ActivityItem[];
  recentBookings: Booking[];
  recentReviews?: Review[];
  favoriteTutors?: TutorProfile[];
  upcomingBookings?: Booking[];
};
```

### Activity Item
```typescript
type ActivityItem = {
  id: string;
  type: 'booking' | 'review' | 'session' | 'message';
  title: string;
  description: string;
  timestamp: Date;
  status?: BookingStatus;
  rating?: number;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: {
    subject?: string;
    studentName?: string;
    tutorName?: string;
    amount?: number;
  };
};
```

## Utilisation

### Import du composant principal
```typescript
import DashboardContent from '@/src/components/dashboard/DashboardContent';
// ou
import { DashboardContent } from '@/src/components/dashboard';
```

### Utilisation dans une page
```typescript
export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
```

## API Requirements

Les composants s'attendent à ce que l'endpoint `/api/dashboard` retourne les données dans le format spécifié ci-dessus. L'API doit :

1. Authentifier l'utilisateur (Clerk)
2. Déterminer le rôle (tutor/student)
3. Récupérer le profil approprié
4. Calculer les statistiques
5. Récupérer l'activité récente
6. Formatter les données selon le type `DashboardApiResponse`

## Styling

- Utilise Tailwind CSS pour le styling
- Composants UI de shadcn/ui
- Design responsive (mobile-first)
- Thème cohérent avec le reste de l'application
- Support du mode sombre (via CSS variables)