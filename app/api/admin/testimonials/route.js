import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Helper for auth
function checkAuth(request) {
    const accessCode = request.headers.get('x-admin-code')?.trim();
    const masterPassword = process.env.ADMIN_PASSWORD?.trim();
    return accessCode && accessCode === masterPassword;
}

export async function GET(request) {
    try {
        const testimonials = await prisma.testimonial.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json({ success: true, testimonials });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch testimonials' }, { status: 500 });
    }
}

export async function POST(request) {
    if (!checkAuth(request)) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { name, location, content, image, rating, productId } = body;

        const testimonial = await prisma.testimonial.create({
            data: {
                name,
                location,
                content,
                image,
                rating: parseInt(rating) || 5,
                productId: productId ? parseInt(productId) : null
            }
        });

        return NextResponse.json({ success: true, testimonial });
    } catch (error) {
        console.error('Testimonial Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to create testimonial' }, { status: 500 });
    }
}

export async function PUT(request) {
    if (!checkAuth(request)) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { id, name, location, content, image, rating, productId } = body;

        const testimonial = await prisma.testimonial.update({
            where: { id: parseInt(id) },
            data: {
                name,
                location,
                content,
                image,
                rating: parseInt(rating) || 5,
                productId: productId ? parseInt(productId) : null
            }
        });

        return NextResponse.json({ success: true, testimonial });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to update testimonial' }, { status: 500 });
    }
}

export async function DELETE(request) {
    if (!checkAuth(request)) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        await prisma.testimonial.delete({
            where: { id: parseInt(id) }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to delete testimonial' }, { status: 500 });
    }
}
