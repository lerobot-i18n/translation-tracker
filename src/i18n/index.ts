import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ko from "./ko.json";
import en from "./en.json";
import zhHant from "./zh-hant.json";
import zhHans from "./zh-hans.json";

i18n.use(initReactI18next).init({
  resources: {
    ko: { translation: ko },
    en: { translation: en },
    "zh-hant": { translation: zhHant },
    "zh-Hant": { translation: zhHant },
    "zh-hans": { translation: zhHans },
    "zh-Hans": { translation: zhHans },
  },
  lng: "ko",
  fallbackLng: "ko",
  interpolation: { escapeValue: false },
});

export default i18n;
