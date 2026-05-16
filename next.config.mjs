/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // RSS article thumbnails from known news sources
      { protocol: "https", hostname: "feeds.bbci.co.uk" },
      { protocol: "https", hostname: "ichef.bbci.co.uk" },
      { protocol: "https", hostname: "www.aljazeera.net" },
      { protocol: "https", hostname: "www.reuters.com" },
      { protocol: "https", hostname: "s.marketwatch.com" },
      { protocol: "https", hostname: "www.kitco.com" },
      { protocol: "https", hostname: "finance.yahoo.com" },
      { protocol: "https", hostname: "media.kitco.com" },
    ],
  },

  // NOTE: Arabic URL routing is now handled by middleware.ts (Edge Middleware)
  // which decodes percent-encoding and normalises to NFC before matching slugs.
  // This avoids the NFD/NFC encoding mismatch between macOS builds and Vercel/Linux.

  async redirects() {
    return [
      // www.sardhahab.com → sardhahab.com
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.sardhahab.com" }],
        destination: "https://sardhahab.com/:path*",
        permanent: true,
      },
      // saralyoum.vercel.app → sardhahab.com
      {
        source: "/:path*",
        has: [{ type: "host", value: "saralyoum.vercel.app" }],
        destination: "https://sardhahab.com/:path*",
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      // Static assets — long-term cache + tell Google not to index them
      {
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
      // Fonts — long-term cache + noindex
      {
        source: "/fonts/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
      // Favicon + icons — noindex
      {
        source: "/favicon.ico",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
      {
        source: "/icons/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
      // API routes — short cache (prices update every 5 min, news every 15 min)
      {
        source: "/api/prices",
        headers: [
          { key: "Cache-Control", value: "public, s-maxage=300, stale-while-revalidate=60" },
        ],
      },
      {
        source: "/api/news",
        headers: [
          { key: "Cache-Control", value: "public, s-maxage=900, stale-while-revalidate=120" },
        ],
      },
      // Sitemap & robots — daily cache
      {
        source: "/sitemap.xml",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400" },
        ],
      },
      {
        source: "/robots.txt",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400" },
        ],
      },
      // Security headers for all routes
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // HSTS — force HTTPS for 1 year, include subdomains
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          // Permissions Policy — disable unused browser features
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
          // CSP — allow self + Google services + Supabase + OneSignal
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://pagead2.googlesyndication.com https://cdn.onesignal.com https://onesignal.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https:",
              "connect-src 'self' https://api.coingecko.com https://www.goldapi.io https://v6.exchangerate-api.com https://open.er-api.com https://ipapi.co https://onesignal.com https://*.supabase.co https://www.google-analytics.com",
              "frame-src https://googleads.g.doubleclick.net https://tpc.googlesyndication.com",
              "media-src 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
