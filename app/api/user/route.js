import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
    try {
        const body = await request.json();
        const { name, phone, email, wishlist } = body;

        // Upsert user based on phone number
        const user = await prisma.user.upsert({
            where: { phone: phone },
            update: {
                name,
                email,
                wishlist: wishlist ? JSON.stringify(wishlist) : undefined,
            },
            create: {
                name,
                phone,
                email,
                wishlist: wishlist ? JSON.stringify(wishlist) : JSON.stringify([]),
            },
        });

        return NextResponse.json({
            success: true,
            user: {
                ...user,
                wishlist: user.wishlist ? JSON.parse(user.wishlist) : []
            }
        });
    } catch (error) {
        console.error('User API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to save user' }, { status: 500 });
    }
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');

    if (!phone) {
        return NextResponse.json({ success: false, error: 'Phone number required' }, { status: 400 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { phone },
        });

        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            user: { ...user, wishlist: user.wishlist ? JSON.parse(user.wishlist) : [] }
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch user' }, { status: 500 });
    }
}
