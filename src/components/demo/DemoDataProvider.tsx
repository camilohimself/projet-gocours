'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { mockTutors, mockReviews, mockSubjects } from '@/src/lib/mock-data';
import type { TutorProfile, Review } from '@/src/types';

// Enhanced tutor type for demo components
export type DemoTutor = TutorProfile & {
  user?: {
    displayName: string | null;
    photoUrl: string | null;
  };
  subjects?: { name: string; category?: string }[];
  reviews?: Array<{
    rating: number;
    comment?: string;
    author?: {
      displayName: string | null;
    };
  }>;
};

interface DemoData {
  tutors: DemoTutor[];
  reviews: Review[];
  subjects: any[];
  isLoading: boolean;
}

const DemoDataContext = createContext<DemoData>({
  tutors: [],
  reviews: [],
  subjects: [],
  isLoading: true
});

export function useDemoData() {
  return useContext(DemoDataContext);
}

export function DemoDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<DemoData>({
    tutors: [],
    reviews: [],
    subjects: [],
    isLoading: true
  });

  useEffect(() => {
    // Simuler un délai de chargement réaliste
    const timer = setTimeout(() => {
      setData({
        tutors: mockTutors,
        reviews: mockReviews,
        subjects: mockSubjects,
        isLoading: false
      });
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <DemoDataContext.Provider value={data}>
      {children}
    </DemoDataContext.Provider>
  );
}