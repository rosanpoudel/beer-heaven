/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  async rewrites() {
    return [
      // Rewrite asset URLs to point to the 'public' directory
      {
        source: "/public/:path*",
        destination: "/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
