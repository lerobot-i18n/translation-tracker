import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LANGUAGES, useLanguage } from "@/contexts/LanguageContext";

export default function LanguageSelector() {
  const { lang, setLangCode } = useLanguage();

  return (
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
  );
}
