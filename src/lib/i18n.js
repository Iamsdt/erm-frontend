import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import Backend from "i18next-http-backend"
import { initReactI18next } from "react-i18next"

i18n
  // load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
  // learn more: https://github.com/i18next/i18next-http-backend
  // want your translations to be loaded from a professional CDN? => https://github.com/locize/react-tutorial#step-2---use-the-locize-cdn
  .use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "hi"],
    // Allow non-explicit language codes to fall back to base language
    nonExplicitSupportedLngs: true,
    
    // Configure backend
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    
    // Configure language detector
    detection: {
      // Only check localStorage and navigator
      order: ["localStorage", "navigator"],
      // Cache the language in localStorage
      caches: ["localStorage"],
      // Convert detected language to supported format
      convertDetectedLanguage: (lng) => {
        // Map language codes to supported languages
        if (lng && lng.startsWith("en")) {
          return "en"
        }
        if (lng && lng.startsWith("hi")) {
          return "hi"
        }
        // Default to fallback
        return "en"
      },
    },

    debug: import.meta.env.DEV,

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  })

export default i18n
