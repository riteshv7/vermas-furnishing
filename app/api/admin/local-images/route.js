import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const IMAGE_DIR = "/Users/riteshverma/Documents/VERMA'S copy/VERMAS_Images_2026-03-26/Sofa/done editing";

export async function GET(request) {
    const accessCode = request.headers.get('x-admin-code');
    if (accessCode !== process.env.ADMIN_PASSWORD) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const files = fs.readdirSync(IMAGE_DIR)
            .filter(f => f.endsWith('.webp') && !f.startsWith('.'))
            .sort();

        return NextResponse.json({ success: true, files, directory: IMAGE_DIR });
    } catch (error) {
        console.error('Error reading local images:', error);
        return NextResponse.json({ error: 'Failed to read image directory' }, { status: 500 });
    }
}
