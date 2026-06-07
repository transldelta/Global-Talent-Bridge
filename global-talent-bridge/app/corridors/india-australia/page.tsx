import { GlobalCorridorPage } from '@/app/_components/GlobalCorridorPage'
export default function Page() {
  return <GlobalCorridorPage cfg={{
    slug: 'india-australia', originCountry: 'India', destinationCountry: 'Australia',
    originFlag: '🇮🇳', destinationFlag: '🇦🇺',
    headline: 'India → Australia Talent Corridor',
    description: 'Skilled Indian professionals connecting with Australian employers in IT, healthcare, engineering and construction.',
    sectors: ['💻 IT & Software', '🏥 Healthcare', '⚙️ Engineering', '🏗️ Construction', '🎓 Education'],
    corridorScore: 86, complianceNote: 'Australian skilled visa required. Skills assessment through relevant authority.',
    metaDescription: 'India to Australia talent corridor — IT, healthcare, engineering. CorridorWork.',
  }} />
}
