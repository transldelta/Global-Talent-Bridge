/**
 * app/promo-video/page.tsx
 *
 * INTERNAL PRODUCTION PAGE — not for public access.
 * Returns 404 for all visitors.
 * Video production workflow is managed offline.
 */
import { notFound } from 'next/navigation'

export const metadata = {
  robots: 'noindex, nofollow',
}

export default function PromoVideoPage() {
  notFound()
}
