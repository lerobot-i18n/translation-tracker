import StatusBadge, { TranslationStatus } from "./StatusBadge";
import { ChevronDown, FileText } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface FileEntry {
  filename: string;
  title: string;
  status: TranslationStatus;
  assignee?: string;
  reviewer?: string;
  pr?: string;
  volunteerUser?: string;
  volunteerUrl?: string;
  enPath?: string;
  koPath?: string;
}

interface SectionEntry {
  name: string;
  nameKo: string;
  total: number;
  done: number;
  files: FileEntry[];
}

const filterOptions: { value: TranslationStatus | "all"; label: string; className: string }[] = [
  { value: "all", label: "전체", className: "bg-muted text-foreground" },
  { value: "done", label: "완료", className: "bg-status-done/15 text-status-done" },
  { value: "outdated", label: "업데이트 필요", className: "bg-destructive/15 text-destructive" },
  { value: "review", label: "검수중", className: "bg-status-review/15 text-status-review" },
  { value: "translating", label: "번역중", className: "bg-status-progress/15 text-status-progress" },
  { value: "requested", label: "번역 신청", className: "bg-status-requested/15 text-status-requested" },
  { value: "pending", label: "미번역", className: "bg-status-pending/15 text-status-pending" },
];

export default function TranslationTable({ sections }: { sections: SectionEntry[] }) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState<TranslationStatus | "all">("all");

  const toggle = (name: string) =>
    setCollapsed((prev) => ({ ...prev, [name]: !prev[name] }));

  // Count files per status across all sections
  const statusCounts: Record<string, number> = { all: 0 };
  for (const section of sections) {
    for (const file of section.files) {
      statusCounts[file.status] = (statusCounts[file.status] || 0) + 1;
      statusCounts.all++;
    }
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-foreground">📋 섹션별 번역 현황</h2>

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2">
        {filterOptions.map((opt) => {
          const count = statusCounts[opt.value] || 0;
          if (opt.value !== "all" && count === 0) return null;
          const isActive = filter === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                isActive
                  ? `${opt.className} ring-2 ring-primary/30`
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              {opt.label}
              <span className={`text-xs ${isActive ? "" : "text-muted-foreground"}`}>{count}</span>
            </button>
          );
        })}
      </div>

      {sections.map((section) => {
        const filteredFiles = filter === "all"
          ? section.files
          : section.files.filter((f) => f.status === filter);
        if (filteredFiles.length === 0) return null;

        const done = filteredFiles.filter((f) => f.status === "done" || f.status === "outdated").length;
        const total = filteredFiles.length;
        const pct = total > 0 ? Math.round((done / total) * 100) : 0;
        const isOpen = !collapsed[section.name];
        return (
          <div key={section.name} className="rounded-lg border border-border bg-card overflow-hidden">
            <button
              onClick={() => toggle(section.name)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">{section.name}</span>
                <span className="text-sm text-muted-foreground">({section.nameKo})</span>
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                  {done}/{total} ({pct}%)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="hidden sm:block w-20 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                </div>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </div>
            </button>
            {isOpen && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-t border-border bg-muted/30">
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground">파일명</th>
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground hidden sm:table-cell">제목</th>
                      <th className="px-4 py-2 text-center font-medium text-muted-foreground">상태</th>
                      <th className="px-4 py-2 text-center font-medium text-muted-foreground hidden sm:table-cell">담당자</th>
                      <th className="px-4 py-2 text-center font-medium text-muted-foreground hidden sm:table-cell">PR</th>
                      <th className="px-4 py-2 text-center font-medium text-muted-foreground w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFiles.map((file) => {
                      return (
                        <tr key={file.filename} className="border-t border-border hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-2 font-mono text-xs text-foreground">{file.filename}</td>
                          <td className="px-4 py-2 text-foreground hidden sm:table-cell">{file.title}</td>
                          <td className="px-4 py-2 text-center"><StatusBadge status={file.status} /></td>
                          <td className="px-4 py-2 text-center text-muted-foreground hidden sm:table-cell">
                            {file.assignee ? file.assignee : file.volunteerUser ? (
                              <a
                                href={file.volunteerUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-status-requested hover:underline"
                                title="댓글에서 번역 신청"
                              >
                                {file.volunteerUser}
                              </a>
                            ) : "-"}
                          </td>
                          <td className="px-4 py-2 text-center hidden sm:table-cell">
                            {file.pr ? (
                              <a
                                href={`https://github.com/huggingface/lerobot/pull/${file.pr.replace("#", "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                {file.pr}
                              </a>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </td>
                          <td className="px-4 py-2 text-center">
                            <Link
                              to={`/file/${encodeURIComponent(file.filename)}`}
                              className="text-muted-foreground hover:text-primary transition-colors"
                              title="상세 보기"
                            >
                              <FileText className="h-3.5 w-3.5 inline" />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
