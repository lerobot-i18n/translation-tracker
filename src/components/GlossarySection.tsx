import { useTranslation } from "react-i18next";
import { glossary, styleRules } from "@/data/translationData";

export default function GlossarySection() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-foreground mb-3">{t("glossary.title")}</h2>
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/30">
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">{t("glossary.english")}</th>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">{t("glossary.translation")}</th>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">Note</th>
                </tr>
              </thead>
              <tbody>
                {glossary.map((g) => (
                  <tr key={g.en} className="border-t border-border hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-2 font-medium text-foreground">{g.en}</td>
                    <td className="px-4 py-2 text-foreground">{g.ko}</td>
                    <td className="px-4 py-2 text-xs text-muted-foreground">{g.note || ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-foreground mb-3">📝 Style Rules</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {styleRules.map((rule) => (
            <div key={rule.category} className="rounded-lg border border-border bg-card p-4">
              <p className="font-semibold text-foreground text-sm mb-2">{rule.category}</p>
              <div className="space-y-1.5 text-xs">
                <div className="flex gap-2">
                  <span className="text-status-done shrink-0">✓</span>
                  <span className="text-foreground">{rule.do}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-destructive shrink-0">✗</span>
                  <span className="text-muted-foreground">{rule.avoid}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
