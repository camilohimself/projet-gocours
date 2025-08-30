import { NextRequest, NextResponse } from 'next/server';
import { mockTutors } from '@/src/lib/mock-data';
import type { TutorSearchFilters } from '@/src/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const subjects = searchParams.get('subjects')?.split(',').filter(Boolean);
    const minPrice = parseFloat(searchParams.get('minPrice') || '0');
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '1000');
    const location = searchParams.get('location');
    const minRating = parseFloat(searchParams.get('minRating') || '0');
    const teachingFormats = searchParams.get('teachingFormats')?.split(',').filter(Boolean);
    const languages = searchParams.get('languages')?.split(',').filter(Boolean);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const sortBy = searchParams.get('sortBy') || 'rating';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    let filteredTutors = [...mockTutors];

    // Text search
    if (query) {
      const queryLower = query.toLowerCase();
      filteredTutors = filteredTutors.filter(tutor => 
        tutor.headline.toLowerCase().includes(queryLower) ||
        tutor.bio.toLowerCase().includes(queryLower) ||
        tutor.user?.displayName?.toLowerCase().includes(queryLower) ||
        tutor.subjects.some(subject => subject.toString().toLowerCase().includes(queryLower))
      );
    }

    // Subject filter
    if (subjects && subjects.length > 0) {
      filteredTutors = filteredTutors.filter(tutor =>
        subjects.some(subject => 
          tutor.subjects.map(s => s.toString()).includes(subject)
        )
      );
    }

    // Price filter
    filteredTutors = filteredTutors.filter(tutor =>
      tutor.hourlyRate >= minPrice && tutor.hourlyRate <= maxPrice
    );

    // Location filter
    if (location) {
      filteredTutors = filteredTutors.filter(tutor =>
        tutor.location?.city.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Rating filter
    filteredTutors = filteredTutors.filter(tutor =>
      tutor.averageRating >= minRating
    );

    // Teaching format filter
    if (teachingFormats && teachingFormats.length > 0) {
      filteredTutors = filteredTutors.filter(tutor =>
        teachingFormats.some(format => tutor.teachingFormats.includes(format))
      );
    }

    // Languages filter
    if (languages && languages.length > 0) {
      filteredTutors = filteredTutors.filter(tutor =>
        languages.some(language => tutor.languages.includes(language))
      );
    }

    // Sorting
    filteredTutors.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'rating':
          comparison = b.averageRating - a.averageRating;
          break;
        case 'price':
          comparison = a.hourlyRate - b.hourlyRate;
          break;
        case 'reviews':
          comparison = b.reviewCount - a.reviewCount;
          break;
        case 'experience':
          comparison = (b.experienceYears || 0) - (a.experienceYears || 0);
          break;
        case 'newest':
          comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          break;
        default:
          comparison = b.averageRating - a.averageRating;
      }

      return sortOrder === 'asc' ? -comparison : comparison;
    });

    // Pagination
    const totalCount = filteredTutors.length;
    const totalPages = Math.ceil(totalCount / limit);
    const skip = (page - 1) * limit;
    const paginatedTutors = filteredTutors.slice(skip, skip + limit);

    // Add simulated loading delay
    await new Promise(resolve => setTimeout(resolve, 200));

    return NextResponse.json({
      success: true,
      data: {
        tutors: paginatedTutors,
        filters: {
          subjects: Array.from(new Set(mockTutors.flatMap(t => t.subjects.map(s => s.toString())))),
          locations: Array.from(new Set(mockTutors.map(t => t.location?.city).filter(Boolean))),
          priceRange: [minPrice, maxPrice],
          teachingFormats: ['Online', 'InPerson', 'Both'],
          languages: Array.from(new Set(mockTutors.flatMap(t => t.languages)))
        },
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        },
        searchQuery: {
          query,
          subjects,
          priceRange: [minPrice, maxPrice],
          location,
          minRating,
          teachingFormats,
          languages,
          sortBy,
          sortOrder
        }
      }
    });

  } catch (error) {
    console.error('Error in demo tutors API:', error);
    return NextResponse.json(
      { success: false, error: 'Demo search failed' },
      { status: 500 }
    );
  }
}