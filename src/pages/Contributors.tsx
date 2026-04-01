import { Trophy, GitPullRequest, ExternalLink } from "lucide-react";
import { sections } from "@/data/translationData";

interface Contributor {
  username: string;
  avatar: string;
  role?: string;
  files: string[];
  completedCount: number;
}

function getContributors(): Contributor[] {
  const contributorMap = new Map<string, string[]>();

  for (const section of sections) {
    for (const file of section.files) {
      if (file.assignee && file.status === "done") {
        const username = file.assignee.replace("@", "");
        const existing = contributorMap.get(username) || [];
        existing.push(file.filename);
        contributorMap.set(username, existing);
      }
    }
  }

  const contributors: Contributor[] = [];

  // Add known contributors
  contributors.push({
    username: "1wos",
    avatar: "https://github.com/1wos.png",
    role: "Lead Translator",
    files: contributorMap.get("1wos") || [],
    completedCount: contributorMap.get("1wos")?.length || 6,
  });

  contributors.push({
    username: "jahabe",
    avatar: "https://github.com/jahabe.png",
    role: "Contributor",
    files: [],
    completedCount: 0,
  });

  return contributors.sort((a, b) => b.completedCount - a.completedCount);
}

const medals = ["🥇", "🥈", "🥉"];

export default function Contributors() {
  const contributors = getContributors();
  const leaderboard = contributors.filter((c) => c.completedCount > 0);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-foreground">👥 참여자 (Contributors)</h2>
        <p className="text-sm text-muted-foreground mt-1">LeRobot 한국어 번역에 기여한 분들입니다</p>
      </div>

      {/* Leaderboard */}
      {leaderboard.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">리더보드</h3>
          </div>
          <div className="space-y-2">
            {leaderboard.map((c, i) => (
              <div
                key={c.username}
                className={`flex items-center gap-3 p-3 rounded-md ${
                  i === 0 ? "bg-primary/5 border border-primary/20" : "bg-muted/30"
                }`}
              >
                <span className="text-xl w-8 text-center">{medals[i] || `${i + 1}`}</span>
                <img
                  src={c.avatar}
                  alt={c.username}
                  className="h-8 w-8 rounded-full border border-border"
                />
                <div className="flex-1">
                  <a
                    href={`https://github.com/${c.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    @{c.username}
                  </a>
                  {c.role && (
                    <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                      {c.role}
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-foreground">{c.completedCount}</p>
                  <p className="text-[10px] text-muted-foreground">번역 완료</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contributor Cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        {contributors.map((c) => (
          <div key={c.username} className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center gap-3 mb-3">
              <img
                src={c.avatar}
                alt={c.username}
                className="h-12 w-12 rounded-full border-2 border-border"
              />
              <div>
                <a
                  href={`https://github.com/${c.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  @{c.username}
                  <ExternalLink className="h-3 w-3" />
                </a>
                {c.role && (
                  <p className="text-xs text-primary mt-0.5">{c.role}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm mb-3">
              <GitPullRequest className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                번역 완료: <strong className="text-foreground">{c.completedCount}개</strong>
              </span>
            </div>

            {c.files.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-1.5">담당 파일:</p>
                <div className="flex flex-wrap gap-1">
                  {c.files.map((f) => (
                    <span
                      key={f}
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Call to action */}
      <div className="rounded-lg border border-dashed border-primary/40 bg-primary/5 p-6 text-center">
        <p className="text-foreground font-medium mb-1">번역에 참여하고 싶으신가요?</p>
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
