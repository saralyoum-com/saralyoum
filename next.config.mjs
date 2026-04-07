/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.saralyoum.vercel.app" }],
        destination: "https://saralyoum.vercel.app/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
