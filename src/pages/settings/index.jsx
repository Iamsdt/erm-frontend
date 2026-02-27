import i18n from "i18next"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import { toast } from "@/components/ui/use-toast"
import { useTheme } from "@/lib/context/theme-provider"

import SettingsUI from "./settings.ui"

/**
 * Settings container — manages app preferences.
 */
const SettingsPage = () => {
  const { t } = useTranslation()
  const { theme, setTheme } = useTheme()

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    leaveUpdates: true,
    projectUpdates: true,
    attendanceReminders: false,
    weeklyDigest: true,
  })

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
    setNotifications((previous) => {
      const updated = { ...previous, [key]: !previous[key] }
      toast({
        title: "Notification settings updated",
        description: `${key} has been ${updated[key] ? "enabled" : "disabled"}.`,
      })
      return updated
    })
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
