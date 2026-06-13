/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [],
  },
  async redirects() {
    return [
      // English aliases for legal pages (German canonical paths remain canonical)
      { source: '/legal/privacy', destination: '/legal/datenschutz', permanent: true },
      { source: '/legal/notice',  destination: '/legal/impressum',   permanent: true },
      { source: '/legal/terms',   destination: '/legal/agb',         permanent: true },
    ]
  },
}

module.exports = nextConfig
