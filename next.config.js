/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    // TODO: enable lint
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
