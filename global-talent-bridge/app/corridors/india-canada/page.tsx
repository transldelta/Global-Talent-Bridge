import { GlobalCorridorPage } from '@/app/_components/GlobalCorridorPage'
export default function Page() {
  return <GlobalCorridorPage cfg={{
    slug: 'india-canada', originCountry: 'India', destinationCountry: 'Canada',
    originFlag: '🇮🇳', destinationFlag: '🇨🇦',
    headline: 'India → Canada Talent Corridor',
    description: 'Connecting qualified Indian professionals with Canadian employers across IT, engineering, healthcare and skilled trades.',
    sectors: ['💻 IT & Software', '⚙️ Engineering', '🏥 Healthcare', '👷 Skilled Trades', '🎓 Education'],
    corridorScore: 88, complianceNote: 'Canadian work permit / Express Entry required. Credential recognition varies by province.',
    metaDescription: 'India to Canada talent corridor — IT, engineering, healthcare. CorridorWork global hiring.',
  }} />
}
