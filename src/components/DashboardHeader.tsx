import { ExternalLink, Github, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { getStats } from "@/data/translationData";
import logoImg from "@/assets/lerobot-logo.png";
import { useEffect, useState } from "react";

export default function DashboardHeader() {
  const { t } = useTranslation();
  const { total, done } = getStats();
  const pct = Math.round((done / total) * 1000) / 10;
  const [dark, setDark] = useState(() =>
    typeof window !== "undefined" && document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="LeRobot" className="h-10 rounded-md" />
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                Korean Translation Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">{t("dashboard.headerSubtitle")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" size="sm" asChild>
              <a href="https://github.com/huggingface/lerobot/issues/3058" target="_blank" rel="noopener noreferrer">
                <Github className="mr-1.5 h-4 w-4" />
                Issue #3058
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="https://github.com/huggingface/lerobot/pull/3126" target="_blank" rel="noopener noreferrer">
                <Github className="mr-1.5 h-4 w-4" />
                PR #3126
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDark(!dark)}>
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="font-medium text-foreground">{t("dashboard.overallProgress")}</span>
            <span className="font-semibold text-primary">{done}/{total} ({pct}%)</span>
          </div>
          <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary animate-progress-fill"
              style={{ "--progress-width": `${pct}%` } as React.CSSProperties}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
