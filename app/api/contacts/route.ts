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

    const contacts = await prisma.contact.findMany({
      include: {
        user: {
          select: {
            name: true,
            role: true,
          },
        },
        _count: {
          select: {
            activities: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only contributors can create contacts
    if (session.user.role !== 'CONTRIBUTOR') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { name, email, phone, company, position, linkedinUrl, leadStatus = 'COLD', notes, photo } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const contact = await prisma.contact.create({
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
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            name: true,
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

    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}