import { Github, Mail, Linkedin } from "lucide-react";

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
          <div className="flex flex-col sm:flex-row items-center gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span>Maintainer: <strong className="text-foreground">@pkooij</strong></span>
              <span>•</span>
              <span>Lead translator: <a href="https://github.com/1wos" target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground hover:text-primary transition-colors">@1wos</a></span>
            </div>
            <div className="flex items-center gap-3">
              <a href="https://github.com/1wos" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors" title="GitHub">
                <Github className="h-5 w-5" />
              </a>
              <a href="mailto:1wosomm1@gmail.com" className="hover:text-foreground transition-colors" title="Email">
                <Mail className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/in/someee/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors" title="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
