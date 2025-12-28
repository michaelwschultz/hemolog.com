import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization settings
  images: {
    // Use remotePatterns instead of deprecated 'domains' for better security and flexibility
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**', // Allow all paths on this hostname
      },
      {
        protocol: 'https',
        hostname: 'assets.onedollarstats.com',
        pathname: '/**',
      },
    ],
    // Optimize image loading
    formats: ['image/webp', 'image/avif'],
    // Set reasonable limits to prevent abuse
    minimumCacheTTL: 60,
  },

  // Custom headers for security and CORS
  async headers() {
    return [
      {
        // Apply to all API routes
        source: '/api/:path*',
        headers: [
          // CORS headers - restrict origin in production for security
          {
            key: 'Access-Control-Allow-Origin',
            value:
              process.env.NODE_ENV === 'production'
                ? process.env.ALLOWED_ORIGINS || 'https://hemolog.com'
                : '*',
          },
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
          // Additional security headers
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },

  // Enable experimental features if needed (uncomment as required)
  // experimental: {
  //   optimizeCss: true,
  // },

  // Production optimizations
  ...(process.env.NODE_ENV === 'production' && {
    // Enable standalone output for better deployment
    output: 'standalone',
    // Compress responses
    compress: true,
  }),
}

export default withBundleAnalyzer(nextConfig)
