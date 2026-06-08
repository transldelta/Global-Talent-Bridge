import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'CorridorWork — Global Talent Corridors for Employers, Candidates and Partners',
    template: '%s | CorridorWork',
  },
  description:
    'CorridorWork organizes international employer demand, candidate interest and talent mobility signals across sectors and regions.',
  keywords: [
    'global talent mobility',
    'international recruiting',
    'talent corridors',
    'employer hiring international',
    'candidate interest global',
    'workforce corridors',
    'global talent platform',
  ],
  authors: [{ name: 'CorridorWork' }],
  creator: 'CorridorWork',
  metadataBase: new URL('https://corridorwork.com'),
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://corridorwork.com',
    siteName: 'CorridorWork',
    title: 'CorridorWork — Global Talent Corridors',
    description:
      'Organize international employer demand and candidate interest across sectors, regions and talent corridors.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CorridorWork — Global Talent Mobility Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CorridorWork — Global Talent Corridors',
    description:
      'Connecting employer demand with candidate interest across sectors and regions.',
    images: ['/og-image.png'],
  },
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  )
}
