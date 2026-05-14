import { useRecentPRs } from "@/hooks/useGithubData";
import { GitPullRequest, ExternalLink, Pin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import { getDateLocale, getPullRequestStateLabel } from "@/lib/localization";

export default function ActivityTimeline() {
  const { data: prs, isLoading } = useRecentPRs();
  const { lang, uiLang } = useLanguage();
  const { t } = useTranslation();

  const items = prs && prs.length > 0 ? prs : [];

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">{t("activity.title")}</h3>

      {/* Pinned issue link */}
      <a
        href={`https://github.com/huggingface/lerobot/issues/${lang.issueNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-start gap-3 group hover:bg-primary/5 rounded-md p-2 -mx-1.5 mb-3 border border-primary/20 bg-primary/5 transition-colors"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 shrink-0 mt-0.5">
          <Pin className="h-3.5 w-3.5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-foreground font-medium truncate group-hover:text-primary transition-colors">
            {t("activity.issueTitle", { issueNumber: lang.issueNumber, language: lang.label })}
          </p>
          <p className="text-xs text-muted-foreground">
            {t("activity.issueTracking")}
          </p>
        </div>
        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
      </a>

      {/* PR list */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
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
        <p className="text-sm text-muted-foreground">{t("activity.noPRs")}</p>
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
                  @{pr.author} • {new Date(pr.date).toLocaleDateString(getDateLocale(uiLang))}
                  {pr.state === "merged" && <span className="ml-1 text-status-done">{getPullRequestStateLabel(t, pr.state)}</span>}
                  {pr.state === "open" && <span className="ml-1 text-status-progress">{getPullRequestStateLabel(t, pr.state)}</span>}
                  {pr.state === "closed" && <span className="ml-1 text-muted-foreground">{getPullRequestStateLabel(t, pr.state)}</span>}
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
