/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  images: {
    domains: ['res.cloudinary.com'],
  },
  // Add server configuration to handle large headers
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcrypt'],
  },
  // Increase header size limits
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Connection',
            value: 'keep-alive',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
