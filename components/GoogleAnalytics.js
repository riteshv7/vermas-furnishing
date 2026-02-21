import Script from 'next/script';

export default function GoogleAnalytics({ ga_id }) {
    if (!ga_id) return null;

    return (
        <>
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${ga_id}`}
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${ga_id}');
        `}
            </Script>
        </>
    );
}
