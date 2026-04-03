const REPO = "huggingface/lerobot";
const DOCS_BASE = "docs/source";
const CACHE_KEY = "lerobot-github-data";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export interface GitHubFileInfo {
  path: string;
  filename: string;
  sha: string;
  size: number;
}

export interface GitHubCommitInfo {
  sha: string;
  date: string;
  message: string;
  author: string;
  authorAvatar?: string;
}

export interface TranslationFileStatus {
  filename: string;
  section: string;
  enPath: string;
  koPath?: string;
  status: "done" | "pending" | "outdated";
  enLastModified?: string;
  koLastModified?: string;
  enSize?: number;
  koSize?: number;
}

interface CachedData<T> {
  data: T;
  timestamp: number;
}

function getCached<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const cached: CachedData<T> = JSON.parse(raw);
    if (Date.now() - cached.timestamp > CACHE_TTL) {
      localStorage.removeItem(key);
      return null;
    }
    return cached.data;
  } catch {
    return null;
  }
}

function setCache<T>(key: string, data: T) {
  try {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {}
}

async function fetchGitHub(endpoint: string) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co`;
  const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const url = `${supabaseUrl}/functions/v1/github-proxy?endpoint=${encodeURIComponent(endpoint)}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${supabaseKey}`,
      apikey: supabaseKey,
    },
  });
  const text = await res.text();
  if (!res.ok) {
    if (res.status === 403) throw new Error("GitHub API rate limit exceeded. Please try again later.");
    throw new Error(`GitHub API error: ${res.status}`);
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Invalid JSON response from GitHub API`);
  }
}

export async function fetchRepoTree(): Promise<{ enFiles: GitHubFileInfo[]; koFiles: GitHubFileInfo[] }> {
  const cached = getCached<{ enFiles: GitHubFileInfo[]; koFiles: GitHubFileInfo[] }>(CACHE_KEY);
  if (cached) return cached;

  const tree = await fetchGitHub(`/repos/${REPO}/git/trees/main?recursive=1`);
  const allFiles: Array<{ path: string; sha: string; size: number }> = tree.tree.filter(
    (f: any) => f.type === "blob"
  );

  const enFiles: GitHubFileInfo[] = [];
  const koFiles: GitHubFileInfo[] = [];

  for (const f of allFiles) {
    if (f.path.startsWith(`${DOCS_BASE}/`) && f.path.endsWith(".mdx") && !f.path.startsWith(`${DOCS_BASE}/ko/`)) {
      const relative = f.path.slice(DOCS_BASE.length + 1);
      // Skip _toctree.yml or hidden files
      if (relative.startsWith("_") || relative.startsWith(".")) continue;
      enFiles.push({ path: f.path, filename: relative, sha: f.sha, size: f.size });
    }
    if (f.path.startsWith(`${DOCS_BASE}/ko/`) && f.path.endsWith(".mdx")) {
      const relative = f.path.slice(`${DOCS_BASE}/ko/`.length);
      if (relative.startsWith("_") || relative.startsWith(".")) continue;
      koFiles.push({ path: f.path, filename: relative, sha: f.sha, size: f.size });
    }
  }

  const result = { enFiles, koFiles };
  setCache(CACHE_KEY, result);
  return result;
}

export async function fetchFileCommits(path: string, maxCount = 1): Promise<GitHubCommitInfo[]> {
  const cacheKey = `lerobot-commits-${path}`;
  const cached = getCached<GitHubCommitInfo[]>(cacheKey);
  if (cached) return cached;

  const commits = await fetchGitHub(`/repos/${REPO}/commits?path=${encodeURIComponent(path)}&per_page=${maxCount}`);
  const result = commits.map((c: any) => ({
    sha: c.sha,
    date: c.commit.committer.date,
    message: c.commit.message.split("\n")[0],
    author: c.author?.login || c.commit.author.name,
    authorAvatar: c.author?.avatar_url,
  }));
  setCache(cacheKey, result);
  return result;
}

