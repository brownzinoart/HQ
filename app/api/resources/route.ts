import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const product = searchParams.get('product');
    const type = searchParams.get('type');
    const search = searchParams.get('search');
    const tags = searchParams.get('tags');

    // Build where clause
    const where: any = {};

    // Filter by product if specified
    if (product && product !== 'ALL') {
      if (product === 'GENERAL') {
        where.product = null;
      } else {
        where.product = product;
      }
    }

    // Filter by type if specified
    if (type && type !== 'ALL') {
      where.type = type;
    }

    // Search in title and description
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Filter by tags (this would need more complex logic for JSON search)
    // For now, we'll implement basic tag filtering client-side

    const resources = await prisma.resource.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            role: true
          }
        },
        _count: {
          select: {
            activities: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    // Client-side tag filtering if needed
    let filteredResources = resources;
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim().toLowerCase());
      filteredResources = resources.filter(resource => {
        if (!resource.tags) return false;
        const resourceTags = Array.isArray(resource.tags) 
          ? resource.tags.map((tag: string) => tag.toLowerCase())
          : [];
        return tagArray.some(tag => resourceTags.includes(tag));
      });
    }

    return NextResponse.json(filteredResources);
  } catch (error) {
    console.error('Error fetching resources:', error);
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

    // Only contributors can create resources
    if (session.user.role !== 'CONTRIBUTOR') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      description,
      type,
      product,
      url,
      filePath,
      fileName,
      fileSize,
      mimeType,
      version,
      tags,
      isPublic
    } = body;

    if (!title || !type) {
      return NextResponse.json(
        { error: 'Title and type are required' },
        { status: 400 }
      );
    }

    const resource = await prisma.resource.create({
      data: {
        title,
        description,
        type,
        product: product || null,
        url: url || null,
        filePath: filePath || null,
        fileName: fileName || null,
        fileSize: fileSize || null,
        mimeType: mimeType || null,
        version: version || null,
        tags: tags || null,
        isPublic: isPublic !== undefined ? isPublic : true,
        userId: session.user.id
      },
      include: {
        user: {
          select: {
            name: true,
            role: true
          }
        },
        _count: {
          select: {
            activities: true
          }
        }
      }
    });

    return NextResponse.json(resource, { status: 201 });
  } catch (error) {
    console.error('Error creating resource:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}