import { useRecentPRs } from "@/hooks/useGithubData";
import { GitPullRequest, ExternalLink } from "lucide-react";

export default function ActivityTimeline() {
  const { data: prs, isLoading } = useRecentPRs();

  // Fallback static data
  const staticActivity = [
    { number: 3126, title: "[i18n-KO] Translate index.mdx", author: "1wos", mergedAt: "2025-01-15", url: "https://github.com/huggingface/lerobot/pull/3126" },
  ];

  const items = prs && prs.length > 0 ? prs : staticActivity;

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">최근 활동</h3>
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex gap-3">
              <div className="w-8 h-8 rounded-full bg-muted" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-muted rounded w-3/4" />
                <div className="h-2.5 bg-muted rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground">최근 번역 활동이 없습니다.</p>
      ) : (
        <div className="space-y-3">
          {items.slice(0, 5).map((pr) => (
            <a
              key={pr.number}
              href={pr.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 group hover:bg-muted/30 rounded-md p-1.5 -mx-1.5 transition-colors"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 shrink-0 mt-0.5">
                <GitPullRequest className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground font-medium truncate group-hover:text-primary transition-colors">
                  #{pr.number} {pr.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  @{pr.author} • {new Date(pr.mergedAt).toLocaleDateString("ko-KR")}
                </p>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