export async function fetchRecentPRs(): Promise<Array<{ number: number; title: string; author: string; authorAvatar: string; mergedAt: string; url: string }>> {
  const cacheKey = "lerobot-recent-prs";
  const cached = getCached<any[]>(cacheKey);
  if (cached) return cached;

  try {
    const prs = await fetchGitHub(`/repos/${REPO}/pulls?state=closed&per_page=30&sort=updated&direction=desc`);
    const i18nPRs = prs
      .filter((pr: any) => pr.merged_at && (pr.title.includes("[i18n") || pr.title.toLowerCase().includes("translat") || pr.title.includes("ko/")))
      .slice(0, 10)
      .map((pr: any) => ({
        number: pr.number,
        title: pr.title,
        author: pr.user.login,
        authorAvatar: pr.user.avatar_url,
        mergedAt: pr.merged_at,
        url: pr.html_url,
      }));
    setCache(cacheKey, i18nPRs);
    return i18nPRs;
  } catch {
    return [];
  }
}

export function buildTranslationStatus(enFiles: GitHubFileInfo[], koFiles: GitHubFileInfo[]): TranslationFileStatus[] {
  const koMap = new Map(koFiles.map((f) => [f.filename, f]));

  return enFiles.map((en) => {
    const ko = koMap.get(en.filename);
    return {
      filename: en.filename,
      section: extractSection(en.filename),
      enPath: en.path,
      koPath: ko?.path,
      status: ko ? "done" : "pending",
      enSize: en.size,
      koSize: ko?.size,
    };
  });
}

function extractSection(filename: string): string {
  const parts = filename.split("/");
  if (parts.length > 1) return parts[0];
  return "root";
}

export interface IssueChecklistItem {
  filename: string;
  title: string;
  checked: boolean;
  assignee?: string;
  reviewer?: string;
  pr?: string;
  section: string;
}

export async function fetchIssueChecklist(issueNumber = 3058): Promise<IssueChecklistItem[]> {
  const cacheKey = `lerobot-issue-${issueNumber}`;
  const cached = getCached<IssueChecklistItem[]>(cacheKey);
  if (cached) return cached;

  // First check issue body, then comments for checklist
  const issue = await fetchGitHub(`/repos/${REPO}/issues/${issueNumber}`);
  let body: string = issue.body || "";

  // If body doesn't have checklist, search in comments
  if (!body.includes("- [x]") && !body.includes("- [ ]")) {
    const comments = await fetchGitHub(`/repos/${REPO}/issues/${issueNumber}/comments?per_page=30`);
    for (const comment of comments) {
      const commentBody: string = comment.body || "";
      if (commentBody.includes("- [x]") || commentBody.includes("- [ ]")) {
        body = commentBody;
        break;
      }
    }
  }
  const items: IssueChecklistItem[] = [];
  let currentSection = "";

  for (const line of body.split("\n")) {
    // Detect section headers like "### Get Started (시작하기)"
    const sectionMatch = line.match(/^###\s+(.+?)(?:\s*\(.*\))?\s*$/);
    if (sectionMatch) {
      currentSection = sectionMatch[1].trim();
      continue;
    }

    // Detect checklist items like "- [x] `filename.mdx` — Title (@user, #123)"
    const checkMatch = line.match(/^-\s+\[([ xX])\]\s+`([^`]+)`\s*(?:—|-)?\s*(.*)/);
    if (checkMatch) {
      const checked = checkMatch[1].toLowerCase() === "x";
      const filename = checkMatch[2];
      const rest = checkMatch[3] || "";

      // Extract title (before first parenthesis or @)
      const titleMatch = rest.match(/^([^(@]*)/);
      const title = titleMatch ? titleMatch[1].replace(/\s*$/, "") : filename;

      // Extract assignee (translator)
      const assigneeMatch = rest.match(/@(\w+)/);
      const assignee = assigneeMatch ? `@${assigneeMatch[1]}` : undefined;

      // Extract reviewer (🔍@user pattern)
      const reviewerMatch = rest.match(/🔍@(\w+)/);
      const reviewer = reviewerMatch ? `@${reviewerMatch[1]}` : undefined;

      // Extract PR number
      const prMatch = rest.match(/#(\d+)/);
      const pr = prMatch ? `#${prMatch[1]}` : undefined;

      items.push({ filename, title, checked, assignee, reviewer, pr, section: currentSection });
    }
  }

  setCache(cacheKey, items);
  return items;
}

