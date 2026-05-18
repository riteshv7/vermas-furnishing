import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const IMAGE_DIR = "/Users/riteshverma/Documents/VERMA'S copy/VERMAS_Images_2026-03-26/Sofa/done editing";

export async function GET(request, { params }) {
    const accessCode = request.nextUrl.searchParams.get('code');
    if (accessCode !== process.env.ADMIN_PASSWORD) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { filename } = await params;
    const filePath = path.join(IMAGE_DIR, decodeURIComponent(filename));

    // Security: ensure we're not escaping the directory
    if (!filePath.startsWith(IMAGE_DIR)) {
        return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }

    try {
        const ext = path.extname(filename).toLowerCase();
        const contentType = ext === '.webp' ? 'image/webp' : ext === '.png' ? 'image/png' : 'image/jpeg';
        
        const fileBuffer = fs.readFileSync(filePath);
        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=3600',
            },
        });
    } catch (error) {
        console.error('Error serving image:', error);
        return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }
}
