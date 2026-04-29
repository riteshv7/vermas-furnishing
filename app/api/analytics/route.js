import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
    try {
        const body = await request.json();
        const { type, productId, path, metadata } = body;

        const userAgent = request.headers.get('user-agent') || '';
        const isMobile = /mobile|android|iphone|ipad|ipod/i.test(userAgent);
        const deviceType = isMobile ? 'Mobile' : 'Desktop';

        const finalMetadata = {
            ...(metadata || {}),
            device: deviceType,
            userAgent: userAgent.substring(0, 100)
        };

        await prisma.analyticsEvent.create({
            data: {
                type,
                productId: productId ? parseInt(productId) : null,
                path,
                metadata: JSON.stringify(finalMetadata),
                isInternal: body.isInternal || false,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Analytics Error:', error);
        return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        const accessCode = request.headers.get('x-admin-code')?.trim();
        const masterPassword = process.env.ADMIN_PASSWORD?.trim();

        if (!accessCode || accessCode !== masterPassword) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const hideInternal = searchParams.get('hideInternal') === 'true';
        
        const where = hideInternal ? { isInternal: false } : {};

        if (searchParams.get('export') === 'csv') {
            const events = await prisma.analyticsEvent.findMany({
                where,
                orderBy: { createdAt: 'desc' }
            });
            const csvHeader = 'ID,Type,Product ID,Path,Device,Category,Query,Internal,Created At\n';
            const csvRows = events.map(event => {
                let meta = {};
                try { meta = JSON.parse(event.metadata || '{}'); } catch (e) { }
                return [
                    event.id, event.type, event.productId || '', event.path || '',
                    meta.device || '', meta.category || '', meta.query || '',
                    event.isInternal ? 'Yes' : 'No', new Date(event.createdAt).toISOString()
                ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(',');
            });
            return new NextResponse(csvHeader + csvRows.join('\n'), {
                headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="analytics.csv"' }
            });
        }

        const totalEvents = await prisma.analyticsEvent.groupBy({
            by: ['type'],
            where,
            _count: { type: true },
        });

        const topViewedProducts = await prisma.analyticsEvent.groupBy({
            by: ['productId', 'type'],
            where: { ...where, type: 'VIEW', productId: { not: null } },
            _count: { productId: true },
            orderBy: { _count: { productId: 'desc' } },
            take: 10,
        });

        const topInteractedProducts = await prisma.analyticsEvent.groupBy({
            by: ['productId', 'type'],
            where: {
                ...where,
                type: { in: ['CLICK', 'INQUIRE', 'WISHLIST'] },
                productId: { not: null }
            },
            _count: { productId: true },
            orderBy: { _count: { productId: 'desc' } },
            take: 20,
        });

        const recentRawEvents = await prisma.analyticsEvent.findMany({
            where,
            take: 1000,
            orderBy: { createdAt: 'desc' },
            select: { type: true, metadata: true, createdAt: true }
        });

        const deviceStats = { Mobile: 0, Desktop: 0 };
        const searchStats = {};
        const categoryStats = {};

        recentRawEvents.forEach(event => {
            if (!event.metadata) return;
            try {
                const meta = JSON.parse(event.metadata);
                if (meta.device === 'Mobile') deviceStats.Mobile++;
                if (meta.device === 'Desktop') deviceStats.Desktop++;
                if (event.type === 'SEARCH' && meta.query) {
                    const q = meta.query.toLowerCase().trim();
                    searchStats[q] = (searchStats[q] || 0) + 1;
                }
                if (event.type === 'CATEGORY_CLICK' && meta.category) {
                    const c = meta.category;
                    categoryStats[c] = (categoryStats[c] || 0) + 1;
                }
            } catch (e) { }
        });

        const recentLeads = await prisma.analyticsEvent.findMany({
            where: { ...where, type: 'INQUIRE' },
            take: 100,
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({
            success: true,
            data: {
                totals: totalEvents,
                topViewed: topViewedProducts,
                topInteracted: topInteractedProducts,
                leads: recentLeads,
                stats: {
                    devices: deviceStats,
                    topSearches: Object.entries(searchStats).sort((a, b) => b[1] - a[1]).slice(0, 5),
                    topCategories: Object.entries(categoryStats).sort((a, b) => b[1] - a[1]).slice(0, 5)
                }
            }
        });
    } catch (error) {
        console.error('Analytics Fetch Error:', error);
        return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
    }
}
