import { GlobalCorridorPage } from '@/app/_components/GlobalCorridorPage'
export default function Page() {
  return <GlobalCorridorPage cfg={{
    slug: 'philippines-healthcare', originCountry: 'Philippines', destinationCountry: 'Global (EU/UK/AU/CA)',
    originFlag: '🇵🇭', destinationFlag: '🌍',
    headline: 'Philippines → Global Healthcare Corridor',
    description: 'Filipino healthcare professionals — nurses, caregivers, medical staff — connecting with healthcare employers worldwide.',
    sectors: ['🏥 Nursing & Healthcare', '👵 Elder Care', '🏨 Hospitality', '🎧 Customer Support', '📋 Admin'],
    corridorScore: 92, complianceNote: 'POEA clearance and destination-country nursing license required. No placement guarantee.',
    metaDescription: 'Philippines to global healthcare corridor — nurses, caregivers. CorridorWork.',
  }} />
}
