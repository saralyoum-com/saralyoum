/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },

  async rewrites() {
    return [
      { source: "/سعر-الذهب-السعودية", destination: "/gold/sa" },
      { source: "/سعر-الذهب-الامارات",  destination: "/gold/ae" },
      { source: "/سعر-الذهب-الكويت",   destination: "/gold/kw" },
      { source: "/سعر-الذهب-قطر",      destination: "/gold/qa" },
      { source: "/سعر-الذهب-البحرين",  destination: "/gold/bh" },
      { source: "/سعر-الذهب-عمان",     destination: "/gold/om" },
      { source: "/سعر-الذهب-مصر",      destination: "/gold/eg" },
      { source: "/سعر-الذهب-الاردن",   destination: "/gold/jo" },
      { source: "/سعر-الذهب-المغرب",   destination: "/gold/ma" },
      { source: "/سعر-الذهب-العراق",   destination: "/gold/iq" },
      { source: "/سعر-الذهب-ليبيا",    destination: "/gold/ly" },
      { source: "/سعر-الذهب-تونس",     destination: "/gold/tn" },
      { source: "/سعر-الذهب-الجزائر",  destination: "/gold/dz" },
      { source: "/سعر-الذهب-اليمن",    destination: "/gold/ye" },
      { source: "/سعر-الذهب-السودان",  destination: "/gold/sd" },
      { source: "/سعر-الذهب-لبنان",    destination: "/gold/lb" },
    ];
  },

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
      // Static assets — aggressive long-term caching
      {
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      // Fonts — long-term caching
      {
        source: "/fonts/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      // Favicon & public icons
      {
        source: "/favicon.ico",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400" },
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
        ],
      },
    ];
  },
};

export default nextConfig;
