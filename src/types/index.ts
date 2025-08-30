// GoCours Types - Adapted for Prisma/PostgreSQL
// Replaces Firebase types with SQL equivalents

export enum Subject {
  Math = "Math",
  Mathematics = "Mathematics", 
  Physics = "Physics",
  Chemistry = "Chemistry",
  Biology = "Biology",
  English = "English",
  French = "French",
  German = "German",
  History = "History",
  ComputerScience = "Computer Science",
  MusicTheory = "Music Theory", 
  ArtHistory = "Art History",
  Economics = "Economics",
  Geography = "Geography",
}
export const AllSubjects = Object.values(Subject);

export enum LocationPreference {
  Online = "Online",
  InPerson = "In-Person", 
  Both = "Both",
}
export const AllLocationPreferences = Object.values(LocationPreference);

export enum TeachingLevel {
  Primary = "Primary",
  Secondary = "Secondary", 
  University = "University",
  Adult = "Adult",
  Professional = "Professional",
}
export const AllTeachingLevels = Object.values(TeachingLevel);

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  COMPLETED = "COMPLETED", 
  CANCELLED = "CANCELLED",
  NO_SHOW = "NO_SHOW",
}

export enum Role {
  tutor = "tutor",
  student = "student",
  admin = "admin",
}

// Location type (replaces Firebase GeoPoint)
export type Location = {
  city: string;
  lat?: number;
  lng?: number;
};

// Availability slot type
export type AvailabilitySlot = {
  id: string;
  dayOfWeek: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  timeSlot: "Morning" | "Afternoon" | "Evening";
  isActive: boolean;
};

// Core User Profile (from Prisma)
export type UserProfile = {
  id: string;
  clerkId: string;
  role: Role;
  displayName?: string;
  email?: string;
  photoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
};

// Tutor Profile (adapted from Firebase to Prisma)
export type TutorProfile = {
  id: string;
  userId: string;
  headline: string;
  bio: string;
  teachingLevels: string[];
  subjects: Subject[];
  languages: string[];
  hourlyRate: number;
  teachingFormats: string[];
  isVerified: boolean;
  averageRating: number;
  reviewCount: number;
  
  // Location (replaces GeoPoint)
  location?: Location;
  
  // Additional fields
  responseTime?: string;
  qualifications: string[];
  experienceYears?: number;
  
  createdAt: Date;
  updatedAt: Date;
  
  // Relations (optional for API responses)
  user?: UserProfile;
  reviews?: Review[];
  availability?: AvailabilitySlot[];
};

// Student Profile
export type StudentProfile = {
  id: string;
  userId: string;
  learningGoals?: string;
  preferredLevel?: string;
  budget?: number;
  
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  user?: UserProfile;
};

// Review type
export type Review = {
  id: string;
  rating: number;
  comment?: string;
  authorId: string;
  recipientId: string;
  tutorId: string;
  
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  author?: UserProfile;
  recipient?: UserProfile;
  tutor?: TutorProfile;
};

// Booking type
export type Booking = {
  id: string;
  studentId: string;
  tutorId: string;
  subject: string;
  scheduledAt: Date;
  duration: number;
  status: BookingStatus;
  totalAmount: number;
  sessionNotes?: string;
  
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  student?: UserProfile;
  tutor?: TutorProfile;
};

// Favorite type
export type Favorite = {
  id: string;
  userId: string;
  tutorId: string;
  createdAt: Date;
  
  // Relations
  user?: UserProfile;
  tutor?: TutorProfile;
};

// Legacy types for backward compatibility during migration
export type LegacyAvailabilitySlot = {
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  time: "Morning" | "Afternoon" | "Evening";
};

export type LegacyTutor = {
  id: string;
  name: string;
  headline: string;
  avatarUrl?: string;
  bio: string;
  subjects: Subject[];
  pricePerHour: number;
  experienceYears: number;
  locationPreference: LocationPreference;
  availability: LegacyAvailabilitySlot[];
  rating: number;
  reviewsCount: number;
  isFavorite?: boolean;
  contact?: {
    email?: string;
    phone?: string;
  };
  qualifications?: string[];
  responseTime?: string;
};

// API Response types
export type TutorSearchFilters = {
  subjects?: Subject[];
  priceRange?: [number, number];
  location?: string;
  teachingFormats?: string[];
  rating?: number;
  availability?: {
    day: string;
    time: string;
  };
};

export type TutorSearchResult = {
  tutors: TutorProfile[];
  totalCount: number;
  filters: TutorSearchFilters;
};

// Constants
export const AllDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;
export const AllTimes = ["Morning", "Afternoon", "Evening"] as const;
export const AllLanguages = ["English", "French", "Spanish", "German", "Italian", "Portuguese", "Mandarin", "Arabic"] as const;
export const AllTeachingFormats = ["Online", "InPerson", "Both"] as const;