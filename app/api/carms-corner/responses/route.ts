import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/prisma/client';
import { UserRole } from '@prisma/client';

// GET /api/carms-corner/responses - Get responses with optional task filter
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');

    const where: Record<string, unknown> = {};
    if (taskId) {
      where.taskId = taskId;
    }

    const responses = await prisma.carmResponse.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        task: {
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(responses);
  } catch (error) {
    console.error('Error fetching responses:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/carms-corner/responses - Create a response to a task
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only viewers (Carm) can respond to tasks, or contributors can update their own tasks
    const body = await request.json();
    const { taskId, content, status, notes } = body;

    if (!taskId || !status) {
      return NextResponse.json({ 
        error: 'Task ID and status are required' 
      }, { status: 400 });
    }

    // Verify the task exists
    const task = await prisma.carmTask.findUnique({
      where: { id: taskId },
      include: { user: true },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Check permissions - viewers can respond to any task, contributors can only respond to their own
    if (session.user.role === UserRole.CONTRIBUTOR && task.userId !== session.user.id) {
      return NextResponse.json({ 
        error: 'Contributors can only respond to their own tasks' 
      }, { status: 403 });
    }

    const response = await prisma.carmResponse.create({
      data: {
        content: content || null,
        status,
        notes: notes || null,
        taskId,
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        task: {
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

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating response:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}