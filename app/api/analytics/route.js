import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
    try {
        const body = await request.json();
        const { type, productId, path, metadata } = body;

        // Simple Device Detection
        const userAgent = request.headers.get('user-agent') || '';
        const isMobile = /mobile|android|iphone|ipad|ipod/i.test(userAgent);
        const deviceType = isMobile ? 'Mobile' : 'Desktop';

        const finalMetadata = {
            ...(metadata || {}),
            device: deviceType,
            userAgent: userAgent.substring(0, 100) // Truncate for safety
        };

        await prisma.analyticsEvent.create({
            data: {
                type, // "VIEW", "CLICK", "INQUIRE", "WISHLIST", "SEARCH", "CATEGORY_CLICK"
                productId: productId ? parseInt(productId) : null,
                path,
                metadata: JSON.stringify(finalMetadata),
                isInternal: body.isInternal || false,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Analytics Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to log event' }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        // Authenticate the request
        const accessCode = request.headers.get('x-admin-code');
        if (accessCode !== 'Verma2024!') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        if (searchParams.get('export') === 'csv') {
            const events = await prisma.analyticsEvent.findMany({
                orderBy: { createdAt: 'desc' }
            });

            const csvHeader = 'ID,Type,Product ID,Path,Device,Category,Query,Internal,Created At\n';
            const csvRows = events.map(event => {
                let meta = {};
                try { meta = JSON.parse(event.metadata || '{}'); } catch (e) { }

                return [
                    event.id,
                    event.type,
                    event.productId || '',
                    event.path || '',
                    meta.device || '',
                    meta.category || '',
                    meta.query || '',
                    event.isInternal ? 'Yes' : 'No',
                    new Date(event.createdAt).toISOString()
                ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(',');
            });

            return new NextResponse(csvHeader + csvRows.join('\n'), {
                headers: {
                    'Content-Type': 'text/csv',
                    'Content-Disposition': 'attachment; filename="analytics_export.csv"',
                },
            });
        }

        // 1. Basic Totals
        const totalEvents = await prisma.analyticsEvent.groupBy({
            by: ['type'],
            _count: { type: true },
        });

        // 2. Top Viewed Products
        const topViewedProducts = await prisma.analyticsEvent.groupBy({
            by: ['productId', 'type'],
            where: { type: 'VIEW', productId: { not: null } },
            _count: { productId: true },
            orderBy: { _count: { productId: 'desc' } },
            take: 10,
        });

        // 3. Top Interacted Products
        const topInteractedProducts = await prisma.analyticsEvent.groupBy({
            by: ['productId', 'type'],
            where: {
                type: { in: ['CLICK', 'INQUIRE', 'WISHLIST'] },
                productId: { not: null }
            },
            _count: { productId: true },
            orderBy: { _count: { productId: 'desc' } },
            take: 20,
        });

        // Fetch raw recent events to process for custom charts (SQLite limitation on JSON aggregation)
        // We fetch a larger batch to analyze metadata in JS
        const recentRawEvents = await prisma.analyticsEvent.findMany({
            take: 500, // Analyze last 500 events for trends
            orderBy: { createdAt: 'desc' },
            select: {
                type: true,
                metadata: true,
                createdAt: true
            }
        });

        // Process Metadata Stats (Devices, Search, Categories)
        const deviceStats = { Mobile: 0, Desktop: 0 };
        const searchStats = {}; // { "query": count }
        const categoryStats = {}; // { "categoryName": count }

        recentRawEvents.forEach(event => {
            if (!event.metadata) return;
            try {
                const meta = JSON.parse(event.metadata);

                // Device Stats
                if (meta.device === 'Mobile') deviceStats.Mobile++;
                if (meta.device === 'Desktop') deviceStats.Desktop++;

                // Search Stats
                if (event.type === 'SEARCH' && meta.query) {
                    const q = meta.query.toLowerCase().trim();
                    searchStats[q] = (searchStats[q] || 0) + 1;
                }

                // Category Stats
                if (event.type === 'CATEGORY_CLICK' && meta.category) {
                    const c = meta.category;
                    categoryStats[c] = (categoryStats[c] || 0) + 1;
                }
            } catch (e) { /* ignore parse errors */ }
        });

        // specific raw events for the table
        const recentActivity = await prisma.analyticsEvent.findMany({
            take: 50,
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({
            success: true,
            data: {
                totals: totalEvents,
                topViewed: topViewedProducts,
                topInteracted: topInteractedProducts,
                recent: recentActivity,
                stats: {
                    devices: deviceStats,
                    topSearches: Object.entries(searchStats).sort((a, b) => b[1] - a[1]).slice(0, 5),
                    topCategories: Object.entries(categoryStats).sort((a, b) => b[1] - a[1]).slice(0, 5)
                }
            }
        });
    } catch (error) {
        console.error('Analytics Fetch Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch analytics' }, { status: 500 });
    }
}
