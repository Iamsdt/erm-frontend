import i18n from "i18next"
import { useTranslation } from "react-i18next"

import { toast } from "@/components/ui/use-toast"
import { useTheme } from "@/lib/context/theme-provider"
import { useFetchSettings, useUpdateSettings } from "@query/settings.query"

import SettingsUI from "./settings.ui"

/**
 * Settings container — manages app preferences backed by API.
 */
const SettingsPage = () => {
  const { t } = useTranslation()
  const { theme, setTheme } = useTheme()

  const { data: settings } = useFetchSettings()
  const { mutate: saveSettings } = useUpdateSettings()

  const notifications = settings?.notifications ?? {
    emailAlerts: true,
    leaveUpdates: true,
    projectUpdates: true,
    attendanceReminders: false,
    weeklyDigest: true,
  }

  const currentLanguage = i18n.language?.startsWith("hi") ? "hi" : "en"

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    toast({
      title: t("Theme updated"),
      description: `Theme set to ${newTheme}.`,
    })
  }

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang)
    toast({
      title: t("Language updated"),
      description: `Language set to ${lang === "en" ? "English" : "Hindi"}.`,
    })
  }

  const handleNotificationToggle = (key) => {
    const updated = { ...notifications, [key]: !notifications[key] }
    saveSettings({ notifications: updated })
  }

  return (
    <SettingsUI
      theme={theme}
      currentLanguage={currentLanguage}
      notifications={notifications}
      onThemeChange={handleThemeChange}
      onLanguageChange={handleLanguageChange}
      onNotificationToggle={handleNotificationToggle}
    />
  )
}

export default SettingsPage
