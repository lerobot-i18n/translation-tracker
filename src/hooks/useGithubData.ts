import { useQuery } from "@tanstack/react-query";
import {
  fetchRepoTree,
  buildTranslationStatus,
  fetchRecentPRs,
  fetchFileCommits,
  fetchIssueChecklist,
  fetchCommentVolunteers,
  fetchOutdatedFiles,
  fetchToctree,
  IssueChecklistItem,
  CommentVolunteer,
  OutdatedInfo,
} from "@/services/githubApi";
import { useLanguage } from "@/contexts/LanguageContext";
import { getSectionKoreanLabel } from "@/lib/localization";

export function useTranslationData() {
  const { lang } = useLanguage();
  return useQuery({
    queryKey: ["github-translation-data", lang.dir],
    queryFn: async () => {
      const { enFiles, translatedFiles } = await fetchRepoTree(lang.dir);
      const statuses = buildTranslationStatus(enFiles, translatedFiles);
      return { enFiles, translatedFiles, statuses };
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

export function useIssueChecklist() {
  const { lang } = useLanguage();
  return useQuery({
    queryKey: ["github-issue-checklist", lang.issueNumber],
    queryFn: () => fetchIssueChecklist(lang.issueNumber),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

export function useRecentPRs() {
  const { lang } = useLanguage();
  return useQuery({
    queryKey: ["github-recent-prs", lang.issueNumber],
    queryFn: () => fetchRecentPRs(lang.issueNumber),
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
  const { lang } = useLanguage();
  return useQuery({
    queryKey: ["github-comment-volunteers", lang.issueNumber],
    queryFn: () => fetchCommentVolunteers(lang.issueNumber),
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
  const { lang } = useLanguage();
  const translationQuery = useTranslationData();
  const issueQuery = useIssueChecklist();
  const volunteerQuery = useCommentVolunteers();
  const toctreeQuery = useToctree();

  const { data: githubData, isLoading: isLoadingGithub, error: githubError } = translationQuery;
  const { data: issueData, isLoading: isLoadingIssue, error: issueError } = issueQuery;
  const { data: volunteerData } = volunteerQuery;
  const { data: toctreeData } = toctreeQuery;

  // Find done files for outdated check
  const doneFiles = githubData
    ? githubData.statuses
        .filter((s) => s.status === "done" && s.koPath)
        .map((s) => ({ filename: s.filename, enPath: s.enPath, koPath: s.koPath! }))
    : [];

  const outdatedQuery = useQuery({
    queryKey: ["github-outdated", doneFiles.map((f) => f.filename).join(",")],
    queryFn: () => fetchOutdatedFiles(doneFiles),
    enabled: doneFiles.length > 0,
    staleTime: 10 * 60 * 1000, // 10 min cache (heavier check)
    retry: 1,
  });
  const { data: outdatedData } = outdatedQuery;

  const isLoading = isLoadingGithub;
  const error = githubError;

  if (isLoading || !githubData) {
    return {
      stats: { total: 0, done: 0, outdated: 0, progress: 0, requested: 0, pending: 0 },
      sectionStats: [],
      isLoading: isLoading || (!githubData && isLoadingIssue),
      error: githubError || issueError,
      isLive: false,
      rawStatuses: [],
    };
  }

  if (error && !githubData) {
    return {
      stats: { total: 0, done: 0, outdated: 0, progress: 0, requested: 0, pending: 0 },
      sectionStats: [],
      isLoading: false,
      error,
      isLive: false,
      rawStatuses: [],
    };
  }

  const { statuses } = githubData;

  // Build issue checklist map for quick lookup
  // For languages with checklistTag (e.g. zh-Hant/zh-Hans sharing one issue),
  // only include items that have the matching language tag in their [Hant / Hans] marker.
  const issueMap = new Map<string, IssueChecklistItem>();
  if (issueData) {
    for (const item of issueData) {
      if (lang.checklistTag) {
        // Only include if this item has the matching language tag
        if (item.langTags && item.langTags.some((t) => t.toLowerCase() === lang.checklistTag!.toLowerCase())) {
          issueMap.set(item.filename, item);
        }
      } else {
        // No filtering needed (Korean case)
        issueMap.set(item.filename, item);
      }
    }
  }

  // Build comment volunteer map for quick lookup
  // For shared issues with checklistTag (zh-Hant/zh-Hans), infer each volunteer's language
  // by looking at their existing checklist assignments. If they primarily work on one language,
  // only count their volunteer comments for that language tab.
  const volunteerMap = new Map<string, CommentVolunteer>();
  if (volunteerData) {
    // Build user → primary language tag map from checklist assignments
    const userLangMap = new Map<string, string>(); // username → checklistTag they work on
    if (issueData && lang.checklistTag) {
      for (const item of issueData) {
        if (!item.assignee || !item.langTags || item.langTags.length === 0) continue;
        const username = item.assignee.replace("@", "").toLowerCase();
        // Use the first language tag found for this user
        if (!userLangMap.has(username)) {
          userLangMap.set(username, item.langTags[0]);
        }
      }
    }

    for (const v of volunteerData) {
      if (lang.checklistTag) {
        // Priority: detected langTag from comment body > inferred from checklist assignments
        const detectedLang = v.langTag || userLangMap.get(v.commenter.toLowerCase());
        if (detectedLang && detectedLang.toLowerCase() === lang.checklistTag.toLowerCase()) {
          volunteerMap.set(v.filename, v);
        }
        // Skip if no language info found (avoid incorrect attribution across both tabs)
      } else {
        // Korean case: no filtering
        volunteerMap.set(v.filename, v);
      }
    }
  }

  // Build outdated map for quick lookup
  const outdatedMap = new Map<string, OutdatedInfo>();
  if (outdatedData) {
    for (const o of outdatedData) {
      outdatedMap.set(o.filename, o);
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

      // Status logic based on actual PR workflow:
      // done:        [x] checked (PR merged)
      // review:      [ ] unchecked + PR submitted (waiting for reviewer)
      // translating: [ ] unchecked + has assignee but no PR
      // requested:   [ ] unchecked + no assignee, but volunteer in comments
      // pending:     [ ] unchecked + nothing
      if (s.status === "done" || issueItem.checked) {
        status = "done";
      } else if (issueItem.pr) {
        // PR submitted but not yet merged → in review
        status = "review";
      } else if (issueItem.reviewer) {
        // Explicit reviewer tag (legacy 🔍@ pattern)
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

    // Check if done file is outdated (en modified after ko)
    if (status === "done" && outdatedMap.has(s.filename)) {
      status = "outdated";
    }

    return { ...s, status, assignee, reviewer, pr, section, volunteerUser, volunteerUrl };
  });

  const total = mergedStatuses.length;
  const done = mergedStatuses.filter((s) => s.status === "done").length;
  const outdated = mergedStatuses.filter((s) => s.status === "outdated").length;
  const review = mergedStatuses.filter((s) => s.status === "review").length;
  const translating = mergedStatuses.filter((s) => s.status === "translating").length;
  const requested = mergedStatuses.filter((s) => s.status === "requested").length;
  const pending = mergedStatuses.filter((s) => s.status === "pending").length;

  // Group by section from issue checklist (preferred) or directory
  // Section order from toctree (dynamic) with fallback
  const sectionOrder = toctreeData
    ? toctreeData.map((s) => s.title)
    : [
        "Get Started", "Tutorials", "Compute & Hardware", "Datasets", "Policies", "Reward Models",
        "Inference", "Simulation", "Benchmarks", "Robot Processors", "Robots",
        "Teleoperators", "Sensors", "Supported Hardware", "Resources", "About",
      ];

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
      nameKo: getSectionKoreanLabel(name),
      total: files.length,
      done: files.filter((f) => f.status === "done").length,
      outdated: files.filter((f) => f.status === "outdated").length,
      review: files.filter((f) => f.status === "review").length,
      translating: files.filter((f) => f.status === "translating").length,
      requested: files.filter((f) => f.status === "requested").length,
      pending: files.filter((f) => f.status === "pending").length,
      files: files.map((f) => ({
        filename: f.filename,
        title: (issueMap.get(f.filename)?.title) || f.filename.replace(/\.mdx$/, "").split("/").pop() || f.filename,
        status: f.status as "done" | "outdated" | "review" | "translating" | "requested" | "pending",
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
    stats: { total, done, outdated, review, translating, requested, pending },
    sectionStats,
    isLoading,
    error,
    isLive: true,
    rawStatuses: mergedStatuses,
  };
}
