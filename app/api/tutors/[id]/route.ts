import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/app/lib/prisma';
import { TutorService } from '@/src/lib/prisma-helpers';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tutorId = params.id;
    
    if (!tutorId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Tutor ID is required'
        },
        { status: 400 }
      );
    }
    
    const tutor = await TutorService.findTutorById(tutorId);
    
    if (!tutor) {
      return NextResponse.json(
        {
          success: false,
          error: 'Tutor not found'
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: tutor,
      message: 'Tutor retrieved successfully'
    });
    
  } catch (error) {
    console.error('Error fetching tutor:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch tutor',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    const tutorId = params.id;
    const body = await request.json();
    
    if (!tutorId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Tutor ID is required'
        },
        { status: 400 }
      );
    }
    
    // Check if tutor exists and belongs to current user
    const existingTutor = await prisma.tutorProfile.findUnique({
      where: { id: tutorId },
      include: { user: true }
    });
    
    if (!existingTutor) {
      return NextResponse.json(
        {
          success: false,
          error: 'Tutor profile not found'
        },
        { status: 404 }
      );
    }
    
    if (existingTutor.user.clerkId !== userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Forbidden - You can only update your own tutor profile'
        },
        { status: 403 }
      );
    }
    
    // Validate data if provided
    if (body.hourlyRate && (typeof body.hourlyRate !== 'number' || body.hourlyRate <= 0)) {
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
    
    // Update tutor profile
    const updatedTutor = await prisma.tutorProfile.update({
      where: { id: tutorId },
      data: {
        ...(body.headline && { headline: body.headline }),
        ...(body.bio && { bio: body.bio }),
        ...(body.teachingLevels && { teachingLevels: body.teachingLevels }),
        ...(body.languages && { languages: body.languages }),
        ...(body.hourlyRate && { hourlyRate: body.hourlyRate }),
        ...(body.teachingFormats && { teachingFormats: body.teachingFormats }),
        ...(body.location && {
          locationCity: body.location.city,
          locationLat: body.location.lat,
          locationLng: body.location.lng
        }),
        ...(body.qualifications && { qualifications: body.qualifications }),
        ...(body.experienceYears !== undefined && { experienceYears: body.experienceYears }),
        ...(body.responseTime && { responseTime: body.responseTime })
      },
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
      }
    });
    
    return NextResponse.json({
      success: true,
      data: TutorService['mapPrismaTutorToTutorProfile'](updatedTutor),
      message: 'Tutor profile updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating tutor profile:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update tutor profile',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    const tutorId = params.id;
    
    if (!tutorId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Tutor ID is required'
        },
        { status: 400 }
      );
    }
    
    // Check if tutor exists and belongs to current user
    const existingTutor = await prisma.tutorProfile.findUnique({
      where: { id: tutorId },
      include: { user: true }
    });
    
    if (!existingTutor) {
      return NextResponse.json(
        {
          success: false,
          error: 'Tutor profile not found'
        },
        { status: 404 }
      );
    }
    
    if (existingTutor.user.clerkId !== userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Forbidden - You can only delete your own tutor profile'
        },
        { status: 403 }
      );
    }
    
    // Check for active bookings
    const activeBookings = await prisma.booking.count({
      where: {
        tutorId: tutorId,
        status: {
          in: ['PENDING', 'CONFIRMED']
        }
      }
    });
    
    if (activeBookings > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot delete tutor profile with active bookings'
        },
        { status: 409 }
      );
    }
    
    // Delete tutor profile (cascade will handle related records)
    await prisma.tutorProfile.delete({
      where: { id: tutorId }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Tutor profile deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting tutor profile:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete tutor profile',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}