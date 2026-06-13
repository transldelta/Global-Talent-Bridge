/**
 * app/demo/page.tsx — /demo — CorridorWork
 *
 * Permanent redirect → /demo/sandbox
 * The CorridorWork platform demo is consolidated at /demo/sandbox.
 * No content, no layout, no real data — redirect only.
 */
import { permanentRedirect } from 'next/navigation'

export default function DemoPage() {
  permanentRedirect('/demo/sandbox')
}
