import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, AlertTriangle, CheckCircle2, Clock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sections } from "@/data/translationData";
import { useFileCommits } from "@/hooks/useGithubData";
import { getGitHubFileUrl } from "@/services/githubApi";
import StatusBadge from "@/components/StatusBadge";

export default function FileDetail() {
  const { filename } = useParams<{ filename: string }>();
  const decodedFilename = decodeURIComponent(filename || "");

  // Find file in static data
  let foundFile = null;
  let foundSection = null;
  for (const section of sections) {
    const file = section.files.find((f) => f.filename === decodedFilename);
    if (file) {
      foundFile = file;
      foundSection = section;
      break;
    }
  }

  const enPath = `docs/source/${decodedFilename}`;
  const koPath = `docs/source/ko/${decodedFilename}`;

  const { data: enCommits, isLoading: enLoading } = useFileCommits(enPath);
  const { data: koCommits, isLoading: koLoading } = useFileCommits(
    foundFile?.status === "done" ? koPath : undefined
  );

  const enLastDate = enCommits?.[0]?.date;
  const koLastDate = koCommits?.[0]?.date;
  const isOutdated = enLastDate && koLastDate && new Date(enLastDate) > new Date(koLastDate);

  if (!foundFile) {
    return (
      <div className="space-y-4">
        <Link to="/" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> 대시보드로 돌아가기
        </Link>
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-foreground font-medium">파일을 찾을 수 없습니다</p>
          <p className="text-sm text-muted-foreground mt-1">{decodedFilename}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Link to="/" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> 대시보드로 돌아가기
      </Link>

      {/* Header */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-foreground">{foundFile.title}</h1>
            <p className="text-sm text-muted-foreground font-mono mt-1">{foundFile.filename}</p>
            {foundSection && (
              <p className="text-xs text-muted-foreground mt-1">
                섹션: {foundSection.name} ({foundSection.nameKo})
              </p>
            )}
          </div>
          <StatusBadge status={foundFile.status} />
        </div>

        {isOutdated && (
          <div className="flex items-center gap-2 p-3 rounded-md bg-status-progress/10 border border-status-progress/30 mb-4">
            <AlertTriangle className="h-4 w-4 text-status-progress shrink-0" />
            <p className="text-sm text-foreground">
              ⚠️ <strong>업데이트 필요</strong> — 원본이 번역보다 최근에 수정되었습니다.
            </p>
          </div>
        )}

        {/* Links */}
        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          <a
            href={getGitHubFileUrl(enPath)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 rounded-md border border-border hover:bg-muted/50 transition-colors"
          >
            <FileText className="h-4 w-4 text-primary" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">영문 원본</p>
              <p className="text-xs text-muted-foreground truncate">{enPath}</p>
            </div>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
          </a>
          {foundFile.status === "done" ? (
            <a
              href={getGitHubFileUrl(koPath)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 rounded-md border border-border hover:bg-muted/50 transition-colors"
            >
              <FileText className="h-4 w-4 text-status-done" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">한국어 번역</p>
                <p className="text-xs text-muted-foreground truncate">{koPath}</p>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
            </a>
          ) : (
            <div className="flex items-center gap-2 p-3 rounded-md border border-border border-dashed opacity-60">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">한국어 번역</p>
                <p className="text-xs text-muted-foreground">아직 번역되지 않았습니다</p>
              </div>
            </div>
          )}
        </div>

        {/* Commit info */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">수정 이력</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-md bg-muted/30">
              <p className="text-xs text-muted-foreground mb-1">영문 원본 최종 수정</p>
              {enLoading ? (
                <div className="h-4 bg-muted rounded w-32 animate-pulse" />
              ) : enLastDate ? (
                <p className="text-sm font-medium text-foreground">
                  {new Date(enLastDate).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">정보 없음</p>
              )}
            </div>
            <div className="p-3 rounded-md bg-muted/30">
              <p className="text-xs text-muted-foreground mb-1">한국어 번역 최종 수정</p>
              {koLoading ? (
                <div className="h-4 bg-muted rounded w-32 animate-pulse" />
              ) : koLastDate ? (
                <p className="text-sm font-medium text-foreground">
                  {new Date(koLastDate).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">{foundFile.status === "done" ? "정보 없음" : "-"}</p>
              )}
            </div>
          </div>

          {/* Recent commits */}
          {enCommits && enCommits.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-muted-foreground mb-2">최근 커밋 (영문 원본)</p>
              <div className="space-y-1.5">
                {enCommits.slice(0, 3).map((c) => (
                  <div key={c.sha} className="flex items-center gap-2 text-xs">
                    <code className="text-muted-foreground">{c.sha.slice(0, 7)}</code>
                    <span className="text-foreground truncate flex-1">{c.message}</span>
                    <span className="text-muted-foreground shrink-0">
                      {new Date(c.date).toLocaleDateString("ko-KR")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Assignee & PR */}
        {(foundFile.assignee || foundFile.pr) && (
          <div className="mt-4 pt-4 border-t border-border flex items-center gap-4 text-sm">
            {foundFile.assignee && (
              <span className="text-muted-foreground">
                담당자: <strong className="text-foreground">{foundFile.assignee}</strong>
              </span>
            )}
            {foundFile.pr && (
              <a
                href={`https://github.com/huggingface/lerobot/pull/${foundFile.pr.replace("#", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                PR {foundFile.pr}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
