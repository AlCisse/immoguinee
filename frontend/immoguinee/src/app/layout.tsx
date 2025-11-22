import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'ImmoGuinée - Plateforme Immobilière en Guinée',
    template: '%s | ImmoGuinée',
  },
  description: 'La plateforme immobilière de référence pour acheter, vendre ou louer des propriétés en Guinée. Trouvez votre maison, appartement ou terrain idéal.',
  keywords: ['immobilier', 'Guinée', 'achat', 'vente', 'location', 'propriété', 'maison', 'appartement', 'terrain'],
  authors: [{ name: 'ImmoGuinée' }],
  creator: 'ImmoGuinée',
  publisher: 'ImmoGuinée',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_GN',
    url: 'https://immoguinee.com',
    siteName: 'ImmoGuinée',
    title: 'ImmoGuinée - Plateforme Immobilière en Guinée',
    description: 'La plateforme immobilière de référence pour acheter, vendre ou louer des propriétés en Guinée.',
    images: [
      {
        url: 'https://i0.wp.com/www.guinee360.com/wp-content/uploads/2024/07/IMG_20240709_164312_700_x_380_pixel.jpg?fit=700%2C380&ssl=1',
        width: 1200,
        height: 630,
        alt: 'ImmoGuinée - Trouvez votre propriété idéale',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ImmoGuinée - Plateforme Immobilière en Guinée',
    description: 'La plateforme immobilière de référence pour acheter, vendre ou louer des propriétés en Guinée.',
    images: ['/og-image.jpg'],
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://immoguinee.com',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={inter.variable}>
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Theme color */}
        <meta name="theme-color" content="#16a34a" />
      </head>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
