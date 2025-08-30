// app/components/InitializeUserProfile.tsx
'use client';

import { useCreateUserProfile } from '../hooks/useCreateUserProfile'; // Ou le chemin relatif correct si l'alias ne marche pas pour CE hook
import { useEffect } from 'react';

export default function InitializeUserProfile() {
  const { profile, isLoading, error, creationAttempted } = useCreateUserProfile();

  useEffect(() => {
    if (isLoading) {
      console.log('Tentative de création/vérification du profil utilisateur...');
    }
    if (error) {
      console.error('Erreur lors de la création/vérification du profil:', error);
    }
    if (profile) {
      console.log('Profil utilisateur initialisé ou vérifié:', profile);
    }
    if (creationAttempted && !isLoading && !profile && !error) {
        console.log('Tentative de création de profil terminée. Le profil existait probablement déjà (vérifié côté serveur).');
    }
  }, [profile, isLoading, error, creationAttempted]);

  return null;
}