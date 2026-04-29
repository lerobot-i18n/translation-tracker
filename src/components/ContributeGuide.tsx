import { GitFork, GitBranch, FileEdit, GitPullRequest, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ContributeGuide() {
  const { t } = useTranslation();

  const steps = [
    { icon: GitFork, label: "Fork", desc: t("guide.stepFork") },
    { icon: GitBranch, label: "Branch", desc: t("guide.stepBranch") },
    { icon: FileEdit, label: "Translate", desc: t("guide.stepTranslate") },
    { icon: CheckCircle2, label: "Check", desc: t("guide.stepCheck") },
    { icon: GitPullRequest, label: "PR", desc: t("guide.stepPR") },
  ];

  return (
    <div>
      <h2 className="text-lg font-bold text-foreground mb-3">{t("guide.title")}</h2>
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
            <span className="font-medium text-foreground">{t("guide.ruleBranch")}:</span>{" "}
            <code className="text-primary font-mono text-xs">i18n-ko/&lt;filename&gt;</code>
            <span className="text-muted-foreground ml-1 text-xs">{t("guide.ruleBranchDesc")}</span>
          </div>
          <div className="rounded-md bg-muted px-3 py-2">
            <span className="font-medium text-foreground">{t("guide.ruleTitle")}:</span>{" "}
            <code className="text-primary font-mono text-xs">docs(i18n): add Korean translation for &lt;filename&gt;.mdx</code>
          </div>
          <div className="rounded-md bg-muted px-3 py-2">
            <span className="font-medium text-foreground">{t("guide.ruleBody")}:</span>{" "}
            <code className="text-primary font-mono text-xs">Part of #3058</code>
          </div>
          <div className="rounded-md bg-muted px-3 py-2">
            <span className="font-medium text-foreground">{t("guide.rulePerPR")}:</span>{" "}
            <span className="text-muted-foreground text-xs">{t("guide.rulePerPRDesc")}</span>
          </div>
        </div>

        {/* Quick command reference */}
        <div className="mt-4 rounded-md bg-muted/50 border border-border px-3 py-2">
          <p className="font-medium text-foreground text-sm mb-2">{t("guide.quickStart")}</p>
          <div className="font-mono text-xs text-muted-foreground space-y-1">
            <p>$ git checkout -b i18n-ko/quickstart</p>
            <p>$ cp docs/source/quickstart.mdx docs/source/ko/quickstart.mdx</p>
            <p>$ <span className="text-foreground">{t("guide.translateComment")}</span></p>
            <p>$ pre-commit run</p>
            <p>$ git add . && git commit -m "docs(i18n): add Korean translation for quickstart.mdx"</p>
            <p>$ git push origin i18n-ko/quickstart</p>
          </div>
        </div>
      </div>
    </div>
  );
}
