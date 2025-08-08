import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { TutorService } from '@/src/lib/prisma-helpers';
import type { TutorSearchFilters, Subject } from '@/src/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse search parameters for filters
    const filters: TutorSearchFilters = {};
    
    // Subjects filter
    const subjectsParam = searchParams.get('subjects');
    if (subjectsParam) {
      filters.subjects = subjectsParam.split(',') as Subject[];
    }
    
    // Price range filter
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    if (minPrice && maxPrice) {
      filters.priceRange = [parseFloat(minPrice), parseFloat(maxPrice)];
    }
    
    // Location filter
    const location = searchParams.get('location');
    if (location) {
      filters.location = location;
    }
    
    // Teaching formats filter
    const formatsParam = searchParams.get('teachingFormats');
    if (formatsParam) {
      filters.teachingFormats = formatsParam.split(',');
    }
    
    // Rating filter
    const rating = searchParams.get('rating');
    if (rating) {
      filters.rating = parseFloat(rating);
    }
    
    // Availability filter
    const availabilityDay = searchParams.get('availabilityDay');
    const availabilityTime = searchParams.get('availabilityTime');
    if (availabilityDay && availabilityTime) {
      filters.availability = {
        day: availabilityDay,
        time: availabilityTime
      };
    }
    
    const result = await TutorService.findTutors(filters);
    
    return NextResponse.json({
      success: true,
      data: result,
      message: `Found ${result.totalCount} tutors`
    });
    
  } catch (error) {
    console.error('Error fetching tutors:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch tutors',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized - Please sign in'
        },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['headline', 'bio', 'hourlyRate'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          missingFields
        },
        { status: 400 }
      );
    }
    
    // Validate data types and ranges
    if (typeof body.hourlyRate !== 'number' || body.hourlyRate <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Hourly rate must be a positive number'
        },
        { status: 400 }
      );
    }
    
    if (body.experienceYears && (typeof body.experienceYears !== 'number' || body.experienceYears < 0)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Experience years must be a non-negative number'
        },
        { status: 400 }
      );
    }
    
    const tutorProfile = await TutorService.createTutorProfile(userId, body);
    
    return NextResponse.json({
      success: true,
      data: tutorProfile,
      message: 'Tutor profile created successfully'
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating tutor profile:', error);
    
    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint failed')) {
        return NextResponse.json(
          {
            success: false,
            error: 'A tutor profile already exists for this user'
          },
          { status: 409 }
        );
      }
    }
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create tutor profile',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}