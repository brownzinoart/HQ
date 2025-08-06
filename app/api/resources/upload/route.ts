import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import crypto from 'crypto';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB for resources
const ALLOWED_TYPES = [
  'image/jpeg', 'image/png', 'image/webp', 'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'application/zip',
  'video/mp4', 'video/webm',
  'audio/mpeg', 'audio/wav'
];

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only contributors can upload resources
    if (session.user.role !== 'CONTRIBUTOR') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const type = formData.get('type') as string;
    const product = formData.get('product') as string;
    const version = formData.get('version') as string;
    const tags = formData.get('tags') as string;

    if (!file || !title || !type) {
      return NextResponse.json({ 
        error: 'File, title, and type are required' 
      }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Please check allowed file types.' 
      }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 50MB.' 
      }, { status: 400 });
    }

    // Generate unique filename
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create filename with hash to prevent conflicts
    const hash = crypto.createHash('md5').update(buffer).digest('hex');
    const extension = file.name.split('.').pop() || 'bin';
    const filename = `${hash}.${extension}`;
    
    // Create upload directory structure
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'resources');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }
    
    const filePath = join(uploadDir, filename);
    await writeFile(filePath, buffer);
    
    // Parse tags if provided
    let parsedTags = null;
    if (tags) {
      try {
        parsedTags = JSON.parse(tags);
      } catch {
        // If not JSON, split by comma
        parsedTags = tags.split(',').map(tag => tag.trim()).filter(Boolean);
      }
    }

    // Return metadata for database storage
    const resourceData = {
      title,
      description: description || null,
      type,
      product: product || null,
      filePath: `/uploads/resources/${filename}`,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      version: version || null,
      tags: parsedTags,
      userId: session.user.id
    };
    
    return NextResponse.json({ 
      success: true, 
      resourceData,
      filename
    });

  } catch (error) {
    console.error('Error uploading resource:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}