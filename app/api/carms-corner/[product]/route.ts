import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/prisma/client';
import { PRODUCTS } from '@/lib/constants';
import { Product } from '@prisma/client';

interface ProductData {
  product: string;
  config: typeof PRODUCTS[keyof typeof PRODUCTS];
  tasks: unknown[];
  mentions: unknown[];
  summary: {
    totalTasks: number;
    pendingTasks: number;
    completedTasks: number;
    recentMentions: number;
    lastActivity: string | null;
  };
}

// GET /api/carms-corner/[product] - Get all data for a specific product
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ product: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { product } = await context.params;
    const productUpper = product.toUpperCase();

    // Validate product exists
    if (!PRODUCTS[productUpper as keyof typeof PRODUCTS]) {
      return NextResponse.json({ error: 'Invalid product' }, { status: 400 });
    }

    const productConfig = PRODUCTS[productUpper as keyof typeof PRODUCTS];

    // Fetch tasks for this product
    const tasks = await prisma.carmTask.findMany({
      where: {
        product: productUpper as Product,
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
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    // Fetch mentions for this product
    const mentions = await prisma.productMention.findMany({
      where: {
        product: productUpper as Product,
      },
      include: {
        activity: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            contact: {
              select: {
                id: true,
                name: true,
                company: true,
              },
            },
            project: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // Limit to recent mentions
    });

    // Calculate summary statistics
    const totalTasks = tasks.length;
    const pendingTasks = tasks.filter(task => 
      task.responses.length === 0 || 
      task.responses.some(r => r.status === 'PENDING')
    ).length;
    const completedTasks = tasks.filter(task => 
      task.responses.some(r => r.status === 'APPROVED')
    ).length;

    // Get recent mentions (within last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recentMentions = mentions.filter(m => 
      new Date(m.createdAt) > weekAgo
    ).length;

    // Find last activity timestamp
    const lastActivityFromMentions = mentions.length > 0 ? mentions[0].createdAt : null;
    const lastActivityFromTasks = tasks.length > 0 ? tasks[0].createdAt : null;
    
    let lastActivity = null;
    if (lastActivityFromMentions && lastActivityFromTasks) {
      lastActivity = new Date(lastActivityFromMentions) > new Date(lastActivityFromTasks) 
        ? lastActivityFromMentions 
        : lastActivityFromTasks;
    } else {
      lastActivity = lastActivityFromMentions || lastActivityFromTasks;
    }

    const productData: ProductData = {
      product: productUpper,
      config: productConfig,
      tasks,
      mentions,
      summary: {
        totalTasks,
        pendingTasks,
        completedTasks,
        recentMentions,
        lastActivity: lastActivity?.toISOString() || null,
      },
    };

    return NextResponse.json(productData);
  } catch (error) {
    console.error('Error fetching product data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}