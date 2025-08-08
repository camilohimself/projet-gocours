import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const tutorId = searchParams.get('tutorId');
    const authorId = searchParams.get('authorId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Build where clause
    const where: any = {};
    if (tutorId) where.tutorId = tutorId;
    if (authorId) where.authorId = authorId;
    
    // Fetch reviews with pagination
    const [reviews, totalCount] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              displayName: true,
              photoUrl: true
            }
          },
          recipient: {
            select: {
              id: true,
              displayName: true,
              photoUrl: true
            }
          },
          tutor: {
            select: {
              id: true,
              headline: true,
              user: {
                select: {
                  displayName: true,
                  photoUrl: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.review.count({ where })
    ]);
    
    return NextResponse.json({
      success: true,
      data: {
        reviews,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
          hasNext: page * limit < totalCount,
          hasPrev: page > 1
        }
      },
      message: `Found ${totalCount} reviews`
    });
    
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch reviews',
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
    const { rating, tutorId, recipientId, comment } = body;
    
    if (!rating || !tutorId || !recipientId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: rating, tutorId, recipientId'
        },
        { status: 400 }
      );
    }
    
    // Validate rating range
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rating must be a number between 1 and 5'
        },
        { status: 400 }
      );
    }
    
    // Get author's user profile
    const author = await prisma.userProfile.findUnique({
      where: { clerkId: userId }
    });
    
    if (!author) {
      return NextResponse.json(
        {
          success: false,
          error: 'User profile not found'
        },
        { status: 404 }
      );
    }
    
    // Verify tutor exists
    const tutor = await prisma.tutorProfile.findUnique({
      where: { id: tutorId }
    });
    
    if (!tutor) {
      return NextResponse.json(
        {
          success: false,
          error: 'Tutor not found'
        },
        { status: 404 }
      );
    }
    
    // Verify recipient exists
    const recipient = await prisma.userProfile.findUnique({
      where: { id: recipientId }
    });
    
    if (!recipient) {
      return NextResponse.json(
        {
          success: false,
          error: 'Recipient not found'
        },
        { status: 404 }
      );
    }
    
    // Check if user is trying to review themselves
    if (author.id === recipientId) {
      return NextResponse.json(
        {
          success: false,
          error: 'You cannot review yourself'
        },
        { status: 400 }
      );
    }
    
    // Check for existing review from this author to this tutor
    const existingReview = await prisma.review.findFirst({
      where: {
        authorId: author.id,
        tutorId: tutorId
      }
    });
    
    if (existingReview) {
      return NextResponse.json(
        {
          success: false,
          error: 'You have already reviewed this tutor'
        },
        { status: 409 }
      );
    }
    
    // Create the review
    const review = await prisma.review.create({
      data: {
        rating,
        comment: comment || null,
        authorId: author.id,
        recipientId,
        tutorId
      },
      include: {
        author: {
          select: {
            id: true,
            displayName: true,
            photoUrl: true
          }
        },
        recipient: {
          select: {
            id: true,
            displayName: true,
            photoUrl: true
          }
        },
        tutor: {
          select: {
            id: true,
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
    
    // Update tutor's average rating and review count
    const reviewStats = await prisma.review.aggregate({
      where: { tutorId },
      _avg: { rating: true },
      _count: { id: true }
    });
    
    await prisma.tutorProfile.update({
      where: { id: tutorId },
      data: {
        averageRating: reviewStats._avg.rating || 0,
        reviewCount: reviewStats._count.id
      }
    });
    
    return NextResponse.json({
      success: true,
      data: review,
      message: 'Review created successfully'
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create review',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}