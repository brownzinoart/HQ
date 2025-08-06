import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/prisma/client';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const contact = await prisma.contact.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            role: true,
          },
        },
        activities: {
          include: {
            user: {
              select: {
                name: true,
                role: true,
              },
            },
            project: {
              select: {
                title: true,
                status: true,
              },
            },
            resource: {
              select: {
                title: true,
                type: true,
                url: true,
              },
            },
            comments: {
              include: {
                user: {
                  select: {
                    name: true,
                    role: true,
                  },
                },
              },
              orderBy: {
                createdAt: 'desc',
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: {
            activities: true,
          },
        },
      },
    });

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    return NextResponse.json(contact);
  } catch (error) {
    console.error('Error fetching contact:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only contributors can update contacts
    if (session.user.role !== 'CONTRIBUTOR') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, email, phone, company, position, linkedinUrl, leadStatus, notes, photo } = body;

    const contact = await prisma.contact.update({
      where: {
        id,
      },
      data: {
        name,
        email,
        phone,
        company,
        position,
        linkedinUrl,
        leadStatus,
        notes,
        photo,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            role: true,
          },
        },
        _count: {
          select: {
            activities: true,
          },
        },
      },
    });

    return NextResponse.json(contact);
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only contributors can delete contacts
    if (session.user.role !== 'CONTRIBUTOR') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;

    await prisma.contact.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}