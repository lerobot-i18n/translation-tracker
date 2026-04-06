import { createContext, useContext, useState, ReactNode } from "react";
import i18n from "@/i18n";

export interface LangConfig {
  code: string;
  label: string;
  dir: string;         // docs/source/{dir}/
  issueNumber: number;
  issuePrLabel: string; // PR title filter keyword
}

export const LANGUAGES: LangConfig[] = [
  { code: "ko", label: "Korean (한국어)", dir: "ko", issueNumber: 3058, issuePrLabel: "ko/" },
  { code: "zh", label: "Chinese (中文)", dir: "zh", issueNumber: 3290, issuePrLabel: "zh/" },
];

interface LanguageContextType {
  lang: LangConfig;
  setLangCode: (code: string) => void;
  uiLang: string;
  toggleUiLang: () => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: LANGUAGES[0],
  setLangCode: () => {},
  uiLang: "ko",
  toggleUiLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [langCode, setLangCode] = useState("ko");
  const [uiLang, setUiLang] = useState("ko");
  const lang = LANGUAGES.find((l) => l.code === langCode) || LANGUAGES[0];

  const toggleUiLang = () => {
    const next = uiLang === "ko" ? "en" : "ko";
    setUiLang(next);
    i18n.changeLanguage(next);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLangCode, uiLang, toggleUiLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
