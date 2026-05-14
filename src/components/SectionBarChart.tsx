import { useTranslation } from "react-i18next";
import { getBilingualSectionLabel } from "@/lib/localization";

interface SectionStat {
  name: string;
  nameKo: string;
  total: number;
  done: number;
}

export default function SectionBarChart({ sections }: { sections: SectionStat[] }) {
  const { t } = useTranslation();
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">{t("chart.sectionProgress")}</h3>
      <div className="space-y-3">
        {sections.map((s) => {
          const pct = s.total > 0 ? Math.round((s.done / s.total) * 100) : 0;
          const sectionLabel = getBilingualSectionLabel(t, s.name);
          return (
            <div key={s.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-foreground font-medium truncate max-w-[70%]" title={sectionLabel}>
                  {sectionLabel}
                </span>
                <span className="text-muted-foreground shrink-0">
                  {s.done}/{s.total} ({pct}%)
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
