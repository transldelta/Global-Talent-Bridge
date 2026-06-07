import { GlobalCorridorPage } from '@/app/_components/GlobalCorridorPage'
export default function Page() {
  return <GlobalCorridorPage cfg={{
    slug: 'tunisia-germany', originCountry: 'Tunisia', destinationCountry: 'Germany',
    originFlag: '🇹🇳', destinationFlag: '🇩🇪',
    headline: 'Tunesien → Deutschland Talent-Korridor',
    description: 'Tunesische Fachkräfte — Elektriker, Mechaniker, Baufachkräfte, Pflegepersonal — verbinden sich mit deutschen Arbeitgebern.',
    sectors: ['🔧 Techniker & Elektriker', '🏗️ Bau & Handwerk', '🏥 Pflege', '🚚 Logistik', '🏭 Produktion'],
    corridorScore: 83, complianceNote: 'Visum zur Beschäftigung erforderlich. Anerkennungsverfahren je nach Qualifikation.',
    metaDescription: 'Tunesien nach Deutschland Talent-Korridor — Handwerk, Pflege, Logistik. CorridorWork.',
  }} />
}
