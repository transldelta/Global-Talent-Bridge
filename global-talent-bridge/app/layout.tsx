import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'CorridorWork — Cross-border Hiring. Fully Controlled.',
    template: '%s | CorridorWork',
  },
  description:
    'Approval-basierte Plattform für internationales Recruiting. Strukturiertes Matching, manuelle Freigabe, vollständige Risikokontrolle.',
  keywords: [
    'internationales Recruiting',
    'Cross-border Hiring',
    'internationale Fachkräfte',
    'Arbeitgeber internationale Kandidaten',
    'Workforce Corridor',
    'approval-based hiring',
  ],
  authors: [{ name: 'CorridorWork' }],
  creator: 'CorridorWork',
  metadataBase: new URL('https://corridorwork.com'),
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: 'https://corridorwork.com',
    siteName: 'CorridorWork',
    title: 'CorridorWork — Cross-border Hiring. Fully Controlled.',
    description:
      'Approval-basierte Plattform für internationales Recruiting. Strukturiertes Matching, manuelle Freigabe, vollständige Risikokontrolle.',
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
    <html lang="de" className="h-full">
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  )
}
