import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: NextRequest) {
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
    
    // Get user profile
    const user = await prisma.userProfile.findUnique({
      where: { clerkId: userId }
    });
    
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'User profile not found'
        },
        { status: 404 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Fetch user's favorites with pagination
    const [favorites, totalCount] = await Promise.all([
      prisma.favorite.findMany({
        where: { userId: user.id },
        include: {
          tutor: {
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
              _count: {
                select: {
                  reviews: true,
                  bookings: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.favorite.count({
        where: { userId: user.id }
      })
    ]);
    
    return NextResponse.json({
      success: true,
      data: {
        favorites,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
          hasNext: page * limit < totalCount,
          hasPrev: page > 1
        }
      },
      message: `Found ${totalCount} favorites`
    });
    
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch favorites',
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
    
    // Get user profile
    const user = await prisma.userProfile.findUnique({
      where: { clerkId: userId }
    });
    
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'User profile not found'
        },
        { status: 404 }
      );
    }
    
    const body = await request.json();
    const { tutorId, action } = body;
    
    if (!tutorId) {
      return NextResponse.json(
        {
          success: false,
          error: 'tutorId is required'
        },
        { status: 400 }
      );
    }
    
    if (!action || !['add', 'remove', 'toggle'].includes(action)) {
      return NextResponse.json(
        {
          success: false,
          error: 'action must be one of: add, remove, toggle'
        },
        { status: 400 }
      );
    }
    
    // Verify tutor exists
    const tutor = await prisma.tutorProfile.findUnique({
      where: { id: tutorId },
      include: {
        user: {
          select: {
            displayName: true,
            photoUrl: true
          }
        }
      }
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
    
    // Check if user is trying to favorite themselves
    if (tutor.userId === user.id) {
      return NextResponse.json(
        {
          success: false,
          error: 'You cannot favorite your own tutor profile'
        },
        { status: 400 }
      );
    }
    
    // Check existing favorite
    const existingFavorite = await prisma.favorite.findFirst({
      where: {
        userId: user.id,
        tutorId: tutorId
      }
    });
    
    let result;
    let message;
    
    if (action === 'add') {
      if (existingFavorite) {
        return NextResponse.json(
          {
            success: false,
            error: 'Tutor is already in favorites'
          },
          { status: 409 }
        );
      }
      
      result = await prisma.favorite.create({
        data: {
          userId: user.id,
          tutorId: tutorId
        },
        include: {
          tutor: {
            include: {
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
      
      message = 'Tutor added to favorites';
      
    } else if (action === 'remove') {
      if (!existingFavorite) {
        return NextResponse.json(
          {
            success: false,
            error: 'Tutor is not in favorites'
          },
          { status: 404 }
        );
      }
      
      await prisma.favorite.deleteMany({
        where: {
          userId: user.id,
          tutorId: tutorId
        }
      });
      
      result = { removed: true, tutorId };
      message = 'Tutor removed from favorites';
      
    } else { // action === 'toggle'
      if (existingFavorite) {
        // Remove favorite
        await prisma.favorite.deleteMany({
          where: {
            userId: user.id,
            tutorId: tutorId
          }
        });
        
        result = { removed: true, tutorId };
        message = 'Tutor removed from favorites';
        
      } else {
        // Add favorite
        result = await prisma.favorite.create({
          data: {
            userId: user.id,
            tutorId: tutorId
          },
          include: {
            tutor: {
              include: {
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
        
        message = 'Tutor added to favorites';
      }
    }
    
    return NextResponse.json({
      success: true,
      data: result,
      message
    }, { status: action === 'add' || (action === 'toggle' && !existingFavorite) ? 201 : 200 });
    
  } catch (error) {
    console.error('Error managing favorites:', error);
    
    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint failed')) {
        return NextResponse.json(
          {
            success: false,
            error: 'Tutor is already in favorites'
          },
          { status: 409 }
        );
      }
    }
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to manage favorites',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE endpoint for removing a specific favorite by ID
export async function DELETE(request: NextRequest) {
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
    
    const { searchParams } = new URL(request.url);
    const favoriteId = searchParams.get('favoriteId');
    const tutorId = searchParams.get('tutorId');
    
    if (!favoriteId && !tutorId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Either favoriteId or tutorId is required'
        },
        { status: 400 }
      );
    }
    
    // Get user profile
    const user = await prisma.userProfile.findUnique({
      where: { clerkId: userId }
    });
    
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'User profile not found'
        },
        { status: 404 }
      );
    }
    
    let whereClause;
    if (favoriteId) {
      whereClause = {
        id: favoriteId,
        userId: user.id // Ensure user can only delete their own favorites
      };
    } else {
      whereClause = {
        userId: user.id,
        tutorId: tutorId!
      };
    }
    
    // Check if favorite exists
    const favorite = await prisma.favorite.findFirst({
      where: whereClause
    });
    
    if (!favorite) {
      return NextResponse.json(
        {
          success: false,
          error: 'Favorite not found'
        },
        { status: 404 }
      );
    }
    
    // Delete the favorite
    await prisma.favorite.delete({
      where: { id: favorite.id }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Favorite removed successfully'
    });
    
  } catch (error) {
    console.error('Error deleting favorite:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete favorite',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}