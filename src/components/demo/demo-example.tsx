/**
 * Exemple d'utilisation de la page démo DemoTutorsPage
 * 
 * Ce fichier montre comment intégrer la page de démonstration dans une application Next.js
 * avec le DemoDataProvider pour fournir les données mock.
 */

import { DemoDataProvider, DemoTutorsPage } from '@/src/components/demo';

// Exemple d'utilisation dans une page Next.js
export default function TutorsDemo() {
  return (
    <DemoDataProvider>
      <div className="min-h-screen">
        <DemoTutorsPage />
      </div>
    </DemoDataProvider>
  );
}

// Ou si vous voulez l'intégrer dans une page existante :
export function EmbeddedTutorsDemo() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Tutors Platform Demo
        </h1>
        <p className="text-gray-600">
          This demo showcases the complete tutors search and filtering functionality 
          using mock data. All features are fully interactive including search, filters, 
          sorting, pagination, and favorites.
        </p>
      </div>
      
      <DemoDataProvider>
        <DemoTutorsPage />
      </DemoDataProvider>
    </div>
  );
}