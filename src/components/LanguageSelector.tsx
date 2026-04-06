import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe } from "lucide-react";
import { LANGUAGES, useLanguage } from "@/contexts/LanguageContext";

export default function LanguageSelector() {
  const { lang, setLangCode } = useLanguage();

  return (
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
  );
}
