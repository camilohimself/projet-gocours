// Mock data for GoCours platform

export const SUBJECTS_DATA = [
  // Mathematics
  { name: 'Algebra', category: 'Mathematics', description: 'Linear and non-linear algebra, equations, functions' },
  { name: 'Geometry', category: 'Mathematics', description: 'Plane and solid geometry, trigonometry' },
  { name: 'Calculus', category: 'Mathematics', description: 'Differential and integral calculus' },
  { name: 'Statistics', category: 'Mathematics', description: 'Descriptive and inferential statistics, probability' },
  
  // Sciences
  { name: 'Physics', category: 'Science', description: 'Classical and modern physics, mechanics, electromagnetism' },
  { name: 'Chemistry', category: 'Science', description: 'Organic, inorganic, and physical chemistry' },
  { name: 'Biology', category: 'Science', description: 'Cell biology, genetics, ecology, human biology' },
  { name: 'Earth Science', category: 'Science', description: 'Geology, meteorology, environmental science' },
  
  // Languages
  { name: 'English', category: 'Language', description: 'Grammar, literature, writing, conversation' },
  { name: 'French', category: 'Language', description: 'French language and literature' },
  { name: 'Spanish', category: 'Language', description: 'Spanish language and culture' },
  { name: 'German', category: 'Language', description: 'German language and literature' },
  { name: 'Italian', category: 'Language', description: 'Italian language and culture' },
  
  // Computer Science
  { name: 'Programming', category: 'Computer Science', description: 'Python, JavaScript, Java, C++' },
  { name: 'Web Development', category: 'Computer Science', description: 'HTML, CSS, React, Node.js' },
  { name: 'Data Science', category: 'Computer Science', description: 'Machine learning, data analysis, Python' },
  { name: 'Database Design', category: 'Computer Science', description: 'SQL, database modeling, optimization' },
  
  // History & Social Sciences
  { name: 'World History', category: 'History', description: 'Ancient to modern world history' },
  { name: 'European History', category: 'History', description: 'Medieval to contemporary European history' },
  { name: 'Psychology', category: 'Social Science', description: 'General psychology, cognitive psychology' },
  { name: 'Economics', category: 'Social Science', description: 'Micro and macroeconomics, economic theory' },
  
  // Arts
  { name: 'Music Theory', category: 'Arts', description: 'Music theory, composition, analysis' },
  { name: 'Art History', category: 'Arts', description: 'Western and contemporary art history' },
  { name: 'Creative Writing', category: 'Arts', description: 'Fiction, poetry, screenwriting' },
  
  // Test Preparation
  { name: 'SAT Prep', category: 'Test Prep', description: 'SAT mathematics and verbal preparation' },
  { name: 'TOEFL Prep', category: 'Test Prep', description: 'English proficiency test preparation' },
  { name: 'GMAT Prep', category: 'Test Prep', description: 'Graduate management admission test prep' },
];

export const EUROPEAN_CITIES = [
  { name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522 },
  { name: 'London', country: 'UK', lat: 51.5074, lng: -0.1278 },
  { name: 'Berlin', country: 'Germany', lat: 52.5200, lng: 13.4050 },
  { name: 'Madrid', country: 'Spain', lat: 40.4168, lng: -3.7038 },
  { name: 'Rome', country: 'Italy', lat: 41.9028, lng: 12.4964 },
  { name: 'Amsterdam', country: 'Netherlands', lat: 52.3676, lng: 4.9041 },
  { name: 'Vienna', country: 'Austria', lat: 48.2082, lng: 16.3738 },
  { name: 'Brussels', country: 'Belgium', lat: 50.8503, lng: 4.3517 },
  { name: 'Zurich', country: 'Switzerland', lat: 47.3769, lng: 8.5417 },
  { name: 'Stockholm', country: 'Sweden', lat: 59.3293, lng: 18.0686 },
  { name: 'Copenhagen', country: 'Denmark', lat: 55.6761, lng: 12.5683 },
  { name: 'Dublin', country: 'Ireland', lat: 53.3498, lng: -6.2603 },
];

