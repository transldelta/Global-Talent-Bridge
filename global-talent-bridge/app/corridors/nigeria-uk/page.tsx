import { GlobalCorridorPage } from '@/app/_components/GlobalCorridorPage'
export default function Page() {
  return <GlobalCorridorPage cfg={{
    slug: 'nigeria-uk', originCountry: 'Nigeria', destinationCountry: 'United Kingdom',
    originFlag: '🇳🇬', destinationFlag: '🇬🇧',
    headline: 'Nigeria → UK Talent Corridor',
    description: 'Nigerian qualified professionals — nurses, IT specialists, engineers — connecting with UK employers.',
    sectors: ['🏥 Healthcare / Nursing', '💻 IT & Tech', '⚙️ Engineering', '🎓 Education', '📋 Administration'],
    corridorScore: 84, complianceNote: 'UK Skilled Worker visa required. NMC registration for nurses. Credential verification required.',
    metaDescription: 'Nigeria to UK talent corridor — healthcare, IT, engineering. CorridorWork.',
  }} />
}
