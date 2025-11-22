/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Variables d'environnement
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },

  // Optimisation des images
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: '*.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
    // Formats optimisés
    formats: ['image/avif', 'image/webp'],
    // Tailles d'images responsive
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Compilation optimisée
  compiler: {
    // Supprime console.log en production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Headers de sécurité
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Protection contre clickjacking
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // Protection XSS
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Politique de référent
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          // Permissions API
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self)',
          },
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: https: blob:",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' http://localhost:8080 ws://localhost:*",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ]
  },

  // Support for API routes
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/:path*`,
      },
    ];
  },

  // Optimisation du build
  swcMinify: true,

  // Compression
  compress: true,

  // Power par métadonnées
  poweredByHeader: false,

  // Mode standalone pour Docker (optimisation production)
  output: 'standalone',

  // Cache ISR optimisé (50MB)
  cacheMaxMemorySize: 50 * 1024 * 1024,
};

module.exports = nextConfig;
