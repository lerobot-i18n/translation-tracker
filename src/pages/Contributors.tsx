import { ExternalLink, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useIssueChecklist } from "@/hooks/useGithubData";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";

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
  const { lang } = useLanguage();
  const { t } = useTranslation();
  const {
    data: issueData,
    error,
    isError,
    isLoading: isLoadingIssue,
    refetch,
  } = useIssueChecklist();

  const isLoading = isLoadingIssue;

  // Build contributors from issue checklist data
  // Filter by language tag if the current language has checklistTag (zh-Hant or zh-Hans)
  const contributorMap = new Map<string, Contributor>();

  if (issueData) {
    for (const item of issueData) {
      if (!item.assignee) continue;

      // Filter by language tag for zh-Hant / zh-Hans separation
      if (lang.checklistTag) {
        if (!item.langTags || !item.langTags.some((t) => t.toLowerCase() === lang.checklistTag!.toLowerCase())) {
          continue;
        }
      }

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

  // Determine roles: Issue author = Lead Translator, others by contribution count
  for (const [, contributor] of contributorMap) {
    const total = contributor.completedFiles.length + contributor.inProgressFiles.length;
    if (contributor.username.toLowerCase() === lang.leadUsername.toLowerCase()) {
      contributor.role = "Lead Translator";
    } else if (total >= 3 || contributor.completedFiles.length > 0) {
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
          {t("contributors.title")}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {t("contributors.subtitle", { flag: lang.flag, language: lang.label })}
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">{t("contributors.loading")}</span>
        </div>
      ) : isError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center">
          <p className="text-sm font-medium text-foreground">{t("contributors.loadError")}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {error instanceof Error ? error.message : t("dashboard.unknownError")}
          </p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => refetch()}>
            {t("dashboard.retry")}
          </Button>
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {t("contributors.empty")}
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
                  <span>{t("contributors.completed")}: <strong className="text-foreground">{c.completedFiles.length}</strong></span>
                  <span>{t("contributors.inProgress")}: <strong className="text-foreground">{c.inProgressFiles.length}</strong></span>
                </div>

                {/* Completed files */}
                {c.completedFiles.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1.5">
                      {t("contributors.completedList", { count: c.completedFiles.length })}
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
                      {t("contributors.inProgressList", { count: c.inProgressFiles.length })}
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
          {t("contributors.ctaTitle")}
        </p>
        <p className="text-sm text-muted-foreground mb-3">
          {t("contributors.ctaDesc")}
        </p>
        <a
          href={`https://github.com/huggingface/lerobot/issues/${lang.issueNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          {t("contributors.issueCta", { issueNumber: lang.issueNumber })}
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
