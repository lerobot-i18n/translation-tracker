import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, Languages } from "lucide-react";
import { LANGUAGES, useLanguage } from "@/contexts/LanguageContext";

export default function LanguageSelector() {
  const { lang, setLangCode, uiLang, toggleUiLang } = useLanguage();

  return (
    <div className="flex items-center gap-1.5">
      {/* Data language (ko/zh) */}
      <Select value={lang.code} onValueChange={setLangCode}>
        <SelectTrigger className="h-8 w-[140px] text-xs">
          <Globe className="h-3.5 w-3.5 mr-1" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {LANGUAGES.map((l) => (
            <SelectItem key={l.code} value={l.code}>
              {l.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* UI language toggle (ko/en) */}
      <button
        onClick={toggleUiLang}
        className="h-8 px-2 rounded-md border border-input bg-background text-xs font-medium hover:bg-muted transition-colors"
        title="UI Language"
      >
        {uiLang === "ko" ? "EN" : "KO"}
      </button>
    </div>
  );
}
