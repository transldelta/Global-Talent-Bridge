import { GlobalCorridorPage } from '@/app/_components/GlobalCorridorPage'
export default function Page() {
  return <GlobalCorridorPage cfg={{
    slug: 'pakistan-gulf', originCountry: 'Pakistan', destinationCountry: 'Gulf Region (UAE/KSA/Qatar)',
    originFlag: '🇵🇰', destinationFlag: '🌏',
    headline: 'Pakistan → Gulf Talent Corridor',
    description: 'Pakistani skilled workers and engineers connecting with Gulf employers in construction, manufacturing, IT and technical services.',
    sectors: ['🏗️ Construction & Engineering', '🔧 Technical Services', '💻 IT', '🏭 Manufacturing', '🚗 Transport'],
    corridorScore: 85, complianceNote: 'Gulf work visa sponsorship required. Contract-based employment. No placement guarantee.',
    metaDescription: 'Pakistan to Gulf talent corridor — construction, engineering, IT. CorridorWork.',
  }} />
}
