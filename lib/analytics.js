export const trackEvent = async (type, data = {}) => {
    try {
        const isInternal = localStorage.getItem('verma_internal') === 'true';

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
    } catch (error) {
        console.error('Failed to track event', error);
    }
};
