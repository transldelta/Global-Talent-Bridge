import { Suspense } from 'react'
import type { Metadata } from 'next'
import { PublicNavBar } from '@/app/_components/PublicNavBar'
import { PublicFooter } from '@/app/_components/PublicFooter'
import { ContactForm } from './ContactForm'

export const metadata: Metadata = {
  title: 'Contact CorridorWork',
  description:
    'Contact form for questions, feedback and partnership inquiries. No automatic emails — we respond manually.',
}

/**
 * Contact page — Server Component.
 * The form (ContactForm) is a Client Component and reads URL parameters
 * (role, interest) for pre-selection from pilot CTAs.
 * Suspense boundary required for useSearchParams in Next.js 14.
 */
export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <PublicNavBar />

      <div className="max-w-2xl mx-auto px-4 py-16 flex-1 w-full">
        <Suspense
          fallback={
            <div className="animate-pulse space-y-4">
              <div className="h-10 bg-gray-800 rounded-xl w-48 mx-auto" />
              <div className="h-4 bg-gray-800 rounded w-3/4 mx-auto" />
              <div className="h-64 bg-gray-900 border border-gray-800 rounded-2xl" />
            </div>
          }
        >
          <ContactForm />
        </Suspense>
      </div>

      <PublicFooter />
    </div>
  )
}
