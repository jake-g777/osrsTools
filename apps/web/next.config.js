/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['lh3.googleusercontent.com'], // For Google OAuth profile pictures
  },
  async redirects() {
    return [
      {
        source: '/tools',
        destination: '/',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig 