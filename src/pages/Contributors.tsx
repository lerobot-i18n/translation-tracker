import { ExternalLink, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useMergedTranslationData } from "@/hooks/useGithubData";

interface Contributor {
  username: string;
  avatar: string;
  role: "Lead Translator" | "Translator" | "Reviewer";
  joinedAt: string; // ISO date
}

const contributors: Contributor[] = [
  {
    username: "1wos",
    avatar: "https://github.com/1wos.png",
    role: "Lead Translator",
    joinedAt: "2025-05-01",
  },
  {
    username: "jahabe",
    avatar: "https://github.com/jahabe.png",
    role: "Translator",
    joinedAt: "2025-06-01",
  },
];

const roleBadgeClass: Record<string, string> = {
  "Lead Translator": "bg-primary/15 text-primary border-primary/30",
  Translator: "bg-accent text-accent-foreground border-border",
  Reviewer: "bg-secondary text-secondary-foreground border-border",
};

export default function Contributors() {
  const { rawStatuses } = useMergedTranslationData();

  // Build a map of completed files per contributor (from GitHub live data)
  const completedFilesMap = new Map<string, string[]>();
  // For now, since GitHub API doesn't give us assignee info,
  // we mark files in ko/ as contributed by the lead translator
  const doneFiles = rawStatuses
    .filter((s) => s.status === "done")
    .map((s) => s.filename);

  // Assign known completed files to contributors based on known info
  completedFilesMap.set("1wos", doneFiles);

  const sorted = [...contributors].sort(
    (a, b) => new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime()
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

      <div className="grid sm:grid-cols-2 gap-4">
        {sorted.map((c) => {
          const files = completedFilesMap.get(c.username) || [];
          return (
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

                {/* Join date */}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    참여 시작:{" "}
                    {new Date(c.joinedAt).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>

                {/* Completed files */}
                {files.length > 0 ? (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1.5">
                      번역 완료 ({files.length}개):
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {files.map((f) => (
                        <span
                          key={f}
                          className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">
                    아직 완료된 번역 파일이 없습니다
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

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
