import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/prisma/client';
import { UserRole } from '@prisma/client';

// GET /api/carms-corner/tasks - Get all tasks with optional product filter
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const product = searchParams.get('product');
    const status = searchParams.get('status'); // For filtering by response status

    const where: Record<string, unknown> = {};
    if (product) {
      where.product = product;
    }

    // If filtering by status, we need to include response information
    const includeResponses = {
      responses: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc' as const,
        },
      },
    };

    let tasks = await prisma.carmTask.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        activity: {
          select: {
            id: true,
            content: true,
            type: true,
          },
        },
        ...includeResponses,
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    // Filter by response status if requested
    if (status) {
      tasks = tasks.filter(task => {
        if (status === 'PENDING') {
          return task.responses.length === 0 || 
                 task.responses.some(r => r.status === 'PENDING');
        }
        return task.responses.some(r => r.status === status);
      });
    }

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/carms-corner/tasks - Create a new task
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only contributors can create tasks
    if (session.user.role !== UserRole.CONTRIBUTOR) {
      return NextResponse.json({ error: 'Only contributors can create tasks' }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, product, priority, dueDate, activityId } = body;

    if (!title || !description || !product) {
      return NextResponse.json({ 
        error: 'Title, description, and product are required' 
      }, { status: 400 });
    }

    const task = await prisma.carmTask.create({
      data: {
        title,
        description,
        product,
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null,
        userId: session.user.id,
        activityId: activityId || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        activity: {
          select: {
            id: true,
            content: true,
            type: true,
          },
        },
        responses: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}