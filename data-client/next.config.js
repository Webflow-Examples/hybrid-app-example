/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "screenshots.webflow.com",
        port: '',
        pathname: "/**",
      }
    ],
  },
}

module.exports = nextConfig
