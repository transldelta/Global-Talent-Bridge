import { GlobalCorridorPage } from '@/app/_components/GlobalCorridorPage'
export default function Page() {
  return <GlobalCorridorPage cfg={{
    slug: 'kenya-care', originCountry: 'Kenya', destinationCountry: 'Global (EU/UK/CA)',
    originFlag: '🇰🇪', destinationFlag: '🌍',
    headline: 'Kenya → Global Care Corridor',
    description: 'Kenyan care professionals and skilled workers connecting with healthcare and service employers in Europe, UK and Canada.',
    sectors: ['🏥 Healthcare & Nursing', '👵 Elder Care', '🎓 Education', '🧹 Facility Services', '👷 Skilled Trades'],
    corridorScore: 78, complianceNote: 'Destination-country work permit required. Healthcare qualifications need local recognition.',
    metaDescription: 'Kenya to global care corridor — nursing, elder care, healthcare. CorridorWork.',
  }} />
}
