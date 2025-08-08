/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration pour démo statique
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Disable ESLint during build pour démo rapide
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable type checking for faster demo build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Export static files
  distDir: 'dist',
  // Désactiver les API routes pour static export
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;