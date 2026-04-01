import { useQuery } from "@tanstack/react-query";
import {
  fetchRepoTree,
  buildTranslationStatus,
  fetchRecentPRs,
  fetchFileCommits,
  fetchIssueChecklist,
  TranslationFileStatus,
  IssueChecklistItem,
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

export function useIssueChecklist() {
  return useQuery({
    queryKey: ["github-issue-checklist"],
    queryFn: () => fetchIssueChecklist(3058),
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
  const { data: githubData, isLoading: isLoadingGithub, error: githubError } = useTranslationData();
  const { data: issueData, isLoading: isLoadingIssue, error: issueError } = useIssueChecklist();

  const isLoading = isLoadingGithub || isLoadingIssue;
  const error = githubError || issueError;

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

  if (error && !githubData) {
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

  // Build issue checklist map for quick lookup
  const issueMap = new Map<string, IssueChecklistItem>();
  if (issueData) {
    for (const item of issueData) {
      issueMap.set(item.filename, item);
    }
  }

  // Merge: GitHub file existence + issue checklist info
  const mergedStatuses = statuses.map((s) => {
    const issueItem = issueMap.get(s.filename);

    let status = s.status; // "done" or "pending" from GitHub API
    let assignee: string | undefined;
    let reviewer: string | undefined;
    let pr: string | undefined;
    let section = s.section;

    if (issueItem) {
      // Issue data overrides section name
      if (issueItem.section) section = issueItem.section;
      assignee = issueItem.assignee;
      reviewer = issueItem.reviewer;
      pr = issueItem.pr;

      // 4-stage status:
      // done: [x] checked OR file exists in ko/
      // review: [ ] unchecked, has assignee + has reviewer (🔍@user)
      // translating: [ ] unchecked, has assignee but no reviewer
      // pending: [ ] unchecked, no assignee
      if (s.status === "done" || issueItem.checked) {
        status = "done";
      } else if (issueItem.reviewer) {
        status = "review";
      } else if (issueItem.assignee) {
        status = "translating";
      } else {
        status = "pending";
      }
    }

    return { ...s, status, assignee, reviewer, pr, section };
  });

  const total = mergedStatuses.length;
  const done = mergedStatuses.filter((s) => s.status === "done").length;
  const review = mergedStatuses.filter((s) => s.status === "review").length;
  const translating = mergedStatuses.filter((s) => s.status === "translating").length;
  const pending = mergedStatuses.filter((s) => s.status === "pending").length;

  // Group by section from issue checklist (preferred) or directory
  const sectionOrder = [
    "Get Started", "Tutorials", "Datasets", "Policies", "Reward Models",
    "Inference", "Simulation", "Robot Processors", "Robots",
    "Teleoperators", "Sensors", "Supported Hardware", "Resources", "About",
  ];

  const koLabels: Record<string, string> = {
    "Get Started": "시작하기",
    "Tutorials": "튜토리얼",
    "Datasets": "데이터셋",
    "Policies": "정책",
    "Reward Models": "보상 모델",
    "Inference": "추론",
    "Simulation": "시뮬레이션",
    "Robot Processors": "로봇 프로세서",
    "Robots": "로봇",
    "Teleoperators": "텔레오퍼레이터",
    "Sensors": "센서",
    "Supported Hardware": "지원 하드웨어",
    "Resources": "리소스",
    "About": "소개",
    "root": "기타",
  };

  const sectionMap = new Map<string, typeof mergedStatuses>();
  for (const s of mergedStatuses) {
    const key = s.section;
    const existing = sectionMap.get(key) || [];
    existing.push(s);
    sectionMap.set(key, existing);
  }

  // Sort sections by predefined order
  const sectionStats = Array.from(sectionMap.entries())
    .sort((a, b) => {
      const idxA = sectionOrder.indexOf(a[0]);
      const idxB = sectionOrder.indexOf(b[0]);
      return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
    })
    .map(([name, files]) => ({
      name,
      nameKo: koLabels[name] || name,
      total: files.length,
      done: files.filter((f) => f.status === "done").length,
      review: files.filter((f) => f.status === "review").length,
      translating: files.filter((f) => f.status === "translating").length,
      pending: files.filter((f) => f.status === "pending").length,
      files: files.map((f) => ({
        filename: f.filename,
        title: (issueMap.get(f.filename)?.title) || f.filename.replace(/\.mdx$/, "").split("/").pop() || f.filename,
        status: f.status as "done" | "review" | "translating" | "pending",
        assignee: (f as any).assignee,
        reviewer: (f as any).reviewer,
        pr: (f as any).pr,
        enPath: f.enPath,
        koPath: f.koPath,
      })),
    }));

  return {
    stats: { total, done, review, translating, pending },
    sectionStats,
    isLoading,
    error,
    isLive: true,
    rawStatuses: mergedStatuses,
  };
}
