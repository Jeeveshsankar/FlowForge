import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
    ]
  },
  images: {
    domains: ['localhost', 'avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
  },
}

export default nextConfig
