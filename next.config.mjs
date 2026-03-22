/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output: smaller build, required for Render.com
  output: "standalone",

  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [320, 480, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,

  headers: async () => [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ],
    },
  ],

  webpack: (config) => {
    config.module.rules.push({
      test: /LICENSE$/,
      type: 'asset/source',
    });
    return config;
  },
};

export default nextConfig;
