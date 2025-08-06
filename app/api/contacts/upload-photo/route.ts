import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import crypto from 'crypto';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only contributors can upload photos
    if (session.user.role !== 'CONTRIBUTOR') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' 
      }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 5MB.' 
      }, { status: 400 });
    }

    // Generate unique filename
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create filename with hash to prevent conflicts
    const hash = crypto.createHash('md5').update(buffer).digest('hex');
    const extension = file.name.split('.').pop() || 'jpg';
    const filename = `${hash}.${extension}`;
    
    // Save file to public/uploads/contacts
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'contacts');
    const filePath = join(uploadDir, filename);
    
    await writeFile(filePath, buffer);
    
    // Return the public URL path
    const publicPath = `/uploads/contacts/${filename}`;
    
    return NextResponse.json({ 
      success: true, 
      filePath: publicPath,
      filename: filename
    });

  } catch (error) {
    console.error('Error uploading photo:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}