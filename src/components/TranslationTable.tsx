import { sections } from "@/data/translationData";
import StatusBadge from "./StatusBadge";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function TranslationTable() {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggle = (name: string) =>
    setCollapsed((prev) => ({ ...prev, [name]: !prev[name] }));

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-foreground">📋 섹션별 번역 현황</h2>
      {sections.map((section) => {
        const done = section.files.filter((f) => f.status === "done").length;
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
                <span className="text-xs text-muted-foreground ml-1">
                  {done}/{section.files.length}
                </span>
              </div>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-t border-border bg-muted/30">
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground">파일명</th>
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground hidden sm:table-cell">영문 제목</th>
                      <th className="px-4 py-2 text-center font-medium text-muted-foreground">상태</th>
                      <th className="px-4 py-2 text-center font-medium text-muted-foreground hidden sm:table-cell">담당자</th>
                      <th className="px-4 py-2 text-center font-medium text-muted-foreground hidden sm:table-cell">PR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.files.map((file) => (
                      <tr key={file.filename} className="border-t border-border hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-2 font-mono text-xs text-foreground">{file.filename}</td>
                        <td className="px-4 py-2 text-foreground hidden sm:table-cell">{file.title}</td>
                        <td className="px-4 py-2 text-center"><StatusBadge status={file.status} /></td>
                        <td className="px-4 py-2 text-center text-muted-foreground hidden sm:table-cell">{file.assignee || "-"}</td>
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
                      </tr>
                    ))}
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
