import { GlobalCorridorPage } from '@/app/_components/GlobalCorridorPage'
export default function Page() {
  return <GlobalCorridorPage cfg={{
    slug: 'indonesia-hospitality', originCountry: 'Indonesia', destinationCountry: 'Global (AU/UAE/EU)',
    originFlag: '🇮🇩', destinationFlag: '🌏',
    headline: 'Indonesia → Global Hospitality Corridor',
    description: 'Indonesian hospitality professionals — hotel staff, F&B, tourism — connecting with international employers.',
    sectors: ['🏨 Hotel & Hospitality', '🍽️ Food & Beverage', '🎧 Customer Service', '🌾 Food Processing', '🧹 Facility Services'],
    corridorScore: 79, complianceNote: 'Destination-country work permit required. Hospitality certifications recommended.',
    metaDescription: 'Indonesia to global hospitality corridor — hotels, F&B, tourism. CorridorWork.',
  }} />
}
