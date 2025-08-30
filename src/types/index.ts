export interface User {
  id: string;
  email: string;
  role: 'student' | 'tutor' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface TutorProfile extends User {
  firstName: string;
  lastName: string;
  bio: string;
  subjects: Subject[];
  languages: Language[];
  hourlyRate: number;
  experience: number; // years
  education: Education[];
  availability: Availability[];
  rating: number;
  reviewCount: number;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  teachingStyle: TeachingStyle;
  knowledgeGraph?: KnowledgeNode[];
}

export interface StudentProfile extends User {
  firstName: string;
  lastName: string;
  grade?: string;
  learningGoals: string[];
  preferredSubjects: Subject[];
  learningStyle: LearningStyle;
  knowledgeGraph?: KnowledgeNode[];
}

export interface Subject {
  id: string;
  name: string;
  category: 'mathematics' | 'sciences' | 'languages' | 'arts' | 'technology' | 'other';
  level: 'primary' | 'secondary' | 'high-school' | 'university' | 'professional';
}

export interface Language {
  code: string;
  name: string;
  proficiency: 'native' | 'fluent' | 'intermediate' | 'basic';
}

export interface Education {
  degree: string;
  institution: string;
  year: number;
  field: string;
}

export interface Availability {
  dayOfWeek: number; // 0-6
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  timezone: string;
}

export interface Session {
  id: string;
  tutorId: string;
  studentId: string;
  subjectId: string;
  scheduledAt: Date;
  duration: number; // minutes
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  price: number;
  meetingUrl?: string;
  notes?: string;
  aiInsights?: AISessionInsights;
}

export interface Review {
  id: string;
  sessionId: string;
  studentId: string;
  tutorId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: Date;
}

// AI-specific types
export interface KnowledgeNode {
  id: string;
  subject: string;
  concept: string;
  mastery: number; // 0-100
  connections: string[]; // IDs of connected nodes
  lastUpdated: Date;
}

export interface TeachingStyle {
  approach: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  pace: 'slow' | 'moderate' | 'fast' | 'adaptive';
  structure: 'structured' | 'flexible' | 'exploratory';
}

export interface LearningStyle {
  preference: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
  pace: 'slow' | 'moderate' | 'fast';
  interaction: 'high' | 'medium' | 'low';
}

export interface AIMatchScore {
  overall: number; // 0-100
  styleCompatibility: number;
  subjectExpertise: number;
  availabilityMatch: number;
  priceMatch: number;
  personalityFit: number;
  predictedSuccess: number;
  reasoning: string[];
}

export interface AISessionInsights {
  summary: string;
  keyConceptsCovered: string[];
  studentEngagement: number; // 0-100
  comprehensionLevel: number; // 0-100
  recommendations: string[];
  nextSteps: string[];
  generatedQuestions: Question[];
}

export interface Question {
  id: string;
  text: string;
  difficulty: 'easy' | 'medium' | 'hard';
  concept: string;
  correctAnswer?: string;
  explanation?: string;
}

export interface LearningPath {
  id: string;
  studentId: string;
  goal: string;
  milestones: Milestone[];
  currentProgress: number; // 0-100
  estimatedCompletion: Date;
  recommendedTutors: string[];
  aiGenerated: boolean;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  requiredSessions: number;
  completedSessions: number;
  concepts: string[];
  status: 'pending' | 'in-progress' | 'completed';
}