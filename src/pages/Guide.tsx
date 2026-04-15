import {
  Search, GitFork, FileEdit, CheckSquare, Rocket, BookOpen, Code,
  MessageSquare, FileText, AlertTriangle, GitPullRequest, ExternalLink
} from "lucide-react";

const steps = [
  {
    icon: Search,
    emoji: "🔍",
    title: "미번역 파일 선택",
    desc: "대시보드에서 '미번역' 상태의 파일 중 하나를 선택합니다.",
  },
  {
    icon: GitFork,
    emoji: "🍴",
    title: "Fork & 브랜치",
    desc: "Fork 후 i18n-ko/<filename> 브랜치를 생성합니다.",
  },
  {
    icon: FileEdit,
    emoji: "📝",
    title: "번역 작업",
    desc: "docs/source/ko/<filename>.mdx에 번역본을 작성합니다.",
  },
  {
    icon: CheckSquare,
    emoji: "✅",
    title: "포맷 체크",
    desc: "pre-commit run 으로 포맷을 확인합니다.",
  },
  {
    icon: Rocket,
    emoji: "✨",
    title: "PR 제출",
    desc: "파일 1개당 PR 1개로 제출합니다.",
  },
];

const rules = [
  { icon: Code, title: "코드/명령어는 영어 유지", desc: "코드 블록, 명령어, URL, 변수명은 영어를 그대로 유지합니다." },
  { icon: MessageSquare, title: "코드 주석은 상황에 맞게", desc: "사용자 안내 주석은 번역, OS 라벨이나 코드 동작 설명은 영어 유지." },
  { icon: BookOpen, title: "용어집 준수", desc: "용어집에 등록된 표준 번역을 사용합니다. 첫 등장 시 한영 병기." },
  { icon: FileText, title: "격식체 통일", desc: "HF transformers ko 스타일에 맞춰 ~합니다 / ~해주세요로 통일합니다." },
];

