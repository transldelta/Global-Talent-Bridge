/**
 * Bewerbungsnachricht-Template-Generator
 *
 * Wird verwendet wenn ENABLE_TEST_AUTO_APPLICATION_MESSAGE=true.
 * Kein externer API-Aufruf, keine OpenAI-Kosten — reines Template.
 * Nur für Testzwecke: erleichtert schnelle Workflow-Tests.
 */

/**
 * Generiert eine deutsche Bewerbungsnachricht aus Kandidatenprofil + Jobtitel.
 * Rein template-basiert, keine KI, keine externen Dienste.
 */
export function generateTestApplicationMessage({
  candidateSector,
  jobTitle,
  candidateFirstName,
}: {
  candidateSector: string | null
  jobTitle: string
  candidateFirstName: string | null
}): string {
  const sector = candidateSector?.trim() || 'meinem Fachbereich'
  const title = jobTitle.trim() || 'der ausgeschriebenen Stelle'
  const firstName = candidateFirstName?.split(' ')[0]?.trim() || null

  return [
    'Guten Tag,',
    '',
    `als Fachkraft im Bereich ${sector} bewerbe ich mich auf Ihre ausgeschriebene Stelle als ${title}.`,
    '',
    `Ich bringe praktische Erfahrung in ${sector} mit und freue mich darauf, meine Kenntnisse in Ihrem Unternehmen einzubringen. Eine Zusammenarbeit halte ich für vielversprechend.`,
    '',
    'Über eine Einladung zum Gespräch würde ich mich sehr freuen.',
    '',
    'Mit freundlichen Grüßen',
    firstName ?? '',
  ]
    .join('\n')
    .trim()
}

/**
 * Gibt true zurück wenn der Test-Automodus aktiv ist.
 * Nur serverseitig auswerten (process.env).
 */
export function isTestAutoMessageEnabled(): boolean {
  return process.env.ENABLE_TEST_AUTO_APPLICATION_MESSAGE === 'true'
}
