import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/prisma/client';
import { NextRequest } from 'next/server';
import { detectProductMentions } from '@/lib/utils/productMentions';
import { Product } from '@prisma/client';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const activities = await prisma.activity.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        contact: {
          select: {
            id: true,
            name: true,
            company: true,
            leadStatus: true,
          },
        },
        project: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
        comments: {
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
      take: 20,
    });

    return NextResponse.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only contributors can create activities
    if (session.user.role !== 'CONTRIBUTOR') {
      return NextResponse.json({ error: 'Only contributors can create activities' }, { status: 403 });
    }

    const body = await request.json();
    const { content, type = 'GENERAL', contactId, projectId, metadata } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    // Create the activity
    const activity = await prisma.activity.create({
      data: {
        content: content.trim(),
        type,
        userId: session.user.id,
        contactId: contactId || null,
        projectId: projectId || null,
        metadata: metadata || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        contact: {
          select: {
            id: true,
            name: true,
            company: true,
            leadStatus: true,
          },
        },
        project: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
        comments: {
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

    // Automatically detect and create product mentions
    try {
      const mentions = detectProductMentions(activity.content);
      if (mentions.length > 0) {
        // Create product mention records
        await Promise.all(
          mentions.map(mention =>
            prisma.productMention.create({
              data: {
                product: mention.product as Product,
                mentionText: mention.mentionText,
                context: mention.context,
                activityId: activity.id,
              },
            })
          )
        );
      }
    } catch (mentionError) {
      // Log error but don't fail the activity creation
      console.error('Error creating product mentions:', mentionError);
    }

    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    console.error('Error creating activity:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}