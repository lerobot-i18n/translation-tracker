import { GitFork, GitBranch, FileEdit, GitPullRequest, CheckCircle2 } from "lucide-react";

const steps = [
  { icon: GitFork, label: "Fork", desc: "huggingface/lerobot 레포지토리를 Fork합니다" },
  { icon: GitBranch, label: "Branch", desc: "파일별로 브랜치를 생성합니다" },
  { icon: FileEdit, label: "Translate", desc: "문서를 한국어로 번역합니다" },
  { icon: CheckCircle2, label: "Check", desc: "pre-commit run으로 포맷 확인" },
  { icon: GitPullRequest, label: "PR", desc: "파일 단위로 PR을 올립니다" },
];

export default function ContributeGuide() {
  return (
    <div>
      <h2 className="text-lg font-bold text-foreground mb-3">🤝 기여 가이드</h2>
      <div className="rounded-lg border border-border bg-card p-5">
        {/* Steps */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-5">
          {steps.map((step, i) => (
            <div key={step.label} className="flex flex-col items-center text-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <step.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">
                  {i + 1}. {step.label}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2 text-sm">
          <div className="rounded-md bg-muted px-3 py-2">
            <span className="font-medium text-foreground">브랜치 규칙:</span>{" "}
            <code className="text-primary font-mono text-xs">i18n-ko/&lt;filename&gt;</code>
            <span className="text-muted-foreground ml-1 text-xs">(main에서 직접 작업 금지)</span>
          </div>
          <div className="rounded-md bg-muted px-3 py-2">
            <span className="font-medium text-foreground">PR 제목 형식:</span>{" "}
            <code className="text-primary font-mono text-xs">docs(i18n): add Korean translation for &lt;filename&gt;.mdx</code>
          </div>
          <div className="rounded-md bg-muted px-3 py-2">
            <span className="font-medium text-foreground">PR 본문에 추가:</span>{" "}
            <code className="text-primary font-mono text-xs">Part of #3058</code>
          </div>
          <div className="rounded-md bg-muted px-3 py-2">
            <span className="font-medium text-foreground">PR 단위:</span>{" "}
            <span className="text-muted-foreground text-xs">파일 1개당 PR 1개 (리뷰가 빨라요!)</span>
          </div>
        </div>

        {/* Quick command reference */}
        <div className="mt-4 rounded-md bg-muted/50 border border-border px-3 py-2">
          <p className="font-medium text-foreground text-sm mb-2">Quick Start</p>
          <div className="font-mono text-xs text-muted-foreground space-y-1">
            <p>$ git checkout -b i18n-ko/quickstart</p>
            <p>$ cp docs/source/quickstart.mdx docs/source/ko/quickstart.mdx</p>
            <p>$ <span className="text-foreground"># 번역 작업</span></p>
            <p>$ pre-commit run</p>
            <p>$ git add . && git commit -m "docs(i18n): add Korean translation for quickstart.mdx"</p>
            <p>$ git push origin i18n-ko/quickstart</p>
          </div>
        </div>
      </div>
    </div>
  );
}
