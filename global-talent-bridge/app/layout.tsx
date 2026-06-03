import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Global Talent Bridge — Internationale Talente treffen globale Arbeitgeber',
    template: '%s | Global Talent Bridge',
  },
  description:
    'Kostenlose Plattform für internationale Fachkräfte und Arbeitgeber. Strukturiertes Matching nach Erfahrung, Sprachlevel und Branche.',
  keywords: [
    'internationale Fachkräfte',
    'Jobs für Ausländer',
    'internationales Matching',
    'Arbeitgeber internationale Kandidaten',
    'Sprachlevel Job Matching',
  ],
  authors: [{ name: 'Global Talent Bridge' }],
  creator: 'Global Talent Bridge',
  metadataBase: new URL('https://global-talent-bridge.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: 'https://global-talent-bridge.vercel.app',
    siteName: 'Global Talent Bridge',
    title: 'Global Talent Bridge — Internationale Talente treffen globale Arbeitgeber',
    description:
      'Kostenlose Plattform für internationale Fachkräfte und Arbeitgeber. Strukturiertes Matching nach Erfahrung, Sprachlevel und Branche.',
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
