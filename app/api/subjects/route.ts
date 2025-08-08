import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { SubjectService } from '@/src/lib/prisma-helpers';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    // Build where clause
    const where: any = {};
    if (category) {
      where.category = {
        equals: category,
        mode: 'insensitive'
      };
    }
    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          description: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ];
    }
    
    const subjects = await prisma.subject.findMany({
      where,
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ],
      include: {
        _count: {
          select: {
            tutors: true
          }
        }
      }
    });
    
    // Group subjects by category for better organization
    const subjectsByCategory = subjects.reduce((acc, subject) => {
      const category = subject.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push({
        ...subject,
        tutorCount: subject._count.tutors
      });
      return acc;
    }, {} as Record<string, any[]>);
    
    return NextResponse.json({
      success: true,
      data: {
        subjects,
        subjectsByCategory,
        totalCount: subjects.length
      },
      message: `Found ${subjects.length} subjects`
    });
    
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch subjects',
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
    
    // Check if user is admin (you might want to implement proper role-based access)
    const user = await prisma.userProfile.findUnique({
      where: { clerkId: userId }
    });
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        {
          success: false,
          error: 'Forbidden - Admin access required'
        },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    
    // Validate required fields
    const { name, category, description } = body;
    
    if (!name || !category) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: name, category'
        },
        { status: 400 }
      );
    }
    
    // Validate name format
    if (typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Subject name must be a non-empty string'
        },
        { status: 400 }
      );
    }
    
    // Check for existing subject
    const existingSubject = await prisma.subject.findUnique({
      where: { name: name.trim() }
    });
    
    if (existingSubject) {
      return NextResponse.json(
        {
          success: false,
          error: 'Subject already exists'
        },
        { status: 409 }
      );
    }
    
    // Create new subject
    const subject = await prisma.subject.create({
      data: {
        name: name.trim(),
        category: category.trim(),
        description: description?.trim() || null
      }
    });
    
    return NextResponse.json({
      success: true,
      data: subject,
      message: 'Subject created successfully'
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating subject:', error);
    
    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint failed')) {
        return NextResponse.json(
          {
            success: false,
            error: 'Subject with this name already exists'
          },
          { status: 409 }
        );
      }
    }
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create subject',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Additional endpoint for seeding initial subjects
export async function PUT(request: NextRequest) {
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
    
    // Check if user is admin
    const user = await prisma.userProfile.findUnique({
      where: { clerkId: userId }
    });
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        {
          success: false,
          error: 'Forbidden - Admin access required'
        },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    
    // Check if this is a seed request
    if (body.action === 'seed') {
      await SubjectService.seedSubjects();
      
      const subjects = await SubjectService.getAllSubjects();
      
      return NextResponse.json({
        success: true,
        data: subjects,
        message: 'Subjects seeded successfully'
      });
    }
    
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid action. Use action: "seed" to seed subjects'
      },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('Error seeding subjects:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to seed subjects',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}