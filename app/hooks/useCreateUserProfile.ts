// app/hooks/useCreateUserProfile.ts
'use client'; // Il y avait un point-virgule en trop ici, je l'ai enlevé.
// Ce hook est destiné au client

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs'; // Hook de Clerk pour obtenir les infos de l'utilisateur

// Interface pour la réponse attendue de l'API
interface UserProfile {
  id: string;
  clerkId: string;
  role: 'student' | 'tutor'; // Adaptez si vous avez plus de rôles
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  message: string;
  userProfile?: UserProfile; // Optionnel si le profil existe déjà
  error?: string;
}

export function useCreateUserProfile() {
  const { user, isSignedIn, isLoaded } = useUser(); // Informations de l'utilisateur Clerk
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileCreationAttempted, setProfileCreationAttempted] = useState(false);

  useEffect(() => {
    // S'assurer que Clerk est chargé, que l'utilisateur est connecté,
    // et que nous n'avons pas déjà tenté de créer le profil pour cette session/chargement du hook.
    if (isLoaded && isSignedIn && user && !profileCreationAttempted) {
      const createProfile = async () => {
        setIsLoading(true);
        setError(null);
        setProfileCreationAttempted(true); // Marquer que la tentative est faite

        try {
          const response = await fetch('/api/user-profile', {
            method: 'POST',
          });

          // Il est bon de vérifier si la réponse est bien du JSON avant de la parser
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            const data: ApiResponse = await response.json();

            if (!response.ok) {
              throw new Error(data.error || `Erreur HTTP: ${response.status}`);
            }

            if (data.userProfile) {
              setProfile(data.userProfile);
              console.log(data.message, data.userProfile);
            } else if (data.message === 'Le profil utilisateur existe déjà.') {
              console.log(data.message);
            }
          } else {
            // Gérer le cas où la réponse n'est pas du JSON
            const textResponse = await response.text();
            throw new Error(`Réponse inattendue du serveur: ${response.status} - ${textResponse}`);
          }

        } catch (err) {
          console.error('Erreur dans useCreateUserProfile:', err);
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('Une erreur inconnue est survenue lors de la création du profil.');
          }
        } finally {
          setIsLoading(false);
        }
      };

      createProfile();
    }
  }, [user, isSignedIn, isLoaded, profileCreationAttempted]); // Ceci est la liste de dépendances

  // L'instruction return était manquante ici
  return { profile, isLoading, error, creationAttempted: profileCreationAttempted };
}