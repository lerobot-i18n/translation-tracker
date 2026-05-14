import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LANGUAGES, useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";

export default function LanguageSelector() {
  const { lang, setLangCode, uiLang, setUiLang } = useLanguage();
  const { t } = useTranslation();
  const isEn = uiLang === "en";

  const toggleEn = () => {
    setUiLang(isEn ? lang.code : "en");
  };

  return (
    <div className="flex items-center gap-1.5">
      <Select value={lang.code} onValueChange={setLangCode}>
        <SelectTrigger className="h-8 w-[170px] text-xs">
          <SelectValue>
            <span className="flex items-center gap-1.5">
              <span className="text-base leading-none">{lang.flag}</span>
              <span>{lang.label}</span>
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {LANGUAGES.map((l) => (
            <SelectItem key={l.code} value={l.code}>
              <span className="flex items-center gap-1.5">
                <span className="text-base leading-none">{l.flag}</span>
                <span>{l.label}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <button
        type="button"
        onClick={toggleEn}
        aria-pressed={isEn}
        aria-label={isEn ? t("language.switchToNative") : t("language.switchToEnglish")}
        title={isEn ? t("language.switchToNative") : t("language.switchToEnglish")}
        className={`h-8 px-2.5 rounded-md border text-xs font-semibold transition-colors ${
          isEn
            ? "bg-primary text-primary-foreground border-primary"
            : "bg-background text-foreground border-border hover:bg-muted"
        }`}
      >
        EN
      </button>
    </div>
  );
}
