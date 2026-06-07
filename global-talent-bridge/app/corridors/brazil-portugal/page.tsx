import { GlobalCorridorPage } from '@/app/_components/GlobalCorridorPage'
export default function Page() {
  return <GlobalCorridorPage cfg={{
    slug: 'brazil-portugal', originCountry: 'Brazil', destinationCountry: 'Portugal',
    originFlag: '🇧🇷', destinationFlag: '🇵🇹',
    headline: 'Brazil → Portugal Talent Corridor',
    description: 'Brazilian professionals leveraging shared language to access Portuguese and EU labor markets in IT, tourism, construction and services.',
    sectors: ['💻 IT & Software', '🏨 Tourism & Hospitality', '🏗️ Construction', '🍽️ Gastronomy', '🌐 Language Services'],
    corridorScore: 80, complianceNote: 'EU access via Portuguese residence. Credential recognition required for regulated professions.',
    metaDescription: 'Brazil to Portugal talent corridor — IT, hospitality, construction. CorridorWork.',
  }} />
}
