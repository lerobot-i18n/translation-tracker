import { Github } from "lucide-react";

export default function DashboardFooter() {
  return (
    <footer className="border-t border-border bg-card mt-8">
      <div className="container mx-auto px-4 py-6 text-sm text-muted-foreground">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <a href="https://github.com/huggingface/lerobot" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-foreground transition-colors">
              <Github className="h-4 w-4" />
              huggingface/lerobot
            </a>
            <a href="https://github.com/huggingface/lerobot/issues/3058" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              Issue #3058
            </a>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span>Maintainer: <strong className="text-foreground">@pkooij</strong></span>
            <span>•</span>
            <span>Lead translator: <strong className="text-foreground">@1wos</strong></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
