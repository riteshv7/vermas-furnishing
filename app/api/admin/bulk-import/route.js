import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import cloudinary from '@/lib/cloudinary';
import { prisma } from '@/lib/prisma';

const IMAGE_DIR = "/Users/riteshverma/Documents/VERMA'S/VERMA'S Products/UPLOADER";

function uploadToCloudinary(buffer, filename) {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                folder: 'vermas-products',
                public_id: filename.replace('.webp', ''),
                use_filename: true,
                unique_filename: true,
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        ).end(buffer);
    });
}

export async function POST(request) {
    const accessCode = request.headers.get('x-admin-code');
    if (accessCode !== process.env.ADMIN_PASSWORD) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { name, category, description, features, filenames } = await request.json();

        if (!name || !filenames || filenames.length === 0) {
            return NextResponse.json({ error: 'Name and at least one image required' }, { status: 400 });
        }

        // Upload each selected image to Cloudinary
        const uploadedUrls = [];
        for (const filename of filenames) {
            const filePath = path.join(IMAGE_DIR, filename);
            if (!filePath.startsWith(IMAGE_DIR)) continue;

            const buffer = fs.readFileSync(filePath);
            const result = await uploadToCloudinary(buffer, filename);
            uploadedUrls.push(result.secure_url);
        }

        if (uploadedUrls.length === 0) {
            return NextResponse.json({ error: 'No images uploaded' }, { status: 400 });
        }

        // Create product in database
        const product = await prisma.product.create({
            data: {
                name,
                category: category || 'Sofas',
                description: description || `Premium handcrafted ${name} from Verma's Furnishing.`,
                image: uploadedUrls[0], // Primary image
                images: JSON.stringify(uploadedUrls), // All images
                features: JSON.stringify(features || ['Premium Materials', 'Handcrafted', 'Custom Sizing Available']),
                isFeatured: false,
                isNewArrival: true,
            }
        });

        return NextResponse.json({
            success: true,
            product: {
                id: product.id,
                name: product.name,
                images: uploadedUrls,
            }
        });
    } catch (error) {
        console.error('Bulk import error:', error);
        return NextResponse.json({ error: 'Import failed: ' + error.message }, { status: 500 });
    }
}
