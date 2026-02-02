"use client";

import { usePathname } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { trackEvent as logEvent } from '@/lib/analytics';

export function useAnalytics() {
    const pathname = usePathname();

    const trackEvent = useCallback((type, data = {}) => {
        logEvent(type, data);
    }, []);

    // Automatically track page views
    useEffect(() => {
        // Pass path explicitly for the initial load if needed, but the lib handles window.location.pathname
        // However, for consistency with the hook's lifecycle:
        logEvent('VIEW', { path: pathname });
    }, [pathname]);

    return { trackEvent };
}