export interface CommentVolunteer {
  filename: string;
  commenter: string;
  commentDate: string;
  avatarUrl?: string;
  commentUrl?: string;
}

export async function fetchCommentVolunteers(issueNumber = 3058): Promise<CommentVolunteer[]> {
  const cacheKey = `lerobot-comment-volunteers-${issueNumber}`;
  const cached = getCached<CommentVolunteer[]>(cacheKey);
  if (cached) return cached;

  // Fetch issue to identify the author (admin) — skip their comments
  const issue = await fetchGitHub(`/repos/${REPO}/issues/${issueNumber}`);
  const issueAuthor: string = issue.user?.login || "";

  const comments = await fetchGitHub(`/repos/${REPO}/issues/${issueNumber}/comments?per_page=100`);
  const volunteers: CommentVolunteer[] = [];
  const seen = new Set<string>(); // track filename to keep first volunteer only

  for (const comment of comments) {
    const body: string = comment.body || "";
    const commenter: string = comment.user?.login || "";
    const avatarUrl: string = comment.user?.avatar_url || "";
    const commentDate: string = comment.created_at || "";
    const commentUrl: string = comment.html_url || "";

    // Skip issue author (admin) comments — they mention filenames as examples/assignments
    if (commenter === issueAuthor) continue;

    // Skip comments that ARE checklists (those are handled by fetchIssueChecklist)
    if (body.includes("- [x]") || body.includes("- [ ]")) continue;

    // Find all .mdx filenames mentioned in the comment
    const filenameMatches = body.matchAll(/\b([\w.-]+\.mdx)\b/g);
    for (const match of filenameMatches) {
      const filename = match[1];
      if (!seen.has(filename)) {
        seen.add(filename);
        volunteers.push({ filename, commenter, commentDate, avatarUrl, commentUrl });
      }
    }
  }

  setCache(cacheKey, volunteers);
  return volunteers;
}

export interface TocSection {
  title: string;
  files: string[];
}

export async function fetchToctree(): Promise<TocSection[]> {
  const cacheKey = "lerobot-toctree";
  const cached = getCached<TocSection[]>(cacheKey);
  if (cached) return cached;

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const rawEndpoint = `/${REPO}/main/docs/source/_toctree.yml`;
  const res = await fetch(`${supabaseUrl}/functions/v1/github-proxy?endpoint=${encodeURIComponent(rawEndpoint)}&raw=true`, {
    headers: { Authorization: `Bearer ${supabaseKey}`, apikey: supabaseKey },
  });
  if (!res.ok) return [];
  const text = await res.text();

  // Simple YAML parser for _toctree.yml structure
  // Section titles have 2-space indent: "  title: ..."
  // File titles have 4-space indent: "    title: ..."
  const sections: TocSection[] = [];
  let currentFiles: string[] = [];

  for (const line of text.split("\n")) {
    const localMatch = line.match(/^\s*-\s*local:\s*(\S+)/);
    // Section-level title: exactly 2 spaces indent (not 4+)
    const sectionTitleMatch = line.match(/^  title:\s*"?([^"]+)"?\s*$/);

    if (localMatch) {
      currentFiles.push(`${localMatch[1]}.mdx`);
    }
    if (sectionTitleMatch && currentFiles.length > 0) {
      sections.push({ title: sectionTitleMatch[1], files: [...currentFiles] });
      currentFiles = [];
    }
  }

  setCache(cacheKey, sections);
  return sections;
}

export function getGitHubFileUrl(path: string): string {
  return `https://github.com/${REPO}/blob/main/${path}`;
}

export function getGitHubRawUrl(path: string): string {
  return `https://raw.githubusercontent.com/${REPO}/main/${path}`;
}
