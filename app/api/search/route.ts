import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';
import { Subject } from '../../../src/types';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const subjects = searchParams.get('subjects')?.split(',') as Subject[] | undefined;
    const minPrice = parseFloat(searchParams.get('minPrice') || '0');
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '1000');
    const location = searchParams.get('location');
    const minRating = parseFloat(searchParams.get('minRating') || '0');
    const teachingFormats = searchParams.get('teachingFormats')?.split(',');
    const languages = searchParams.get('languages')?.split(',');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    const skip = (page - 1) * limit;

    // Build where clause for tutors
    const where: Prisma.TutorProfileWhereInput = {
      hourlyRate: {
        gte: minPrice,
        lte: maxPrice
      },
      averageRating: {
        gte: minRating
      }
    };

    // Text search in headline and bio
    if (query) {
      where.OR = [
        {
          headline: {
            contains: query,
            mode: 'insensitive'
          }
        },
        {
          bio: {
            contains: query,
            mode: 'insensitive'
          }
        },
        {
          user: {
            displayName: {
              contains: query,
              mode: 'insensitive'
            }
          }
        }
      ];
    }

    // Subject filter
    if (subjects && subjects.length > 0) {
      where.subjects = {
        some: {
          name: {
            in: subjects
          }
        }
      };
    }

    // Location filter
    if (location) {
      where.locationCity = {
        contains: location,
        mode: 'insensitive'
      };
    }

    // Teaching formats filter
    if (teachingFormats && teachingFormats.length > 0) {
      where.teachingFormats = {
        hasSome: teachingFormats
      };
    }

    // Languages filter
    if (languages && languages.length > 0) {
      where.languages = {
        hasSome: languages
      };
    }

    // Execute search
    const [tutors, totalCount, availableSubjects, availableLocations] = await Promise.all([
      // Main tutors search
      prisma.tutorProfile.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              displayName: true,
              photoUrl: true
            }
          },
          subjects: true,
          reviews: {
            take: 3,
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
          availability: {
            where: { isActive: true }
          }
        },
        orderBy: [
          { averageRating: 'desc' },
          { reviewCount: 'desc' },
          { createdAt: 'desc' }
        ]
      }),
      
      // Total count for pagination
      prisma.tutorProfile.count({ where }),
      
      // Available subjects for filters
      prisma.subject.findMany({
        where: {
          tutors: {
            some: {}
          }
        },
        include: {
          _count: {
            select: { tutors: true }
          }
        },
        orderBy: { name: 'asc' }
      }),
      
      // Available locations for filters
      prisma.tutorProfile.findMany({
        where: {
          locationCity: {
            not: null
          }
        },
        select: {
          locationCity: true
        },
        distinct: ['locationCity'],
        orderBy: {
          locationCity: 'asc'
        }
      })
    ]);

    // Prepare filters metadata
    const filters = {
      subjects: availableSubjects.map(subject => ({
        name: subject.name,
        category: subject.category,
        count: subject._count.tutors
      })),
      locations: availableLocations.map(tutor => tutor.locationCity).filter(Boolean),
      priceRange: {
        min: minPrice,
        max: maxPrice
      },
      teachingFormats: ['Online', 'InPerson', 'Both'],
      languages: ['English', 'French', 'German', 'Spanish', 'Italian', 'Portuguese']
    };

    return NextResponse.json({
      success: true,
      data: {
        tutors,
        filters,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit)
        },
        searchQuery: {
          query,
          subjects,
          priceRange: [minPrice, maxPrice],
          location,
          minRating,
          teachingFormats,
          languages
        }
      }
    });

  } catch (error) {
    console.error('Error executing search:', error);
    return NextResponse.json(
      { success: false, error: 'Search failed' },
      { status: 500 }
    );
  }
}

// Advanced search with more sophisticated queries
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      query = '',
      filters = {},
      sortBy = 'rating',
      sortOrder = 'desc',
      page = 1,
      limit = 12
    } = body;

    const skip = (page - 1) * limit;

    // Build complex where clause
    const where: Prisma.TutorProfileWhereInput = {};
    
    // Apply filters
    if (filters.subjects?.length) {
      where.subjects = {
        some: {
          name: { in: filters.subjects }
        }
      };
    }
    
    if (filters.priceRange) {
      where.hourlyRate = {
        gte: filters.priceRange[0],
        lte: filters.priceRange[1]
      };
    }
    
    if (filters.location) {
      where.OR = [
        {
          locationCity: {
            contains: filters.location,
            mode: 'insensitive'
          }
        }
      ];
    }
    
    if (filters.rating) {
      where.averageRating = { gte: filters.rating };
    }
    
    if (filters.verified) {
      where.isVerified = true;
    }
    
    if (filters.teachingFormats?.length) {
      where.teachingFormats = {
        hasSome: filters.teachingFormats
      };
    }
    
    if (filters.experienceYears) {
      where.experienceYears = {
        gte: filters.experienceYears
      };
    }

    // Text search
    if (query) {
      if (where.OR) {
        where.OR.push(
          {
            headline: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            bio: {
              contains: query,
              mode: 'insensitive'
            }
          }
        );
      } else {
        where.OR = [
          {
            headline: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            bio: {
              contains: query,
              mode: 'insensitive'
            }
          }
        ];
      }
    }

    // Build sort options
    const orderBy: Prisma.TutorProfileOrderByWithRelationInput = {};
    switch (sortBy) {
      case 'rating':
        orderBy.averageRating = sortOrder;
        break;
      case 'price':
        orderBy.hourlyRate = sortOrder;
        break;
      case 'reviews':
        orderBy.reviewCount = sortOrder;
        break;
      case 'newest':
        orderBy.createdAt = 'desc';
        break;
      default:
        orderBy.averageRating = 'desc';
    }

    const [tutors, totalCount] = await Promise.all([
      prisma.tutorProfile.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              displayName: true,
              photoUrl: true
            }
          },
          subjects: true,
          reviews: {
            take: 3,
            orderBy: { createdAt: 'desc' },
            include: {
              author: {
                select: {
                  displayName: true,
                  photoUrl: true
                }
              }
            }
          }
        },
        orderBy
      }),
      prisma.tutorProfile.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        tutors,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit)
        },
        appliedFilters: filters,
        sortBy,
        sortOrder
      }
    });

  } catch (error) {
    console.error('Error in advanced search:', error);
    return NextResponse.json(
      { success: false, error: 'Advanced search failed' },
      { status: 500 }
    );
  }
}