import {
  Search, GitFork, FileEdit, CheckSquare, Rocket, BookOpen, Code,
  MessageSquare, FileText, AlertTriangle, GitPullRequest, ExternalLink
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";

const stepConfigs = [
  { icon: Search, emoji: "🔍", titleKey: "guide.stepSelectFile", descKey: "guide.stepSelectFileDesc" },
  { icon: GitFork, emoji: "🍴", titleKey: "guide.stepForkBranch", descKey: "guide.stepForkBranchDesc" },
  { icon: FileEdit, emoji: "📝", titleKey: "guide.stepTranslateWork", descKey: "guide.stepTranslateWorkDesc" },
  { icon: CheckSquare, emoji: "✅", titleKey: "guide.stepFormatCheck", descKey: "guide.stepFormatCheckDesc" },
  { icon: Rocket, emoji: "✨", titleKey: "guide.stepSubmitPr", descKey: "guide.stepSubmitPrDesc" },
];

const ruleConfigs = [
  { icon: Code, titleKey: "guide.ruleKeepCodeTitle", descKey: "guide.ruleKeepCodeDesc" },
  { icon: MessageSquare, titleKey: "guide.ruleCommentsTitle", descKey: "guide.ruleCommentsDesc" },
  { icon: BookOpen, titleKey: "guide.ruleGlossaryTitle", descKey: "guide.ruleGlossaryDesc" },
  { icon: FileText, titleKey: "guide.ruleToneTitle", descKey: "guide.ruleToneDesc" },
];

const PR_LANGUAGE_NAMES: Record<string, string> = {
  ko: "Korean",
  "zh-hant": "Traditional Chinese",
  "zh-hans": "Simplified Chinese",
};

export default function Guide() {
  const { t } = useTranslation();
  const { lang } = useLanguage();
  const branchPrefix = `i18n-${lang.dir}`;
  const prLanguageName = PR_LANGUAGE_NAMES[lang.code] || lang.label;
  const prTitleExample = `docs(i18n): add ${prLanguageName} translation for <filename>.mdx`;
  const prTitleConcreteExample = `docs(i18n): add ${prLanguageName} translation for installation.mdx`;
  const fileTree = `docs/
└── source/
    ├── index.mdx              ← ${t("guide.fileTreeSource")}
    ├── installation.mdx       ← ${t("guide.fileTreeSource")}
    ├── ko/                    ← ${t("guide.fileTreeKorean")}
    │   ├── index.mdx
    │   └── installation.mdx
    ├── zh-hant/               ← ${t("guide.fileTreeTraditionalChinese")}
    │   └── index.mdx
    └── zh-hans/               ← ${t("guide.fileTreeSimplifiedChinese")}
        └── index.mdx`;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-foreground">{t("guide.title")}</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {t("guide.pageSubtitle")}
        </p>
      </div>

      <div className="rounded-lg border-2 border-destructive/40 bg-destructive/5 p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-6 w-6 text-destructive shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-bold text-foreground mb-2">
              {t("guide.criticalTitle")}
            </h3>
            <p className="text-sm text-foreground mb-3">
              {t("guide.criticalDesc")}
            </p>
            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded-md bg-status-done/10 border border-status-done/30 p-3">
                <p className="font-semibold text-status-done mb-1">{t("guide.goodExample")}</p>
                <p className="font-mono text-foreground">{branchPrefix}/installation</p>
                <p className="font-mono text-foreground">{branchPrefix}/pi0</p>
                <p className="font-mono text-foreground">{branchPrefix}/act</p>
                <p className="text-muted-foreground mt-1">{t("guide.separatePr")}</p>
              </div>
              <div className="rounded-md bg-destructive/10 border border-destructive/30 p-3">
                <p className="font-semibold text-destructive mb-1">{t("guide.badExample")}</p>
                <p className="font-mono text-foreground">{branchPrefix}-docs</p>
                <p className="text-muted-foreground mt-1">{t("guide.badBundle")}</p>
                <p className="text-muted-foreground">{t("guide.badReview")}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              {t("guide.reason")}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-5">{t("guide.processTitle")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {stepConfigs.map((step, i) => (
            <div key={step.titleKey} className="relative flex flex-col items-center text-center">
              <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 border-2 border-primary/30 mb-3">
                <span className="text-xl">{step.emoji}</span>
              </div>
              <p className="font-semibold text-sm text-foreground mb-1">
                {i + 1}. {t(step.titleKey)}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">{t(step.descKey, { branchPrefix, targetDir: lang.dir })}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-1.5">
            <GitPullRequest className="h-4 w-4 text-primary" />
            {t("guide.prTitleFormat")}
          </h3>
          <div className="rounded-md bg-muted p-3">
            <code className="text-sm text-primary font-mono">
              {prTitleExample}
            </code>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {t("guide.example")}: {prTitleConcreteExample}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="font-semibold text-foreground mb-3">{t("guide.branchNameFormat")}</h3>
          <div className="rounded-md bg-muted p-3">
            <code className="text-sm text-primary font-mono">{branchPrefix}/&lt;filename&gt;</code>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {t("guide.example")}: {branchPrefix}/installation, {branchPrefix}/pi0
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="font-semibold text-foreground mb-3">{t("guide.issueReferenceTitle")}</h3>
        <div className="rounded-md bg-muted p-3">
          <code className="text-sm text-primary font-mono">Part of #{lang.issueNumber}</code>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {t("guide.issueReferenceDesc")}
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-4">{t("guide.translationRulesTitle")}</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {ruleConfigs.map((rule) => (
            <div key={rule.titleKey} className="flex gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 shrink-0">
                <rule.icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{t(rule.titleKey)}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t(rule.descKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-3">{t("guide.referencesTitle")}</h3>
        <div className="space-y-3">
          <div>
            <a
              href="https://github.com/huggingface/transformers/tree/main/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
            >
              {t("guide.referenceTransformers")}
              <ExternalLink className="h-3 w-3" />
            </a>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t("guide.referenceTransformersDesc")}
            </p>
          </div>
          <div>
            <a
              href="https://kubernetes.io/docs/contribute/localization/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
            >
              {t("guide.referenceKubernetes")}
              <ExternalLink className="h-3 w-3" />
            </a>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t("guide.referenceKubernetesDesc")}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-3">{t("guide.fileStructureTitle")}</h3>
        <div className="rounded-md bg-muted p-4 font-mono text-sm text-foreground overflow-x-auto">
          <pre className="whitespace-pre-wrap">{fileTree}</pre>
        </div>
      </div>

      <div className="rounded-lg border border-dashed border-primary/40 bg-primary/5 p-6 text-center">
        <p className="text-foreground font-medium mb-2">{t("guide.ctaTitle")}</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={`https://github.com/huggingface/lerobot/issues/${lang.issueNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            {t("guide.issueLink", { issueNumber: lang.issueNumber })}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <a
            href="https://github.com/huggingface/lerobot/fork"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md border border-border bg-card text-foreground text-sm font-medium hover:bg-muted/50 transition-colors"
          >
            {t("guide.forkLink")}
          </a>
        </div>
      </div>
    </div>
  );
}
