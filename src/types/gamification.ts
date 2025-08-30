export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockCondition: {
    type: 'sessions_completed' | 'hours_taught' | 'rating' | 'streak' | 'students_helped';
    value: number;
    comparison: 'gte' | 'lte' | 'eq';
  };
  unlockedAt?: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: 'teaching' | 'learning' | 'social' | 'achievement' | 'special';
  requirements: string[];
  unlockedAt?: Date;
}

export interface PrestigeLevel {
  level: number;
  name: string;
  minXP: number;
  maxXP: number;
  color: string;
  benefits: string[];
  icon: string;
}

export interface UserProgress {
  userId: string;
  level: number;
  xp: number;
  totalXP: number;
  achievements: Achievement[];
  badges: Badge[];
  streak: {
    current: number;
    longest: number;
    lastActivity: Date;
  };
  stats: {
    sessionsCompleted: number;
    hoursSpent: number;
    averageRating: number;
    studentsHelped?: number; // for tutors
    subjectsMastered?: number; // for students
  };
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  avatar?: string;
  level: number;
  xp: number;
  badges: Badge[];
  rank: number;
  category: 'global' | 'weekly' | 'monthly' | string; // subject-specific
}

export interface QuestChallenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'seasonal';
  requirements: {
    type: string;
    target: number;
    current: number;
  }[];
  rewards: {
    xp: number;
    badges?: string[];
    specialReward?: string;
  };
  startDate: Date;
  endDate: Date;
  completed: boolean;
}

// Predefined achievements for tutors
export const TUTOR_ACHIEVEMENTS: Omit<Achievement, 'id' | 'unlockedAt'>[] = [
  {
    name: 'First Blood',
    description: 'Donnez votre premier cours',
    icon: '🩸',
    xpReward: 50,
    rarity: 'common',
    unlockCondition: { type: 'sessions_completed', value: 1, comparison: 'gte' }
  },
  {
    name: 'Rising Star',
    description: 'Obtenez 10 avis 5 étoiles',
    icon: '⭐',
    xpReward: 200,
    rarity: 'rare',
    unlockCondition: { type: 'rating', value: 5, comparison: 'gte' }
  },
  {
    name: 'On Fire',
    description: '10 cours donnés consécutivement',
    icon: '🔥',
    xpReward: 300,
    rarity: 'rare',
    unlockCondition: { type: 'streak', value: 10, comparison: 'gte' }
  },
  {
    name: 'Diamond Teacher',
    description: 'Enseignez pendant 100 heures',
    icon: '💎',
    xpReward: 500,
    rarity: 'epic',
    unlockCondition: { type: 'hours_taught', value: 100, comparison: 'gte' }
  },
  {
    name: 'Unicorn',
    description: 'Aidez 1000 élèves différents',
    icon: '🦄',
    xpReward: 1000,
    rarity: 'legendary',
    unlockCondition: { type: 'students_helped', value: 1000, comparison: 'gte' }
  }
];

// Prestige levels
export const PRESTIGE_LEVELS: PrestigeLevel[] = [
  {
    level: 1,
    name: 'Novice',
    minXP: 0,
    maxXP: 100,
    color: '#94A3B8',
    icon: '🌱',
    benefits: ['Profil de base', 'Matching standard']
  },
  {
    level: 2,
    name: 'Apprenti',
    minXP: 100,
    maxXP: 300,
    color: '#06B6D4',
    icon: '🎯',
    benefits: ['Badge apprenti', 'Boost visibilité +10%']
  },
  {
    level: 3,
    name: 'Expert',
    minXP: 300,
    maxXP: 600,
    color: '#10B981',
    icon: '⚡',
    benefits: ['Badge expert', 'Matching prioritaire']
  },
  {
    level: 4,
    name: 'Maître',
    minXP: 600,
    maxXP: 1000,
    color: '#F59E0B',
    icon: '👑',
    benefits: ['Badge maître', 'Profil mis en avant']
  },
  {
    level: 5,
    name: 'Grand Maître',
    minXP: 1000,
    maxXP: 1500,
    color: '#EF4444',
    icon: '🏆',
    benefits: ['Badge grand maître', 'Top 10 garanti']
  },
  {
    level: 6,
    name: 'Sage',
    minXP: 1500,
    maxXP: 2500,
    color: '#8B5CF6',
    icon: '🧙',
    benefits: ['Badge sage', 'Accès fonctions exclusives']
  },
  {
    level: 7,
    name: 'Légende',
    minXP: 2500,
    maxXP: 5000,
    color: '#EC4899',
    icon: '⚔️',
    benefits: ['Badge légende', 'Hall of Fame']
  },
  {
    level: 8,
    name: 'Mythique',
    minXP: 5000,
    maxXP: Infinity,
    color: '#F97316',
    icon: '🔱',
    benefits: ['Badge mythique', 'Statut légende ultime']
  }
];

// XP calculation functions
export const calculateXP = {
  sessionCompleted: (duration: number) => Math.floor(duration / 6), // 1 XP per 6 minutes
  perfectRating: () => 25,
  helpedNewStudent: () => 15,
  weeklyStreak: (streakDays: number) => streakDays * 5,
  reviewGiven: () => 5,
  profileCompleted: () => 50,
  verificationCompleted: () => 100
};

export const getLevelFromXP = (xp: number): PrestigeLevel => {
  return PRESTIGE_LEVELS.find(level => xp >= level.minXP && xp < level.maxXP) || PRESTIGE_LEVELS[0];
};

export const getXPToNextLevel = (currentXP: number): number => {
  const currentLevel = getLevelFromXP(currentXP);
  return currentLevel.maxXP - currentXP;
};