import { Search, GitFork, FileEdit, CheckSquare, Rocket, BookOpen, Code, MessageSquare, FileText } from "lucide-react";

const steps = [
  {
    icon: Search,
    emoji: "🔍",
    title: "미번역 파일 선택",
    desc: "대시보드에서 '미번역' 상태의 파일을 찾아 작업할 파일을 선택합니다.",
  },
  {
    icon: GitFork,
    emoji: "🍴",
    title: "Fork 레포지토리",
    desc: "huggingface/lerobot 레포지토리를 본인의 GitHub 계정으로 Fork합니다.",
  },
  {
    icon: FileEdit,
    emoji: "📝",
    title: "번역 파일 생성",
    desc: "docs/source/ko/ 디렉토리에 번역 파일을 생성하고 번역합니다.",
  },
  {
    icon: CheckSquare,
    emoji: "✅",
    title: "포맷 체크",
    desc: "pre-commit run 으로 포맷을 확인하고 문제가 없는지 점검합니다.",
  },
  {
    icon: Rocket,
    emoji: "✨",
    title: "PR 제출",
    desc: "[i18n-KO] Translate <filename>.mdx 형식으로 Pull Request를 제출합니다.",
  },
];

const rules = [
  { icon: Code, title: "코드/명령어는 영어 유지", desc: "코드 블록, 명령어, URL, 변수명은 영어를 그대로 유지합니다." },
  { icon: MessageSquare, title: "코드 주석은 한국어 번역", desc: "코드 내 주석은 한국어로 번역하여 이해를 돕습니다." },
  { icon: BookOpen, title: "용어집 준수", desc: "용어집에 등록된 표준 번역을 사용합니다." },
  { icon: FileText, title: "격식체 사용", desc: "문체는 격식체(~합니다)를 사용합니다." },
];

export default function Guide() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-foreground">🤝 기여 가이드</h2>
        <p className="text-sm text-muted-foreground mt-1">
          LeRobot 한국어 번역에 참여하는 방법을 안내합니다
        </p>
      </div>

      {/* Step Diagram */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-5">번역 프로세스</h3>
        <div className="relative">

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
      </div>

      {/* PR Format */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="font-semibold text-foreground mb-3">PR 제목 형식</h3>
          <div className="rounded-md bg-muted p-3">
            <code className="text-sm text-primary font-mono">
              [i18n-KO] Translate &lt;filename&gt;.mdx
            </code>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            예: [i18n-KO] Translate installation.mdx
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="font-semibold text-foreground mb-3">이슈 참조</h3>
          <div className="rounded-md bg-muted p-3">
            <code className="text-sm text-primary font-mono">Part of #3058</code>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            PR 본문에 이슈 참조를 포함해주세요
          </p>
        </div>
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

      {/* File structure */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-3">📁 디렉토리 구조</h3>
        <div className="rounded-md bg-muted p-4 font-mono text-sm text-foreground">
          <pre className="whitespace-pre-wrap">{`docs/
└── source/
    ├── index.mdx          ← 영문 원본
    ├── installation.mdx   ← 영문 원본
    └── ko/
        ├── index.mdx      ← 한국어 번역
        └── installation.mdx ← 한국어 번역`}</pre>
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
            Issue #3058 보기
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
