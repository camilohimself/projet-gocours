'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export function useCreateUserProfile() {
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    if (!isSignedIn || !user) return;

    const createProfile = async () => {
      await fetch('/api/user-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clerkId: user.id,
          email: user.primaryEmailAddress?.emailAddress,
        }),
      });
    };

    createProfile();
  }, [isSignedIn, user]);
}
