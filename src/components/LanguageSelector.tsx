import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe } from "lucide-react";

const languages = [
  { code: "ko", label: "Korean (한국어)", active: true },
  { code: "zh", label: "Chinese (中文)", active: false },
  { code: "ja", label: "Japanese (日本語)", active: false },
  { code: "fr", label: "French (Français)", active: false },
];

export default function LanguageSelector() {
  return (
    <Select defaultValue="ko">
      <SelectTrigger className="h-8 w-[140px] text-xs">
        <Globe className="h-3.5 w-3.5 mr-1" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code} disabled={!lang.active}>
            <span className="flex items-center gap-1.5">
              {lang.label}
              {!lang.active && <span className="text-[10px] text-muted-foreground ml-1">Coming Soon</span>}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
