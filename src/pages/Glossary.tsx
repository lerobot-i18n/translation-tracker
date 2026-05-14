import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { glossary as glossaryData } from "@/data/translationData";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import { getGlossaryTermTranslation } from "@/lib/localization";

const categories = [
  { value: "all", labelKey: "glossary.categoryAll" },
  { value: "ml", labelKey: "glossary.categoryMl" },
  { value: "robotics", labelKey: "glossary.categoryRobotics" },
  { value: "lerobot", labelKey: "glossary.categoryLerobot" },
  { value: "simulation", labelKey: "glossary.categorySimulation" },
  { value: "camera", labelKey: "glossary.categoryCamera" },
];

const categoryColors: Record<string, string> = {
  ml: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  robotics: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  lerobot: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  simulation: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  camera: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
};

export default function Glossary() {
  const { lang } = useLanguage();
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const showKoreanNotes = lang.code === "ko";

  const getTermTranslation = (term: (typeof glossaryData)[number]) =>
    getGlossaryTermTranslation(term, lang.code);

  const filtered = glossaryData.filter((term) => {
    const localizedTranslation = getTermTranslation(term);
    const matchSearch =
      term.en.toLowerCase().includes(search.toLowerCase()) ||
      localizedTranslation.toLowerCase().includes(search.toLowerCase()) ||
      term.ko.includes(search);
    const matchCategory = category === "all" || term.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-foreground">{t("glossary.title")}</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {t("glossary.subtitle")}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("glossary.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <Filter className="h-4 w-4 mr-1" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.value} value={c.value}>{t(c.labelKey)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <p className="text-xs text-muted-foreground">{t("glossary.resultCount", { count: filtered.length })}</p>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/30">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">{t("glossary.english")}</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">{t("glossary.translation")}</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden sm:table-cell">{t("glossary.category")}</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">{t("glossary.note")}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((g) => (
                <tr key={g.en} className="border-t border-border hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-2.5 font-medium text-foreground">{g.en}</td>
                  <td className="px-4 py-2.5 text-foreground">{getTermTranslation(g)}</td>
                  <td className="px-4 py-2.5 hidden sm:table-cell">
                    <span className={`inline-flex text-[10px] px-2 py-0.5 rounded-full font-medium ${categoryColors[g.category] || ""}`}>
                      {t(categories.find((c) => c.value === g.category)?.labelKey || "glossary.categoryAll")}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground hidden md:table-cell">{showKoreanNotes ? g.note || "" : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Translation guide link */}
      <div className="rounded-lg border border-primary/30 bg-primary/5 p-5">
        <p className="text-sm text-foreground font-medium mb-1">{t("glossary.guideTitle")}</p>
        <p className="text-xs text-muted-foreground mb-2">
          {t("glossary.guideDesc")}
        </p>
        <a
          href="https://github.com/lerobot-i18n/translation-tracker/blob/main/docs/TRANSLATION_GUIDE_KO.md"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
        >
          {t("glossary.guideLink")}
        </a>
      </div>

      {/* Community note */}
      <div className="rounded-lg border border-dashed border-border bg-muted/20 p-5">
        <p className="text-sm text-foreground font-medium mb-1">{t("glossary.suggestTitle")}</p>
        <p className="text-xs text-muted-foreground">
          {t("glossary.suggestDesc")}
        </p>
        <a
          href="https://github.com/huggingface/lerobot/issues/3058"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
        >
          {t("glossary.suggestLink")}
        </a>
      </div>
    </div>
  );
}
