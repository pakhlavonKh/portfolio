
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import ru from "./locales/ru.json";
import uz from "./locales/uz.json";
import tr from "./locales/tr.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ru: { translation: ru },
      uz: { translation: uz },
      tr: { translation: tr },
    },
    supportedLngs: ["uz", "ru", "en", "tr"],
    fallbackLng: "en",
    load: "languageOnly",
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      lookupLocalStorage: "app.lang",
      caches: ["localStorage"],
    },
    interpolation: { escapeValue: false }
  });

export default i18n;
