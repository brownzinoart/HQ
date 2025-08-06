import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/prisma/client';

// GET /api/carms-corner/mentions - Get product mentions with optional product filter
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const product = searchParams.get('product');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: Record<string, unknown> = {};
    if (product) {
      where.product = product;
    }

    const mentions = await prisma.productMention.findMany({
      where,
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
      take: limit,
    });

    return NextResponse.json(mentions);
  } catch (error) {
    console.error('Error fetching mentions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/carms-corner/mentions - Create a product mention (usually called automatically)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { activityId, product, mentionText, context } = body;

    if (!activityId || !product || !mentionText) {
      return NextResponse.json({ 
        error: 'Activity ID, product, and mention text are required' 
      }, { status: 400 });
    }

    // Verify the activity exists and belongs to the user or is viewable
    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
      include: { user: true },
    });

    if (!activity) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
    }

    // Check if mention already exists for this activity and product
    const existingMention = await prisma.productMention.findFirst({
      where: {
        activityId,
        product,
        mentionText,
      },
    });

    if (existingMention) {
      return NextResponse.json(existingMention);
    }

    const mention = await prisma.productMention.create({
      data: {
        product,
        mentionText,
        context: context || null,
        activityId,
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
          },
        },
      },
    });

    return NextResponse.json(mention, { status: 201 });
  } catch (error) {
    console.error('Error creating mention:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