export const TUTOR_PROFILES = [
  {
    clerkId: 'tutor_001',
    displayName: 'Dr. Marie Dubois',
    email: 'marie.dubois@example.com',
    photoUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b378?w=400',
    headline: 'Mathematics Professor with 15 years experience',
    bio: 'Passionate mathematics educator with a PhD from Sorbonne University. I specialize in making complex mathematical concepts accessible and enjoyable for students of all levels. My teaching philosophy emphasizes understanding over memorization.',
    teachingLevels: ['Secondary', 'University', 'Adult'],
    subjects: ['Algebra', 'Calculus', 'Statistics'],
    languages: ['French', 'English'],
    hourlyRate: 45.0,
    teachingFormats: ['Online', 'InPerson'],
    city: 'Paris',
    responseTime: 'Within 2 hours',
    qualifications: ['PhD Mathematics - Sorbonne University', 'Licensed Secondary Teacher', '15 years teaching experience'],
    experienceYears: 15,
  },
  {
    clerkId: 'tutor_002',
    displayName: 'James Thompson',
    email: 'james.thompson@example.com',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    headline: 'Physics PhD & Science Education Expert',
    bio: 'Former research physicist turned educator. I help students discover the beauty of physics through hands-on experiments and real-world applications. Specializing in A-level and university physics.',
    teachingLevels: ['Secondary', 'University'],
    subjects: ['Physics', 'Algebra'],
    languages: ['English'],
    hourlyRate: 50.0,
    teachingFormats: ['Online', 'InPerson'],
    city: 'London',
    responseTime: 'Within 1 hour',
    qualifications: ['PhD Physics - Imperial College London', 'PGCE Secondary Science', '12 years industry experience'],
    experienceYears: 8,
  },
  {
    clerkId: 'tutor_003',
    displayName: 'Sofia Rodriguez',
    email: 'sofia.rodriguez@example.com',
    photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    headline: 'Bilingual Language Specialist - Spanish & English',
    bio: 'Native Spanish speaker with expertise in language acquisition. I create immersive learning experiences that help students achieve fluency quickly and naturally. Certified in DELE exam preparation.',
    teachingLevels: ['Primary', 'Secondary', 'Adult'],
    subjects: ['Spanish', 'English'],
    languages: ['Spanish', 'English', 'French'],
    hourlyRate: 35.0,
    teachingFormats: ['Online', 'InPerson'],
    city: 'Madrid',
    responseTime: 'Within 3 hours',
    qualifications: ['MA Applied Linguistics', 'DELE Examiner Certification', 'TEFL Certified'],
    experienceYears: 6,
  },
  {
    clerkId: 'tutor_004',
    displayName: 'Dr. Hans Mueller',
    email: 'hans.mueller@example.com',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    headline: 'Chemistry Professor & Lab Safety Expert',
    bio: 'Experienced chemistry professor with industrial background. I make chemistry come alive through safe, engaging experiments and clear explanations of chemical principles.',
    teachingLevels: ['Secondary', 'University'],
    subjects: ['Chemistry', 'Physics'],
    languages: ['German', 'English'],
    hourlyRate: 48.0,
    teachingFormats: ['Online', 'InPerson'],
    city: 'Berlin',
    responseTime: 'Within 4 hours',
    qualifications: ['PhD Chemistry - Max Planck Institute', '10 years pharmaceutical industry', 'Safety certified instructor'],
    experienceYears: 12,
  },
  {
    clerkId: 'tutor_005',
    displayName: 'Emma Johnson',
    email: 'emma.johnson@example.com',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    headline: 'Full-Stack Developer & Programming Instructor',
    bio: 'Software engineer with 8 years in tech, now dedicated to teaching programming. I help students build real projects while learning fundamental computer science concepts.',
    teachingLevels: ['Secondary', 'University', 'Adult'],
    subjects: ['Programming', 'Web Development', 'Database Design'],
    languages: ['English'],
    hourlyRate: 60.0,
    teachingFormats: ['Online'],
    city: 'Amsterdam',
    responseTime: 'Within 2 hours',
    qualifications: ['BSc Computer Science', 'Full-Stack Developer', 'Google Cloud Certified'],
    experienceYears: 5,
  },
  {
    clerkId: 'tutor_006',
    displayName: 'Alessandro Rossi',
    email: 'alessandro.rossi@example.com',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    headline: 'Art History PhD & Museum Curator',
    bio: 'Art historian and museum professional passionate about making art accessible. I bring artworks to life through engaging storytelling and historical context.',
    teachingLevels: ['Secondary', 'University', 'Adult'],
    subjects: ['Art History', 'World History'],
    languages: ['Italian', 'English', 'French'],
    hourlyRate: 42.0,
    teachingFormats: ['Online', 'InPerson'],
    city: 'Rome',
    responseTime: 'Within 6 hours',
    qualifications: ['PhD Art History - University of Florence', 'Museum Studies Certificate', '8 years curatorial experience'],
    experienceYears: 10,
  },
  {
    clerkId: 'tutor_007',
    displayName: 'Lisa Chen',
    email: 'lisa.chen@example.com',
    photoUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400',
    headline: 'Data Science Expert & Statistics Tutor',
    bio: 'Data scientist with expertise in machine learning and statistical analysis. I help students master data science concepts through practical, real-world projects.',
    teachingLevels: ['University', 'Adult'],
    subjects: ['Data Science', 'Statistics', 'Programming'],
    languages: ['English', 'French'],
    hourlyRate: 65.0,
    teachingFormats: ['Online'],
    city: 'Zurich',
    responseTime: 'Within 1 hour',
    qualifications: ['MSc Data Science - ETH Zurich', 'Google Cloud ML Engineer', '6 years industry experience'],
    experienceYears: 4,
  },
  {
    clerkId: 'tutor_008',
    displayName: 'Pierre Martin',
    email: 'pierre.martin@example.com',
    photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
    headline: 'French Literature Professor & DELF Examiner',
    bio: 'Literature professor specializing in French language and culture. Certified DELF examiner with experience preparing students for international French proficiency exams.',
    teachingLevels: ['Secondary', 'University', 'Adult'],
    subjects: ['French', 'Creative Writing'],
    languages: ['French', 'English'],
    hourlyRate: 40.0,
    teachingFormats: ['Online', 'InPerson'],
    city: 'Brussels',
    responseTime: 'Within 3 hours',
    qualifications: ['PhD French Literature - UCLouvain', 'DELF/DALF Examiner', 'Alliance Française certified'],
    experienceYears: 14,
  },
  {
    clerkId: 'tutor_009',
    displayName: 'Anna Larsson',
    email: 'anna.larsson@example.com',
    photoUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b378?w=400',
    headline: 'Economics PhD & Financial Literacy Educator',
    bio: 'Economics professor with expertise in macroeconomics and financial markets. I make complex economic concepts understandable and relevant to everyday life.',
    teachingLevels: ['Secondary', 'University', 'Adult'],
    subjects: ['Economics', 'Statistics'],
    languages: ['Swedish', 'English', 'German'],
    hourlyRate: 52.0,
    teachingFormats: ['Online', 'InPerson'],
    city: 'Stockholm',
    responseTime: 'Within 2 hours',
    qualifications: ['PhD Economics - Stockholm School of Economics', 'CFA Charter', 'Financial education specialist'],
    experienceYears: 9,
  },
  {
    clerkId: 'tutor_010',
    displayName: 'Michael O\'Sullivan',
    email: 'michael.osullivan@example.com',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
    headline: 'Biology PhD & Environmental Science Educator',
    bio: 'Marine biologist turned educator with a passion for environmental conservation. I bring the natural world into the classroom through interactive lessons and field experiences.',
    teachingLevels: ['Primary', 'Secondary', 'University'],
    subjects: ['Biology', 'Earth Science'],
    languages: ['English', 'Irish'],
    hourlyRate: 44.0,
    teachingFormats: ['Online', 'InPerson'],
    city: 'Dublin',
    responseTime: 'Within 4 hours',
    qualifications: ['PhD Marine Biology - Trinity College Dublin', 'Environmental Education Certificate', '7 years research experience'],
    experienceYears: 11,
  },
  {
    clerkId: 'tutor_011',
    displayName: 'Ingrid Hansen',
    email: 'ingrid.hansen@example.com',
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
    headline: 'Music Theory Professor & Composer',
    bio: 'Classically trained musician and composer with expertise in music theory and composition. I help students understand the language of music and develop their creative expression.',
    teachingLevels: ['Primary', 'Secondary', 'University', 'Adult'],
    subjects: ['Music Theory'],
    languages: ['Danish', 'English', 'German'],
    hourlyRate: 38.0,
    teachingFormats: ['Online', 'InPerson'],
    city: 'Copenhagen',
    responseTime: 'Within 3 hours',
    qualifications: ['MM Music Composition - Royal Danish Academy', 'Professional composer', '15 years performance experience'],
    experienceYears: 8,
  },
  {
    clerkId: 'tutor_012',
    displayName: 'Thomas Weber',
    email: 'thomas.weber@example.com',
    photoUrl: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400',
    headline: 'Psychology PhD & Cognitive Science Researcher',
    bio: 'Research psychologist with expertise in cognitive psychology and learning theory. I apply scientific principles to help students optimize their learning strategies.',
    teachingLevels: ['University', 'Adult'],
    subjects: ['Psychology', 'Statistics'],
    languages: ['German', 'English'],
    hourlyRate: 55.0,
    teachingFormats: ['Online', 'InPerson'],
    city: 'Vienna',
    responseTime: 'Within 2 hours',
    qualifications: ['PhD Psychology - University of Vienna', 'Licensed Clinical Psychologist', 'Research methodology expert'],
    experienceYears: 7,
  },
];

