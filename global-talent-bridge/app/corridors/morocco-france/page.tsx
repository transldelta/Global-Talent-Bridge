import { GlobalCorridorPage } from '@/app/_components/GlobalCorridorPage'
export default function Page() {
  return <GlobalCorridorPage cfg={{
    slug: 'morocco-france', originCountry: 'Morocco', destinationCountry: 'France',
    originFlag: '🇲🇦', destinationFlag: '🇫🇷',
    headline: 'Maroc → France — Corridor de Talents',
    description: 'Professionnels marocains qualifiés connectés avec des employeurs français dans les secteurs de la construction, logistique, restauration et services.',
    sectors: ['🏗️ Construction & Trades', '🚚 Logistics', '🍽️ Gastronomy', '🌾 Agriculture', '🧹 Facility Services'],
    corridorScore: 82, complianceNote: 'Permis de travail ou passeport talent français requis. Reconnaissance des qualifications variable.',
    metaDescription: 'Morocco to France talent corridor — construction, logistics, gastronomy. CorridorWork.',
  }} />
}
