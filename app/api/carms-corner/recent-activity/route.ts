import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/prisma/client';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only viewers (Carm) should access this endpoint
    if (session.user.role !== 'VIEWER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch recent product mentions with activity details
    const recentMentions = await prisma.productMention.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        activity: {
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
            carmTasks: {
              select: {
                id: true,
                priority: true,
                status: true,
              },
            },
          },
        },
      },
    });

    // Transform the data for the frontend
    const transformedMentions = recentMentions.map(mention => ({
      id: mention.id,
      product: mention.product,
      mentionText: mention.mentionText,
      context: mention.context,
      createdAt: mention.createdAt,
      activity: {
        id: mention.activity.id,
        type: mention.activity.type,
        content: mention.activity.content,
        createdAt: mention.activity.createdAt,
        user: mention.activity.user,
        contact: mention.activity.contact,
        project: mention.activity.project,
      },
      urgency: getUrgencyLevel(mention),
      hasTask: mention.activity.carmTasks.length > 0,
      taskStatus: mention.activity.carmTasks[0]?.status || null,
    }));

    return NextResponse.json(transformedMentions);
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent activity' },
      { status: 500 }
    );
  }
}

// Helper function to determine urgency level
function getUrgencyLevel(mention: {
  activity: {
    content: string;
  };
  context?: string;
}): 'high' | 'medium' | 'low' {
  const content = mention.activity.content.toLowerCase();
  const context = mention.context?.toLowerCase() || '';
  
  // High priority keywords
  const highPriorityWords = [
    'urgent', 'critical', 'emergency', 'asap', 'immediately',
    'broken', 'down', 'error', 'bug', 'issue', 'problem',
    'help', 'stuck', 'blocker', 'failing'
  ];
  
  // Medium priority keywords  
  const mediumPriorityWords = [
    'question', 'need', 'should', 'could', 'request',
    'update', 'change', 'modify', 'improve'
  ];

  // Check high priority first
  if (highPriorityWords.some(word => 
    content.includes(word) || context.includes(word)
  )) {
    return 'high';
  }
  
  // Check medium priority
  if (mediumPriorityWords.some(word => 
    content.includes(word) || context.includes(word)
  )) {
    return 'medium';
  }
  
  return 'low';
}