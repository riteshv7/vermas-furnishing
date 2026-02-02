"use client";

import { useAnalytics } from '@/hooks/useAnalytics';

export default function AnalyticsTracker() {
    useAnalytics(); // Triggers VIEW event on mount/navigation
    return null;
}
