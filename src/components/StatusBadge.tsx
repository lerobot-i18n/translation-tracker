import { useTranslation } from "react-i18next";

export type TranslationStatus = "done" | "outdated" | "review" | "translating" | "requested" | "pending";

const config: Record<TranslationStatus, { key: string; bg: string; text: string }> = {
  done: { key: "status.done", bg: "bg-status-done/15", text: "text-status-done" },
  outdated: { key: "status.outdated", bg: "bg-destructive/15", text: "text-destructive" },
  review: { key: "status.review", bg: "bg-status-review/15", text: "text-status-review" },
  translating: { key: "status.translating", bg: "bg-status-progress/15", text: "text-status-progress" },
  requested: { key: "status.requested", bg: "bg-status-requested/15", text: "text-status-requested" },
  pending: { key: "status.pending", bg: "bg-status-pending/15", text: "text-status-pending" },
};

export default function StatusBadge({ status }: { status: TranslationStatus }) {
  const { t } = useTranslation();
  const c = config[status] || config.pending;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${c.bg} ${c.text}`}>
      {t(c.key)}
    </span>
  );
}
