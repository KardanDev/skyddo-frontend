import { ContentSection } from '../components/content-section'
import { AppearanceForm } from './appearance-form'

export function SettingsAppearance() {
  return (
    <ContentSection
      title='Appearance'
      desc='Customize the look and feel of your dashboard. Choose your theme, colors, layout preferences, and more.'
    >
      <AppearanceForm />
    </ContentSection>
  )
}
