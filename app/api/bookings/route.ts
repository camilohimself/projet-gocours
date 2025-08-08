import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/app/lib/prisma';
import { BookingStatus } from '@/src/types';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as BookingStatus | null;
    const tutorId = searchParams.get('tutorId');
    const studentId = searchParams.get('studentId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.BookingWhereInput = {};
    if (status) where.status = status;
    if (tutorId) where.tutorId = tutorId;
    if (studentId) where.studentId = studentId;

    const [bookings, totalCount] = await Promise.all([
      prisma.booking.findMany({
        where,
        skip,
        take: limit,
        include: {
          student: {
            select: {
              id: true,
              displayName: true,
              photoUrl: true,
              email: true
            }
          },
          tutor: {
            select: {
              id: true,
              headline: true,
              hourlyRate: true,
              user: {
                select: {
                  displayName: true,
                  photoUrl: true
                }
              }
            }
          }
        },
        orderBy: {
          scheduledAt: 'desc'
        }
      }),
      prisma.booking.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      data: bookings,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { tutorId, subject, scheduledAt, duration, sessionNotes } = body;

    // Validate required fields
    if (!tutorId || !subject || !scheduledAt || !duration) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get user profile to get studentId
    const userProfile = await prisma.userProfile.findUnique({
      where: { clerkId: userId }
    });

    if (!userProfile) {
      return NextResponse.json(
        { success: false, error: 'User profile not found' },
        { status: 404 }
      );
    }

    // Get tutor to calculate price
    const tutor = await prisma.tutorProfile.findUnique({
      where: { id: tutorId }
    });

    if (!tutor) {
      return NextResponse.json(
        { success: false, error: 'Tutor not found' },
        { status: 404 }
      );
    }

    // Calculate total amount (duration in minutes)
    const totalAmount = (duration / 60) * tutor.hourlyRate;

    const booking = await prisma.booking.create({
      data: {
        studentId: userProfile.id,
        tutorId,
        subject,
        scheduledAt: new Date(scheduledAt),
        duration,
        totalAmount,
        sessionNotes,
        status: BookingStatus.PENDING
      },
      include: {
        student: {
          select: {
            displayName: true,
            photoUrl: true,
            email: true
          }
        },
        tutor: {
          select: {
            headline: true,
            user: {
              select: {
                displayName: true,
                photoUrl: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: booking,
      message: 'Booking created successfully'
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}