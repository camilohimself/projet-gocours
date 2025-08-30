import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/app/lib/prisma';
import { BookingStatus } from '@/src/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const booking = await prisma.booking.findUnique({
      where: { id: resolvedParams.id },
      include: {
        student: {
          select: {
            id: true,
            clerkId: true,
            displayName: true,
            photoUrl: true,
            email: true
          }
        },
        tutor: {
          include: {
            user: {
              select: {
                id: true,
                clerkId: true,
                displayName: true,
                photoUrl: true
              }
            }
          }
        }
      }
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Check if user is authorized to view this booking
    const userProfile = await prisma.userProfile.findUnique({
      where: { clerkId: userId }
    });

    if (!userProfile) {
      return NextResponse.json(
        { success: false, error: 'User profile not found' },
        { status: 404 }
      );
    }

    const isStudent = booking.studentId === userProfile.id;
    const isTutor = booking.tutor.user.clerkId === userId;

    if (!isStudent && !isTutor) {
      return NextResponse.json(
        { success: false, error: 'Not authorized to view this booking' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: booking
    });

  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { status, sessionNotes }: { status?: BookingStatus; sessionNotes?: string } = body;

    const resolvedParams = await params;
    const booking = await prisma.booking.findUnique({
      where: { id: resolvedParams.id },
      include: {
        tutor: {
          include: {
            user: true
          }
        },
        student: true
      }
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Get user profile
    const userProfile = await prisma.userProfile.findUnique({
      where: { clerkId: userId }
    });

    if (!userProfile) {
      return NextResponse.json(
        { success: false, error: 'User profile not found' },
        { status: 404 }
      );
    }

    const isStudent = booking.studentId === userProfile.id;
    const isTutor = booking.tutor.user.clerkId === userId;

    if (!isStudent && !isTutor) {
      return NextResponse.json(
        { success: false, error: 'Not authorized to modify this booking' },
        { status: 403 }
      );
    }

    // Business logic for status changes
    const updates: { status?: BookingStatus; sessionNotes?: string } = {};
    
    if (status) {
      // Validate status transitions
      const validTransitions: Record<BookingStatus, BookingStatus[]> = {
        [BookingStatus.PENDING]: [BookingStatus.CONFIRMED, BookingStatus.CANCELLED],
        [BookingStatus.CONFIRMED]: [BookingStatus.COMPLETED, BookingStatus.CANCELLED, BookingStatus.NO_SHOW],
        [BookingStatus.COMPLETED]: [], // Cannot change completed bookings
        [BookingStatus.CANCELLED]: [], // Cannot change cancelled bookings
        [BookingStatus.NO_SHOW]: []   // Cannot change no-show bookings
      };

      if (!validTransitions[booking.status].includes(status)) {
        return NextResponse.json(
          { success: false, error: `Invalid status transition from ${booking.status} to ${status}` },
          { status: 400 }
        );
      }

      // Only tutors can confirm bookings
      if (status === BookingStatus.CONFIRMED && !isTutor) {
        return NextResponse.json(
          { success: false, error: 'Only tutors can confirm bookings' },
          { status: 403 }
        );
      }

      updates.status = status;
    }

    if (sessionNotes !== undefined) {
      updates.sessionNotes = sessionNotes;
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: resolvedParams.id },
      data: updates,
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
      data: updatedBooking,
      message: 'Booking updated successfully'
    });

  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const booking = await prisma.booking.findUnique({
      where: { id: resolvedParams.id },
      include: {
        tutor: {
          include: {
            user: true
          }
        }
      }
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Get user profile
    const userProfile = await prisma.userProfile.findUnique({
      where: { clerkId: userId }
    });

    if (!userProfile) {
      return NextResponse.json(
        { success: false, error: 'User profile not found' },
        { status: 404 }
      );
    }

    const isStudent = booking.studentId === userProfile.id;
    const isTutor = booking.tutor.user.clerkId === userId;

    if (!isStudent && !isTutor) {
      return NextResponse.json(
        { success: false, error: 'Not authorized to delete this booking' },
        { status: 403 }
      );
    }

    // Only allow deletion of pending bookings
    if (booking.status !== BookingStatus.PENDING) {
      return NextResponse.json(
        { success: false, error: 'Can only delete pending bookings' },
        { status: 400 }
      );
    }

    await prisma.booking.delete({
      where: { id: resolvedParams.id }
    });

    return NextResponse.json({
      success: true,
      message: 'Booking deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}