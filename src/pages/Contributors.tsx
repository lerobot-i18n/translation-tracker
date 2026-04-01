import { ExternalLink, Calendar, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useMergedTranslationData, useIssueChecklist } from "@/hooks/useGithubData";

interface Contributor {
  username: string;
  avatar: string;
  role: "Lead Translator" | "Translator" | "Contributor";
  completedFiles: string[];
  inProgressFiles: string[];
}

const roleBadgeClass: Record<string, string> = {
  "Lead Translator": "bg-primary/20 text-primary border-primary/30",
  Translator: "bg-status-done/20 text-status-done border-status-done/30",
  Contributor: "bg-accent text-accent-foreground border-border",
};

export default function Contributors() {
  const { isLoading: isLoadingData } = useMergedTranslationData();
  const { data: issueData, isLoading: isLoadingIssue } = useIssueChecklist();

  const isLoading = isLoadingData || isLoadingIssue;

  // Build contributors from issue checklist data
  const contributorMap = new Map<string, Contributor>();

  if (issueData) {
    for (const item of issueData) {
      if (!item.assignee) continue;
      const username = item.assignee.replace("@", "");

      if (!contributorMap.has(username)) {
        contributorMap.set(username, {
          username,
          avatar: `https://github.com/${username}.png`,
          role: "Contributor",
          completedFiles: [],
          inProgressFiles: [],
        });
      }

      const contributor = contributorMap.get(username)!;
      if (item.checked) {
        contributor.completedFiles.push(item.filename);
      } else {
        contributor.inProgressFiles.push(item.filename);
      }
    }
  }

  // Determine roles based on contribution count
  for (const [, contributor] of contributorMap) {
    const total = contributor.completedFiles.length + contributor.inProgressFiles.length;
    if (total >= 5) {
      contributor.role = "Lead Translator";
    } else if (contributor.completedFiles.length > 0) {
      contributor.role = "Translator";
    }
  }

  const sorted = Array.from(contributorMap.values()).sort(
    (a, b) => (b.completedFiles.length + b.inProgressFiles.length) - (a.completedFiles.length + a.inProgressFiles.length)
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-foreground">
          👥 참여자 (Contributors)
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          LeRobot 한국어 번역에 기여한 분들입니다
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">참여자 정보를 불러오는 중...</span>
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          아직 참여자가 없습니다
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {sorted.map((c) => (
            <Card key={c.username}>
              <CardContent className="p-5 space-y-4">
                {/* Profile */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-border">
                    <AvatarImage src={c.avatar} alt={c.username} />
                    <AvatarFallback>{c.username[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <a
                      href={`https://github.com/${c.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                    >
                      @{c.username}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    <div className="mt-1">
                      <Badge
                        variant="outline"
                        className={roleBadgeClass[c.role] || ""}
                      >
                        {c.role}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span>번역 완료: <strong className="text-foreground">{c.completedFiles.length}</strong></span>
                  <span>진행 중: <strong className="text-foreground">{c.inProgressFiles.length}</strong></span>
                </div>

                {/* Completed files */}
                {c.completedFiles.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1.5">
                      번역 완료 ({c.completedFiles.length}개):
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {c.completedFiles.map((f) => (
                        <span
                          key={f}
                          className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-status-done/10 text-status-done"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* In progress files */}
                {c.inProgressFiles.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1.5">
                      진행 중 ({c.inProgressFiles.length}개):
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {c.inProgressFiles.map((f) => (
                        <span
                          key={f}
                          className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-status-progress/10 text-status-progress"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Call to action */}
      <div className="rounded-lg border border-dashed border-primary/40 bg-primary/5 p-6 text-center">
        <p className="text-foreground font-medium mb-1">
          번역에 참여하고 싶으신가요?
        </p>
        <p className="text-sm text-muted-foreground mb-3">
          기여 가이드를 확인하고 미번역 파일을 선택하세요!
        </p>
        <a
          href="https://github.com/huggingface/lerobot/issues/3058"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          Issue #3058에서 참여하기
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
