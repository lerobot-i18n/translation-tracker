export type TranslationStatus = "done" | "review" | "translating" | "pending";

const config: Record<TranslationStatus, { label: string; bg: string; text: string }> = {
  done: { label: "완료", bg: "bg-status-done", text: "text-status-done-foreground" },
  review: { label: "검수중", bg: "bg-blue-500/15", text: "text-blue-500" },
  translating: { label: "번역중", bg: "bg-status-progress", text: "text-status-progress-foreground" },
  pending: { label: "미번역", bg: "bg-status-pending", text: "text-status-pending-foreground" },
};

export default function StatusBadge({ status }: { status: TranslationStatus }) {
  const c = config[status] || config.pending;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}
