import { useQuery } from "@tanstack/react-query";
import {
  fetchRepoTree,
  buildTranslationStatus,
  fetchRecentPRs,
  fetchFileCommits,
  TranslationFileStatus,
} from "@/services/githubApi";
import { sections as fallbackSections, getStats as getFallbackStats } from "@/data/translationData";

export function useTranslationData() {
  return useQuery({
    queryKey: ["github-translation-data"],
    queryFn: async () => {
      const { enFiles, koFiles } = await fetchRepoTree();
      const statuses = buildTranslationStatus(enFiles, koFiles);
      return { enFiles, koFiles, statuses };
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
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

// Merge GitHub live data with our static data for enrichment
export function useMergedTranslationData() {
  const { data: githubData, isLoading, error } = useTranslationData();

  if (isLoading || error || !githubData) {
    // Fallback to static data
    const stats = getFallbackStats();
    const sectionStats = fallbackSections.map((s) => ({
      name: s.name,
      nameKo: s.nameKo,
      total: s.files.length,
      done: s.files.filter((f) => f.status === "done").length,
      progress: s.files.filter((f) => f.status === "progress").length,
      pending: s.files.filter((f) => f.status === "pending").length,
      files: s.files,
    }));
    return { stats, sectionStats, isLoading, error, isLive: false };
  }

  const { statuses } = githubData;
  const total = statuses.length;
  const done = statuses.filter((s) => s.status === "done").length;
  const pending = statuses.filter((s) => s.status === "pending").length;
  const outdated = statuses.filter((s) => s.status === "outdated").length;

  // Group by section
  const sectionMap = new Map<string, TranslationFileStatus[]>();
  for (const s of statuses) {
    const existing = sectionMap.get(s.section) || [];
    existing.push(s);
    sectionMap.set(s.section, existing);
  }

  const sectionStats = Array.from(sectionMap.entries()).map(([name, files]) => ({
    name,
    nameKo: name,
    total: files.length,
    done: files.filter((f) => f.status === "done").length,
    progress: 0,
    pending: files.filter((f) => f.status === "pending").length,
    files: files.map((f) => ({
      filename: f.filename,
      title: f.filename.replace(".mdx", ""),
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