export const STUDENT_PROFILES = [
  {
    clerkId: 'student_001',
    displayName: 'Alice Martin',
    email: 'alice.martin@example.com',
    photoUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b378?w=400',
    learningGoals: 'Improve calculus grades for university entrance',
    preferredLevel: 'Secondary',
    budget: 40.0,
  },
  {
    clerkId: 'student_002',
    displayName: 'David Wilson',
    email: 'david.wilson@example.com',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    learningGoals: 'Learn programming for career change',
    preferredLevel: 'Adult',
    budget: 60.0,
  },
  {
    clerkId: 'student_003',
    displayName: 'Sarah Brown',
    email: 'sarah.brown@example.com',
    photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    learningGoals: 'Prepare for DELE Spanish certification',
    preferredLevel: 'Adult',
    budget: 35.0,
  },
  {
    clerkId: 'student_004',
    displayName: 'Marco Silva',
    email: 'marco.silva@example.com',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    learningGoals: 'University physics preparation',
    preferredLevel: 'Secondary',
    budget: 50.0,
  },
  {
    clerkId: 'student_005',
    displayName: 'Emma Johansson',
    email: 'emma.johansson@example.com',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    learningGoals: 'Improve English for international studies',
    preferredLevel: 'University',
    budget: 45.0,
  },
];

