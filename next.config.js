/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  async redirects() {
    // Routes that existed on the previous site. Permanent, so the SEO value
    // moves rather than dying in a 404.
    return [
      { source: '/company', destination: '/team', permanent: true },
      { source: '/investors', destination: '/team', permanent: true },
      { source: '/waitlist', destination: '/contact', permanent: true },
      { source: '/universities', destination: '/cities', permanent: true },
      { source: '/terms', destination: '/privacy', permanent: true },
    ]
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
