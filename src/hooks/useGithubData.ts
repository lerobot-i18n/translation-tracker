import { useQuery } from "@tanstack/react-query";
import {
  fetchRepoTree,
  buildTranslationStatus,
  fetchRecentPRs,
  fetchFileCommits,
  TranslationFileStatus,
} from "@/services/githubApi";

export function useTranslationData() {
  return useQuery({
    queryKey: ["github-translation-data"],
    queryFn: async () => {
      const { enFiles, koFiles } = await fetchRepoTree();
      const statuses = buildTranslationStatus(enFiles, koFiles);
      return { enFiles, koFiles, statuses };
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

export function useRecentPRs() {
  return useQuery({
    queryKey: ["github-recent-prs"],
    queryFn: fetchRecentPRs,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useFileCommits(path: string | undefined) {
  return useQuery({
    queryKey: ["github-file-commits", path],
    queryFn: () => fetchFileCommits(path!, 5),
    enabled: !!path,
    staleTime: 5 * 60 * 1000,
  });
}

export function useMergedTranslationData() {
  const { data: githubData, isLoading, error } = useTranslationData();

  if (isLoading || !githubData) {
    return {
      stats: { total: 0, done: 0, progress: 0, pending: 0 },
      sectionStats: [],
      isLoading,
      error,
      isLive: false,
      rawStatuses: [],
    };
  }

  if (error) {
    return {
      stats: { total: 0, done: 0, progress: 0, pending: 0 },
      sectionStats: [],
      isLoading: false,
      error,
      isLive: false,
      rawStatuses: [],
    };
  }

  const { statuses } = githubData;
  const total = statuses.length;
  const done = statuses.filter((s) => s.status === "done").length;
  const pending = statuses.filter((s) => s.status === "pending").length;
  const outdated = statuses.filter((s) => s.status === "outdated").length;

  // Group by section (directory)
  const sectionMap = new Map<string, TranslationFileStatus[]>();
  for (const s of statuses) {
    const existing = sectionMap.get(s.section) || [];
    existing.push(s);
    sectionMap.set(s.section, existing);
  }

  // Section name mapping for Korean labels
  const koLabels: Record<string, string> = {
    root: "시작하기",
    tutorials: "튜토리얼",
    datasets: "데이터셋",
    policies: "정책",
    reward_models: "보상 모델",
    inference: "추론",
    simulation: "시뮬레이션",
    robot_processors: "로봇 프로세서",
    robots: "로봇",
    teleoperators: "텔레오퍼레이터",
    sensors: "센서",
    supported_hardware: "지원 하드웨어",
    resources: "리소스",
    about: "소개",
  };

  const sectionStats = Array.from(sectionMap.entries()).map(([name, files]) => ({
    name,
    nameKo: koLabels[name] || name,
    total: files.length,
    done: files.filter((f) => f.status === "done").length,
    progress: files.filter((f) => f.status === "outdated").length,
    pending: files.filter((f) => f.status === "pending").length,
    files: files.map((f) => ({
      filename: f.filename,
      title: f.filename.replace(/\.mdx$/, "").split("/").pop() || f.filename,
      status: f.status === "outdated" ? ("progress" as const) : f.status,
      enPath: f.enPath,
      koPath: f.koPath,
    })),
  }));

  return {
    stats: { total, done, progress: outdated, pending },
    sectionStats,
    isLoading,
    error,
    isLive: true,
    rawStatuses: statuses,
  };
}