export const REVIEW_TEMPLATES = [
  {
    rating: 5.0,
    comments: [
      'Excellent teacher! Very clear explanations and patient with questions.',
      'Amazing tutor who made complex topics easy to understand. Highly recommend!',
      'Best tutor I\'ve had. Always prepared and engaging lessons.',
      'Fantastic teaching style and very knowledgeable. Helped me improve significantly.',
      'Outstanding educator who goes above and beyond for students.',
    ]
  },
  {
    rating: 4.5,
    comments: [
      'Great tutor with solid knowledge. Sometimes a bit fast-paced.',
      'Very good teacher, clear explanations. Would recommend.',
      'Knowledgeable and helpful, though could use more practice exercises.',
      'Good teaching methods and patient approach. Minor scheduling issues.',
      'Effective tutor who helped me understand difficult concepts.',
    ]
  },
  {
    rating: 4.0,
    comments: [
      'Good tutor overall. Lessons were helpful and well-structured.',
      'Solid teaching skills, though could be more interactive.',
      'Helpful and knowledgeable, but lessons felt a bit rushed.',
      'Good explanations and patient with questions. Recommend for basics.',
      'Decent tutor with good subject knowledge.',
    ]
  },
  {
    rating: 3.5,
    comments: [
      'Average tutor. Helped with some topics but could be more engaging.',
      'Okay teaching style, though sometimes hard to follow.',
      'Decent knowledge but lessons lacked structure.',
      'Helpful but not very inspiring. Gets the job done.',
      'Basic tutoring, could use more personalized approach.',
    ]
  },
];

export const AVAILABILITY_SLOTS = [
  { dayOfWeek: 'Monday', timeSlot: 'Morning' },
  { dayOfWeek: 'Monday', timeSlot: 'Afternoon' },
  { dayOfWeek: 'Monday', timeSlot: 'Evening' },
  { dayOfWeek: 'Tuesday', timeSlot: 'Morning' },
  { dayOfWeek: 'Tuesday', timeSlot: 'Afternoon' },
  { dayOfWeek: 'Tuesday', timeSlot: 'Evening' },
  { dayOfWeek: 'Wednesday', timeSlot: 'Morning' },
  { dayOfWeek: 'Wednesday', timeSlot: 'Afternoon' },
  { dayOfWeek: 'Wednesday', timeSlot: 'Evening' },
  { dayOfWeek: 'Thursday', timeSlot: 'Morning' },
  { dayOfWeek: 'Thursday', timeSlot: 'Afternoon' },
  { dayOfWeek: 'Thursday', timeSlot: 'Evening' },
  { dayOfWeek: 'Friday', timeSlot: 'Morning' },
  { dayOfWeek: 'Friday', timeSlot: 'Afternoon' },
  { dayOfWeek: 'Friday', timeSlot: 'Evening' },
  { dayOfWeek: 'Saturday', timeSlot: 'Morning' },
  { dayOfWeek: 'Saturday', timeSlot: 'Afternoon' },
  { dayOfWeek: 'Sunday', timeSlot: 'Afternoon' },
  { dayOfWeek: 'Sunday', timeSlot: 'Evening' },
];

