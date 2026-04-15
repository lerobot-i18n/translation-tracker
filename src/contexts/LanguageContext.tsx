import { createContext, useContext, useState, ReactNode } from "react";
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
  const [langCode, setLangCodeState] = useState("ko");
  const [uiLang, setUiLangState] = useState("ko");
  const lang = LANGUAGES.find((l) => l.code === langCode) || LANGUAGES[0];

  // When data language changes, automatically sync UI language
  const setLangCode = (code: string) => {
    setLangCodeState(code);
    // Auto-sync UI language to match data language (if translation exists)
    const supportedUiLangs = ["ko", "en", "zh-hant", "zh-hans"];
    if (supportedUiLangs.includes(code)) {
      setUiLangState(code);
      i18n.changeLanguage(code);
    }
  };

  const setUiLang = (code: string) => {
    setUiLangState(code);
    i18n.changeLanguage(code);
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