export default function Guide() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-foreground">🤝 기여 가이드</h2>
        <p className="text-sm text-muted-foreground mt-1">
          LeRobot 문서 번역에 참여하는 방법을 안내합니다
        </p>
      </div>

      {/* CRITICAL: 1 PR = 1 파일 원칙 */}
      <div className="rounded-lg border-2 border-destructive/40 bg-destructive/5 p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-6 w-6 text-destructive shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-bold text-foreground mb-2">
              🚨 가장 중요한 원칙: 파일 1개 = PR 1개
            </h3>
            <p className="text-sm text-foreground mb-3">
              여러 파일을 한 PR에 묶지 마세요. <strong>파일마다 별도 브랜치 + 별도 PR</strong>로 제출해주세요.
            </p>
            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded-md bg-status-done/10 border border-status-done/30 p-3">
                <p className="font-semibold text-status-done mb-1">✅ 좋은 예시</p>
                <p className="font-mono text-foreground">i18n-ko/installation</p>
                <p className="font-mono text-foreground">i18n-ko/pi0</p>
                <p className="font-mono text-foreground">i18n-ko/act</p>
                <p className="text-muted-foreground mt-1">→ 각각 별도 PR</p>
              </div>
              <div className="rounded-md bg-destructive/10 border border-destructive/30 p-3">
                <p className="font-semibold text-destructive mb-1">❌ 나쁜 예시</p>
                <p className="font-mono text-foreground">i18n-ko-docs</p>
                <p className="text-muted-foreground mt-1">→ 6개 파일 한 PR에 묶음</p>
                <p className="text-muted-foreground">→ 리뷰 어려움, 머지 지연</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              💡 <strong>이유:</strong> 리뷰 부담 ↓, 머지 속도 ↑, 충돌 리스크 ↓, 파일별 진행 관리 ↑
            </p>
          </div>
        </div>
      </div>

      {/* Step Diagram */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-5">번역 프로세스 (5단계)</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {steps.map((step, i) => (
            <div key={step.title} className="relative flex flex-col items-center text-center">
              <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 border-2 border-primary/30 mb-3">
                <span className="text-xl">{step.emoji}</span>
              </div>
              <p className="font-semibold text-sm text-foreground mb-1">
                {i + 1}. {step.title}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PR Format & Naming */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-1.5">
            <GitPullRequest className="h-4 w-4 text-primary" />
            PR 제목 형식
          </h3>
          <div className="rounded-md bg-muted p-3">
            <code className="text-sm text-primary font-mono">
              docs(i18n): add Korean translation for &lt;filename&gt;.mdx
            </code>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            예: docs(i18n): add Korean translation for installation.mdx
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="font-semibold text-foreground mb-3">브랜치 이름 형식</h3>
          <div className="rounded-md bg-muted p-3">
            <code className="text-sm text-primary font-mono">i18n-ko/&lt;filename&gt;</code>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            예: i18n-ko/installation, i18n-ko/pi0
          </p>
        </div>
      </div>

      {/* Issue Reference */}
      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="font-semibold text-foreground mb-3">PR 본문에 이슈 참조</h3>
        <div className="rounded-md bg-muted p-3">
          <code className="text-sm text-primary font-mono">Part of #3058</code>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          한국어: #3058 / 繁體中文: #3290 (zh-Hant) / 简体中文: #3290 (zh-Hans)
        </p>
      </div>

      {/* Translation Rules */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-4">📋 번역 규칙</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {rules.map((rule) => (
            <div key={rule.title} className="flex gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 shrink-0">
                <rule.icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{rule.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{rule.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* References */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-3">📚 번역 참고 자료</h3>
        <div className="space-y-3">
          <div>
            <a
              href="https://github.com/huggingface/transformers/tree/main/docs/source/ko"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
            >
              HuggingFace Transformers 한국어 번역
              <ExternalLink className="h-3 w-3" />
            </a>
            <p className="text-xs text-muted-foreground mt-0.5">
              공식 한국어 번역 파일을 참고해 용어, 톤, 문체를 맞춥니다.
            </p>
          </div>
          <div>
            <a
              href="https://kubernetes.io/ko/docs/contribute/localization_ko/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
            >
              쿠버네티스 한글화 가이드
              <ExternalLink className="h-3 w-3" />
            </a>
            <p className="text-xs text-muted-foreground mt-0.5">
              오픈소스 문서 번역 모범 사례를 참고합니다.
            </p>
          </div>
        </div>
      </div>

      {/* File structure */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-3">📁 디렉토리 구조</h3>
        <div className="rounded-md bg-muted p-4 font-mono text-sm text-foreground overflow-x-auto">
          <pre className="whitespace-pre-wrap">{`docs/
└── source/
    ├── index.mdx              ← 영문 원본
    ├── installation.mdx       ← 영문 원본
    ├── ko/                    ← 한국어 번역
    │   ├── index.mdx
    │   └── installation.mdx
    ├── zh-hant/               ← 繁體中文 번역
    │   └── index.mdx
    └── zh-hans/               ← 简体中文 번역
        └── index.mdx`}</pre>
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-lg border border-dashed border-primary/40 bg-primary/5 p-6 text-center">
        <p className="text-foreground font-medium mb-2">지금 바로 시작하세요!</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="https://github.com/huggingface/lerobot/issues/3058"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Issue #3058 보기 (한국어)
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <a
            href="https://github.com/huggingface/lerobot/issues/3290"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md border border-border bg-card text-foreground text-sm font-medium hover:bg-muted/50 transition-colors"
          >
            Issue #3290 보기 (中文)
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <a
            href="https://github.com/huggingface/lerobot/fork"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md border border-border bg-card text-foreground text-sm font-medium hover:bg-muted/50 transition-colors"
          >
            Fork 하기
          </a>
        </div>
      </div>
    </div>
  );
}
