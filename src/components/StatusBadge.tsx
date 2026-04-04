export type TranslationStatus = "done" | "outdated" | "review" | "translating" | "requested" | "pending";

const config: Record<TranslationStatus, { label: string; bg: string; text: string }> = {
  done: { label: "완료", bg: "bg-status-done/15", text: "text-status-done" },
  outdated: { label: "업데이트 필요", bg: "bg-destructive/15", text: "text-destructive" },
  review: { label: "검수중", bg: "bg-status-review/15", text: "text-status-review" },
  translating: { label: "번역중", bg: "bg-status-progress/15", text: "text-status-progress" },
  requested: { label: "번역 신청", bg: "bg-status-requested/15", text: "text-status-requested" },
  pending: { label: "미번역", bg: "bg-status-pending/15", text: "text-status-pending" },
};

export default function StatusBadge({ status }: { status: TranslationStatus }) {
  const c = config[status] || config.pending;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}
