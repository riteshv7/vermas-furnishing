import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Helper for auth
function checkAuth(request) {
    const accessCode = request.headers.get('x-admin-code')?.trim();
    const masterPassword = process.env.ADMIN_PASSWORD?.trim();
    return accessCode && accessCode === masterPassword;
}

export async function GET(request) {
    if (!checkAuth(request)) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const products = await prisma.product.findMany({
            orderBy: { id: 'desc' }
        });
        
        const formatted = products.map(p => ({
            ...p,
            images: p.images ? JSON.parse(p.images) : [],
            features: p.features ? JSON.parse(p.features) : []
        }));

        return NextResponse.json({ success: true, products: formatted });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request) {
    if (!checkAuth(request)) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { name, category, description, image, features, images, isFeatured, isNewArrival } = body;

        const product = await prisma.product.create({
            data: {
                name,
                category,
                description,
                image,
                features: features ? JSON.stringify(features) : null,
                images: images ? JSON.stringify(images) : null,
                isFeatured: !!isFeatured,
                isNewArrival: !!isNewArrival
            }
        });

        return NextResponse.json({ success: true, product });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 });
    }
}

export async function PUT(request) {
    if (!checkAuth(request)) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { id, name, category, description, image, features, images, isFeatured, isNewArrival } = body;

        const product = await prisma.product.update({
            where: { id: parseInt(id) },
            data: {
                name,
                category,
                description,
                image,
                features: features ? JSON.stringify(features) : null,
                images: images ? JSON.stringify(images) : null,
                isFeatured: !!isFeatured,
                isNewArrival: !!isNewArrival
            }
        });

        return NextResponse.json({ success: true, product });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to update product' }, { status: 500 });
    }
}

export async function DELETE(request) {
    if (!checkAuth(request)) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        await prisma.product.delete({
            where: { id: parseInt(id) }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to delete product' }, { status: 500 });
    }
}
