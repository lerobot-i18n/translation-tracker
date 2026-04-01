import { GitFork, GitBranch, FileEdit, GitPullRequest } from "lucide-react";

const steps = [
  { icon: GitFork, label: "Fork", desc: "huggingface/lerobot 레포지토리를 Fork합니다" },
  { icon: GitBranch, label: "Branch", desc: "번역 작업을 위한 브랜치를 생성합니다" },
  { icon: FileEdit, label: "Translate", desc: "문서를 한국어로 번역합니다" },
  { icon: GitPullRequest, label: "PR", desc: "Pull Request를 생성합니다" },
];

export default function ContributeGuide() {
  return (
    <div>
      <h2 className="text-lg font-bold text-foreground mb-3">🤝 기여 가이드</h2>
      <div className="rounded-lg border border-border bg-card p-5">
        {/* Steps */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
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
            <span className="font-medium text-foreground">PR 제목 형식:</span>{" "}
            <code className="text-primary font-mono text-xs">[i18n-KO] Translate &lt;filename&gt;.mdx</code>
          </div>
          <div className="rounded-md bg-muted px-3 py-2">
            <span className="font-medium text-foreground">이슈 참조:</span>{" "}
            <code className="text-primary font-mono text-xs">Part of #3058</code>
          </div>
        </div>
      </div>
    </div>
  );
}
