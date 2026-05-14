import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import i18n from "@/i18n";

export interface LangConfig {
  code: string;
  label: string;
  flag: string;
  dir: string;             // docs/source/{dir}/
  issueNumber: number;
  issuePrLabel: string;    // PR title filter keyword
  checklistTag?: string;   // e.g. "zh-Hant" to filter from shared issue
  leadUsername: string;    // issue author = Lead Translator
}

export const LANGUAGES: LangConfig[] = [
  { code: "ko", flag: "🇰🇷", label: "한국어", dir: "ko", issueNumber: 3058, issuePrLabel: "ko/", leadUsername: "1wos" },
  { code: "zh-hant", flag: "🇹🇼", label: "繁體中文", dir: "zh-hant", issueNumber: 3290, issuePrLabel: "zh-hant/", checklistTag: "zh-Hant", leadUsername: "tc-huang" },
  { code: "zh-hans", flag: "🇨🇳", label: "简体中文", dir: "zh-hans", issueNumber: 3290, issuePrLabel: "zh-hans/", checklistTag: "zh-Hans", leadUsername: "tc-huang" },
];

const UI_LANGUAGES = ["ko", "en", "zh-hant", "zh-hans"];
const DATA_LANGUAGE_STORAGE_KEY = "lerobot-tracker-data-language";
const UI_LANGUAGE_STORAGE_KEY = "lerobot-tracker-ui-language";

function getStoredLanguage(key: string, fallback: string, supported: string[]) {
  if (typeof window === "undefined") return fallback;
  const stored = window.localStorage.getItem(key);
  return stored && supported.includes(stored) ? stored : fallback;
}

interface LanguageContextType {
  lang: LangConfig;
  setLangCode: (code: string) => void;
  uiLang: string;
  setUiLang: (code: string) => void;
  toggleUiLang: () => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: LANGUAGES[0],
  setLangCode: () => {},
  uiLang: "ko",
  setUiLang: () => {},
  toggleUiLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [langCode, setLangCodeState] = useState(() =>
    getStoredLanguage(DATA_LANGUAGE_STORAGE_KEY, "ko", LANGUAGES.map((l) => l.code))
  );
  const [uiLang, setUiLangState] = useState(() =>
    getStoredLanguage(UI_LANGUAGE_STORAGE_KEY, "ko", UI_LANGUAGES)
  );
  const lang = LANGUAGES.find((l) => l.code === langCode) || LANGUAGES[0];

  useEffect(() => {
    window.localStorage.setItem(DATA_LANGUAGE_STORAGE_KEY, lang.code);
  }, [lang.code]);

  useEffect(() => {
    i18n.changeLanguage(uiLang);
    document.documentElement.lang = uiLang;
    window.localStorage.setItem(UI_LANGUAGE_STORAGE_KEY, uiLang);
  }, [uiLang]);

  // When data language changes, automatically sync UI language
  const setLangCode = (code: string) => {
    setLangCodeState(code);
    // Auto-sync UI language to match data language (if translation exists)
    if (UI_LANGUAGES.includes(code)) {
      setUiLangState(code);
    }
  };

  const setUiLang = (code: string) => {
    setUiLangState(code);
  };

  const toggleUiLang = () => {
    // Cycle through: ko → en → ko (legacy toggle, kept for backward compat)
    const next = uiLang === "ko" ? "en" : "ko";
    setUiLang(next);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLangCode, uiLang, setUiLang, toggleUiLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
