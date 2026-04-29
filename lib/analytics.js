export const trackEvent = async (type, data = {}) => {
    try {
        const isInternal = localStorage.getItem('verma_internal') === 'true';

        // 1. Log to our private database
        await fetch('/api/analytics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type,
                path: window.location.pathname,
                ...data,
                isInternal
            }),
        });

        // 2. Forward to Google Analytics if available
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', type, {
                ...data,
                event_category: 'engagement',
                is_internal: isInternal
            });
        }
    } catch (error) {
        console.error('Failed to track event', error);
    }
};
