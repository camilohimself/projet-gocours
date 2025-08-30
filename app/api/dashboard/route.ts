import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '../../lib/prisma';
import { BookingStatus, Role } from '../../../src/types';

interface DashboardData {
  user: {
    id: string;
    clerkId: string;
    displayName: string | null;
    email: string | null;
    photoUrl?: string | null;
    role: string;
    createdAt: Date;
  };
  [key: string]: unknown;
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user profile
    const userProfile = await prisma.userProfile.findUnique({
      where: { clerkId: userId },
      include: {
        tutorProfile: true,
        studentProfile: true
      }
    });

    if (!userProfile) {
      return NextResponse.json(
        { success: false, error: 'User profile not found' },
        { status: 404 }
      );
    }

    let dashboardData: DashboardData = {
      user: {
        id: userProfile.id,
        clerkId: userProfile.clerkId,
        displayName: userProfile.displayName,
        email: userProfile.email,
        photoUrl: userProfile.photoUrl,
        role: userProfile.role,
        createdAt: userProfile.createdAt
      }
    };

    if (userProfile.role === Role.tutor && userProfile.tutorProfile) {
      // Tutor dashboard data
      const [
        recentBookings,
        bookingStats,
        recentReviews,
        monthlyEarnings,
        totalStudents
      ] = await Promise.all([
        // Recent bookings
        prisma.booking.findMany({
          where: { tutorId: userProfile.tutorProfile.id },
          take: 5,
          include: {
            student: {
              select: {
                displayName: true,
                photoUrl: true
              }
            }
          },
          orderBy: { scheduledAt: 'desc' }
        }),

        // Booking statistics
        prisma.booking.groupBy({
          by: ['status'],
          where: { tutorId: userProfile.tutorProfile.id },
          _count: { id: true }
        }),

        // Recent reviews
        prisma.review.findMany({
          where: { tutorId: userProfile.tutorProfile.id },
          take: 5,
          include: {
            author: {
              select: {
                displayName: true,
                photoUrl: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }),

        // Monthly earnings
        prisma.booking.aggregate({
          where: {
            tutorId: userProfile.tutorProfile.id,
            status: BookingStatus.COMPLETED,
            scheduledAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            }
          },
          _sum: { totalAmount: true },
          _count: { id: true }
        }),

        // Total unique students
        prisma.booking.findMany({
          where: {
            tutorId: userProfile.tutorProfile.id,
            status: BookingStatus.COMPLETED
          },
          select: { studentId: true },
          distinct: ['studentId']
        })
      ]);

      // Format booking stats
      const formattedBookingStats = bookingStats.reduce((acc, stat) => {
        acc[stat.status.toLowerCase()] = stat._count.id;
        return acc;
      }, {} as Record<string, number>);

      dashboardData.tutorData = {
        profile: userProfile.tutorProfile,
        recentBookings,
        bookingStats: {
          total: bookingStats.reduce((sum, stat) => sum + stat._count.id, 0),
          pending: formattedBookingStats.pending || 0,
          confirmed: formattedBookingStats.confirmed || 0,
          completed: formattedBookingStats.completed || 0,
          cancelled: formattedBookingStats.cancelled || 0
        },
        recentReviews,
        monthlyEarnings: {
          amount: monthlyEarnings._sum.totalAmount || 0,
          sessions: monthlyEarnings._count || 0
        },
        totalStudents: totalStudents.length,
        upcomingBookings: await prisma.booking.count({
          where: {
            tutorId: userProfile.tutorProfile.id,
            status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
            scheduledAt: { gte: new Date() }
          }
        })
      };

    } else if (userProfile.role === Role.student) {
      // Student dashboard data
      const [
        recentBookings,
        favorites,
        bookingStats,
        upcomingSessions,
        completedSessions
      ] = await Promise.all([
        // Recent bookings
        prisma.booking.findMany({
          where: { studentId: userProfile.id },
          take: 5,
          include: {
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
          orderBy: { scheduledAt: 'desc' }
        }),

        // Favorites
        prisma.favorite.findMany({
          where: { userId: userProfile.id },
          take: 10,
          include: {
            tutor: {
              select: {
                id: true,
                headline: true,
                averageRating: true,
                reviewCount: true,
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
          orderBy: { createdAt: 'desc' }
        }),

        // Booking statistics
        prisma.booking.groupBy({
          by: ['status'],
          where: { studentId: userProfile.id },
          _count: { id: true }
        }),

        // Upcoming sessions
        prisma.booking.count({
          where: {
            studentId: userProfile.id,
            status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
            scheduledAt: { gte: new Date() }
          }
        }),

        // Completed sessions
        prisma.booking.count({
          where: {
            studentId: userProfile.id,
            status: BookingStatus.COMPLETED
          }
        })
      ]);

      // Format booking stats
      const formattedBookingStats = bookingStats.reduce((acc, stat) => {
        acc[stat.status.toLowerCase()] = stat._count.id;
        return acc;
      }, {} as Record<string, number>);

      dashboardData.studentData = {
        recentBookings,
        favorites,
        bookingStats: {
          total: bookingStats.reduce((sum, stat) => sum + stat._count.id, 0),
          pending: formattedBookingStats.pending || 0,
          confirmed: formattedBookingStats.confirmed || 0,
          completed: formattedBookingStats.completed || 0,
          cancelled: formattedBookingStats.cancelled || 0
        },
        upcomingSessions,
        completedSessions,
        favoriteCount: favorites.length
      };
    }

    return NextResponse.json({
      success: true,
      data: dashboardData
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update user profile
export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { displayName, email, photoUrl } = body;

    const updatedProfile = await prisma.userProfile.update({
      where: { clerkId: userId },
      data: {
        ...(displayName && { displayName }),
        ...(email && { email }),
        ...(photoUrl && { photoUrl })
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedProfile,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}