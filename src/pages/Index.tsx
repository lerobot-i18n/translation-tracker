import { FileText, CheckCircle2, Clock, CircleDashed, RefreshCw, Wifi, WifiOff, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMergedTranslationData } from "@/hooks/useGithubData";
import { useQueryClient } from "@tanstack/react-query";
import OverviewCharts from "@/components/OverviewCharts";
import SectionBarChart from "@/components/SectionBarChart";
import ActivityTimeline from "@/components/ActivityTimeline";
import TranslationTable from "@/components/TranslationTable";

export default function Index() {
  const { stats, sectionStats, isLoading, error, isLive } = useMergedTranslationData();
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    localStorage.removeItem("lerobot-github-data");
    localStorage.removeItem("lerobot-recent-prs");
    queryClient.invalidateQueries({ queryKey: ["github-translation-data"] });
    queryClient.invalidateQueries({ queryKey: ["github-recent-prs"] });
  };

  const statCards = [
    { label: "전체 파일", value: stats.total, icon: FileText, className: "text-foreground" },
    { label: "번역 완료", value: stats.done, icon: CheckCircle2, className: "text-status-done" },
    { label: "진행 중", value: stats.progress, icon: Clock, className: "text-status-progress" },
    { label: "미번역", value: stats.pending, icon: CircleDashed, className: "text-muted-foreground" },
  ];

  const pct = stats.total > 0 ? Math.round((stats.done / stats.total) * 1000) / 10 : 0;

  return (
    <div className="space-y-6">
      {/* Header with progress */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">번역 현황 대시보드</h2>
            <p className="text-sm text-muted-foreground">LeRobot 문서 한국어 번역 진행 상황</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              {isLive ? (
                <><Wifi className="h-3 w-3 text-status-done" /> Live</>
              ) : isLoading ? (
                <><Loader2 className="h-3 w-3 animate-spin" /> 로딩 중...</>
              ) : (
                <><WifiOff className="h-3 w-3" /> Offline</>
              )}
            </span>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={`h-3.5 w-3.5 mr-1 ${isLoading ? "animate-spin" : ""}`} />
              새로고침
            </Button>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/30 text-sm">
            <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
            <p className="text-foreground">
              GitHub API 오류: {error instanceof Error ? error.message : "알 수 없는 오류"}
            </p>
            <Button variant="outline" size="sm" className="ml-auto shrink-0" onClick={handleRefresh}>
              재시도
            </Button>
          </div>
        )}

        {/* Global progress bar */}
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="font-medium text-foreground">전체 진행률</span>
            <span className="font-semibold text-primary">{stats.done}/{stats.total} ({pct}%)</span>
          </div>
          <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Loading skeleton */}
      {isLoading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-lg border border-border bg-card p-4 animate-pulse">
                <div className="h-8 bg-muted rounded w-16 mb-2" />
                <div className="h-3 bg-muted rounded w-20" />
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg border border-border bg-card p-5 h-48 animate-pulse">
                <div className="h-4 bg-muted rounded w-24 mb-4" />
                <div className="h-24 bg-muted rounded" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {statCards.map((c) => (
              <div key={c.label} className="rounded-lg border border-border bg-card p-4 flex items-center gap-3">
                <c.icon className={`h-7 w-7 ${c.className} shrink-0`} />
                <div>
                  <p className="text-2xl font-bold text-foreground">{c.value}</p>
                  <p className="text-xs text-muted-foreground">{c.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid md:grid-cols-3 gap-4">
            <OverviewCharts
              done={stats.done}
              progress={stats.progress}
              pending={stats.pending}
              total={stats.total}
            />
            <SectionBarChart sections={sectionStats} />
            <ActivityTimeline />
          </div>

          {/* Translation Table */}
          <TranslationTable sections={sectionStats} />
        </>
      )}
    </div>
  );
}
