import { FileText, CheckCircle2, Clock, CircleDashed } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getStats } from "@/data/translationData";

export default function StatsCards() {
  const { t } = useTranslation();
  const stats = getStats();

  const cards = [
    { label: t("dashboard.totalFilesShort"), key: "total" as const, icon: FileText, className: "text-foreground" },
    { label: t("dashboard.done"), key: "done" as const, icon: CheckCircle2, className: "text-status-done" },
    { label: t("dashboard.inProgress"), key: "progress" as const, icon: Clock, className: "text-status-progress" },
    { label: t("dashboard.pending"), key: "pending" as const, icon: CircleDashed, className: "text-muted-foreground" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div key={c.key} className="rounded-lg border border-border bg-card p-4 flex items-center gap-3">
          <c.icon className={`h-8 w-8 ${c.className} shrink-0`} />
          <div>
            <p className="text-2xl font-bold text-foreground">{stats[c.key]}</p>
            <p className="text-xs text-muted-foreground">{c.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
