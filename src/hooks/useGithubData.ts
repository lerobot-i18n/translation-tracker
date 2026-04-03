import { useQuery } from "@tanstack/react-query";
import {
  fetchRepoTree,
  buildTranslationStatus,
  fetchRecentPRs,
  fetchFileCommits,
  fetchIssueChecklist,
  fetchCommentVolunteers,
  fetchToctree,
  IssueChecklistItem,
  CommentVolunteer,
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

export function useToctree() {
  return useQuery({
    queryKey: ["github-toctree"],
    queryFn: () => fetchToctree(),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

export function useCommentVolunteers() {
  return useQuery({
    queryKey: ["github-comment-volunteers"],
    queryFn: () => fetchCommentVolunteers(3058),
    staleTime: 5 * 60 * 1000,
    retry: 2,
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

// Merged hook: combines GitHub tree data with issue checklist + comment volunteers
export function useMergedTranslationData() {
  const translationQuery = useTranslationData();
  const issueQuery = useIssueChecklist();
  const volunteerQuery = useCommentVolunteers();
  const toctreeQuery = useToctree();

  const { data: githubData, isLoading: isLoadingGithub, error: githubError } = translationQuery;
  const { data: issueData, isLoading: isLoadingIssue, error: issueError } = issueQuery;
  const { data: volunteerData } = volunteerQuery;
  const { data: toctreeData } = toctreeQuery;

  const isLoading = isLoadingGithub || isLoadingIssue;
  const error = githubError || issueError;

  if (isLoading || !githubData) {
    return {
      stats: { total: 0, done: 0, progress: 0, requested: 0, pending: 0 },
      sectionStats: [],
      isLoading,
      error,
      isLive: false,
      rawStatuses: [],
    };
  }

  if (error && !githubData) {
    return {
      stats: { total: 0, done: 0, progress: 0, requested: 0, pending: 0 },
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

  // Build comment volunteer map for quick lookup
  const volunteerMap = new Map<string, CommentVolunteer>();
  if (volunteerData) {
    for (const v of volunteerData) {
      volunteerMap.set(v.filename, v);
    }
  }

  // Build toctree map: filename → section title
  const toctreeMap = new Map<string, string>();
  if (toctreeData) {
    for (const sec of toctreeData) {
      for (const file of sec.files) {
        toctreeMap.set(file, sec.title);
      }
    }
  }

  // Merge: GitHub file existence + issue checklist info + comment volunteers
  const mergedStatuses = statuses.map((s) => {
    const issueItem = issueMap.get(s.filename);
    const volunteer = volunteerMap.get(s.filename);

    let status: string = s.status; // "done" or "pending" from GitHub API
    let assignee: string | undefined;
    let reviewer: string | undefined;
    let pr: string | undefined;
    let section = s.section;
    let volunteerUser: string | undefined;
    let volunteerUrl: string | undefined;

    if (issueItem) {
      // Toctree section takes priority, then issue checklist, then directory
      section = toctreeMap.get(s.filename) || issueItem.section || section;
      assignee = issueItem.assignee;
      reviewer = issueItem.reviewer;
      pr = issueItem.pr;

      // 5-stage status:
      // done: [x] checked OR file exists in ko/
      // review: [ ] unchecked, has assignee + has reviewer (🔍@user)
      // translating: [ ] unchecked, has assignee but no reviewer
      // requested: [ ] unchecked, no assignee, but someone volunteered in comments
      // pending: [ ] unchecked, no assignee, no volunteer
      if (s.status === "done" || issueItem.checked) {
        status = "done";
      } else if (issueItem.reviewer) {
        status = "review";
      } else if (issueItem.assignee) {
        status = "translating";
      } else if (volunteer) {
        status = "requested";
        volunteerUser = `@${volunteer.commenter}`;
        volunteerUrl = volunteer.commentUrl;
      } else {
        status = "pending";
      }
    } else {
      // Not in checklist — use toctree for section, fallback to directory path
      section = toctreeMap.get(s.filename) || s.section;
      if (volunteer) {
        status = "requested";
        volunteerUser = `@${volunteer.commenter}`;
        volunteerUrl = volunteer.commentUrl;
      }
    }

    return { ...s, status, assignee, reviewer, pr, section, volunteerUser, volunteerUrl };
  });

  const total = mergedStatuses.length;
  const done = mergedStatuses.filter((s) => s.status === "done").length;
  const review = mergedStatuses.filter((s) => s.status === "review").length;
  const translating = mergedStatuses.filter((s) => s.status === "translating").length;
  const requested = mergedStatuses.filter((s) => s.status === "requested").length;
  const pending = mergedStatuses.filter((s) => s.status === "pending").length;

  // Group by section from issue checklist (preferred) or directory
  // Section order from toctree (dynamic) with fallback
  const sectionOrder = toctreeData
    ? toctreeData.map((s) => s.title)
    : [
        "Get Started", "Tutorials", "Datasets", "Policies", "Reward Models",
        "Inference", "Simulation", "Benchmarks", "Robot Processors", "Robots",
        "Teleoperators", "Sensors", "Supported Hardware", "Resources", "About",
      ];

  const koLabels: Record<string, string> = {
    "Get Started": "시작하기",
    "Get started": "시작하기",
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
    "Benchmarks": "벤치마크",
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
      requested: files.filter((f) => f.status === "requested").length,
      pending: files.filter((f) => f.status === "pending").length,
      files: files.map((f) => ({
        filename: f.filename,
        title: (issueMap.get(f.filename)?.title) || f.filename.replace(/\.mdx$/, "").split("/").pop() || f.filename,
        status: f.status as "done" | "review" | "translating" | "requested" | "pending",
        assignee: (f as any).assignee,
        reviewer: (f as any).reviewer,
        pr: (f as any).pr,
        volunteerUser: (f as any).volunteerUser,
        volunteerUrl: (f as any).volunteerUrl,
        enPath: f.enPath,
        koPath: f.koPath,
      })),
    }));

  return {
    stats: { total, done, review, translating, requested, pending },
    sectionStats,
    isLoading,
    error,
    isLive: true,
    rawStatuses: mergedStatuses,
  };
}
