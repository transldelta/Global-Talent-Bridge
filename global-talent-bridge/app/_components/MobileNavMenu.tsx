/**
 * app/_components/MobileNavMenu.tsx — client component
 * Mobile hamburger menu for PublicNavBar.
 * Used only on xs/sm screens (hidden on md+).
 * No auth state: receives showSignIn as prop from server parent.
 */
'use client'

import { useState } from 'react'
import Link from 'next/link'

const NAV_LINKS = [
  { href: '/global/employers',       label: 'Employers' },
  { href: '/global/candidates',      label: 'Candidates' },
  { href: '/partners',               label: 'Partners' },
  { href: '/demo/sandbox',           label: 'Demo' },
]

interface Props {
  showSignIn: boolean
}

export function MobileNavMenu({ showSignIn }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden relative">
      {/* Hamburger / Close button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-md"
        aria-label={open ? 'Close navigation' : 'Open navigation'}
        aria-expanded={open}
      >
        {open ? (
          /* X icon */
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          /* Hamburger icon */
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
          <div className="py-2">
            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block px-5 py-3 text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors ${
                  i < NAV_LINKS.length - 1 ? 'border-b border-slate-800' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}

            {showSignIn && (
              <div className="border-t border-slate-700 mt-1 pt-1">
                <Link
                  href="/auth/login"
                  onClick={() => setOpen(false)}
                  className="block px-5 py-3 text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Sign in
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