export const BOOKING_SUBJECTS = [
  'Algebra', 'Physics', 'Chemistry', 'Biology', 'English', 'French', 
  'Spanish', 'German', 'Programming', 'Data Science', 'Economics', 'Psychology'
];

// Helper functions
export function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function getRandomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function generateRandomDate(daysAgo: number, daysAhead: number): Date {
  const now = new Date();
  const start = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  const end = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// ===================================
// MOCK DATA GENERATORS FOR DEMO
// ===================================

import { TutorProfile, Review, Subject, UserProfile } from '@/src/types';

// Generate mock tutors from the profile data
export function generateMockTutors(): Array<TutorProfile & {
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
}> {
  return TUTOR_PROFILES.map((profile, index) => {
    // Generate random ratings and review count
    const reviewCount = Math.floor(Math.random() * 100) + 5;
    const averageRating = Math.round((Math.random() * 1.5 + 3.5) * 10) / 10; // 3.5-5.0 rating
    
    // Map subject strings to Subject objects
    const subjectObjects = profile.subjects.map(subjectName => ({
      name: subjectName,
      category: SUBJECTS_DATA.find(s => s.name === subjectName)?.category
    }));
    
    return {
      id: `demo_tutor_${index + 1}`,
      userId: profile.clerkId,
      headline: profile.headline,
      bio: profile.bio,
      teachingLevels: profile.teachingLevels,
      subjects: profile.subjects as Subject[],
      languages: profile.languages,
      hourlyRate: profile.hourlyRate,
      teachingFormats: profile.teachingFormats,
      isVerified: Math.random() > 0.3, // 70% verified
      averageRating,
      reviewCount,
      location: {
        city: profile.city,
        lat: EUROPEAN_CITIES.find(c => c.name === profile.city)?.lat,
        lng: EUROPEAN_CITIES.find(c => c.name === profile.city)?.lng,
      },
      responseTime: profile.responseTime,
      qualifications: profile.qualifications,
      experienceYears: profile.experienceYears,
      createdAt: generateRandomDate(365, 0), // Created within last year
      updatedAt: generateRandomDate(30, 0), // Updated within last month
      
      // Additional fields expected by components
      user: {
        displayName: profile.displayName,
        photoUrl: profile.photoUrl,
      },
      subjects: subjectObjects,
      reviews: generateMockReviewsForTutor(index + 1, reviewCount, averageRating),
    };
  });
}

// Generate mock reviews for a tutor
function generateMockReviewsForTutor(tutorIndex: number, count: number, averageRating: number) {
  const reviews = [];
  
  for (let i = 0; i < Math.min(count, 10); i++) { // Limit to 10 reviews for performance
    const ratingVariation = (Math.random() - 0.5) * 2; // -1 to 1
    const rating = Math.max(1, Math.min(5, Math.round(averageRating + ratingVariation)));
    
    const ratingTemplate = REVIEW_TEMPLATES.find(template => 
      Math.abs(template.rating - rating) < 0.5
    ) || REVIEW_TEMPLATES[0];
    
    reviews.push({
      rating,
      comment: getRandomElement(ratingTemplate.comments),
      author: {
        displayName: getRandomElement([
          'Alex M.', 'Sarah K.', 'James L.', 'Emma R.', 'David W.',
          'Lisa C.', 'Michael B.', 'Anna S.', 'Thomas H.', 'Marie D.'
        ])
      }
    });
  }
  
  return reviews;
}

// Generate available cities for filters
export function getAvailableCities(): string[] {
  return EUROPEAN_CITIES.map(city => city.name);
}

// Mock data exports
export const mockTutors = generateMockTutors();
export const mockReviews: Review[] = []; // Not needed for this demo
export const mockSubjects = SUBJECTS_DATA;