import { prisma } from '@/app/lib/prisma';
import type { TutorProfile, TutorSearchFilters, Subject } from '@/src/types';

export class TutorService {
  static async findTutors(filters?: TutorSearchFilters) {
    const where: any = {};
    
    if (filters?.subjects?.length) {
      where.subjects = {
        some: {
          name: {
            in: filters.subjects
          }
        }
      };
    }
    
    if (filters?.priceRange) {
      where.hourlyRate = {
        gte: filters.priceRange[0],
        lte: filters.priceRange[1]
      };
    }
    
    if (filters?.location) {
      where.locationCity = {
        contains: filters.location,
        mode: 'insensitive'
      };
    }
    
    if (filters?.teachingFormats?.length) {
      where.teachingFormats = {
        hasSome: filters.teachingFormats
      };
    }
    
    if (filters?.rating) {
      where.averageRating = {
        gte: filters.rating
      };
    }
    
    const tutors = await prisma.tutorProfile.findMany({
      where,
      include: {
        user: {
          select: {
            displayName: true,
            photoUrl: true,
            email: true
          }
        },
        subjects: true,
        reviews: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            author: {
              select: {
                displayName: true,
                photoUrl: true
              }
            }
          }
        },
        availability: true
      },
      orderBy: [
        { averageRating: 'desc' },
        { reviewCount: 'desc' }
      ]
    });
    
    const totalCount = await prisma.tutorProfile.count({ where });
    
    return {
      tutors: tutors.map(this.mapPrismaTutorToTutorProfile),
      totalCount,
      filters: filters || {}
    };
  }
  
  static async findTutorById(id: string) {
    const tutor = await prisma.tutorProfile.findUnique({
      where: { id },
      include: {
        user: true,
        subjects: true,
        reviews: {
          include: {
            author: {
              select: {
                displayName: true,
                photoUrl: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        availability: true
      }
    });
    
    if (!tutor) return null;
    
    return this.mapPrismaTutorToTutorProfile(tutor);
  }
  
  static async createTutorProfile(userId: string, data: Partial<TutorProfile>) {
    const tutor = await prisma.tutorProfile.create({
      data: {
        userId,
        headline: data.headline || '',
        bio: data.bio || '',
        teachingLevels: data.teachingLevels || [],
        languages: data.languages || [],
        hourlyRate: data.hourlyRate || 0,
        teachingFormats: data.teachingFormats || [],
        locationCity: data.location?.city,
        locationLat: data.location?.lat,
        locationLng: data.location?.lng,
        qualifications: data.qualifications || [],
        experienceYears: data.experienceYears,
        responseTime: data.responseTime
      },
      include: {
        user: true,
        subjects: true
      }
    });
    
    return this.mapPrismaTutorToTutorProfile(tutor);
  }
  
  private static mapPrismaTutorToTutorProfile(prismatutor: any): TutorProfile {
    return {
      id: prismatutor.id,
      userId: prismatutor.userId,
      headline: prismatutor.headline,
      bio: prismatutor.bio,
      teachingLevels: prismatutor.teachingLevels,
      subjects: prismatutor.subjects?.map((s: any) => s.name as Subject) || [],
      languages: prismatutor.languages,
      hourlyRate: prismatutor.hourlyRate,
      teachingFormats: prismatutor.teachingFormats,
      isVerified: prismatutor.isVerified,
      averageRating: prismatutor.averageRating,
      reviewCount: prismatutor.reviewCount,
      location: prismatutor.locationCity ? {
        city: prismatutor.locationCity,
        lat: prismatutor.locationLat,
        lng: prismatutor.locationLng
      } : undefined,
      responseTime: prismatutor.responseTime,
      qualifications: prismatutor.qualifications || [],
      experienceYears: prismatutor.experienceYears,
      createdAt: prismatutor.createdAt,
      updatedAt: prismatutor.updatedAt,
      user: prismatutor.user,
      reviews: prismatutor.reviews,
      availability: prismatutor.availability
    };
  }
}

export class SubjectService {
  static async seedSubjects() {
    const subjects = [
      { name: "Mathematics", category: "Science" },
      { name: "Physics", category: "Science" },
      { name: "Chemistry", category: "Science" },
      { name: "Biology", category: "Science" },
      { name: "English", category: "Language" },
      { name: "French", category: "Language" },
      { name: "German", category: "Language" },
      { name: "History", category: "Humanities" },
      { name: "Computer Science", category: "Technology" },
      { name: "Music Theory", category: "Arts" },
      { name: "Art History", category: "Arts" },
      { name: "Economics", category: "Business" },
      { name: "Geography", category: "Humanities" }
    ];
    
    for (const subject of subjects) {
      await prisma.subject.upsert({
        where: { name: subject.name },
        update: {},
        create: subject
      });
    }
  }
  
  static async getAllSubjects() {
    return await prisma.subject.findMany({
      orderBy: { name: 'asc' }
    });
  }
}