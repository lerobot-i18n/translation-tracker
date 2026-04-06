import { Link, useLocation } from "react-router-dom";
import { Moon, Sun, Github, ExternalLink, RefreshCw, BarChart3, Users, BookOpen, HelpCircle, Menu, X, Mail, Linkedin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import logoImg from "@/assets/lerobot-logo.png";
import { useEffect, useState } from "react";
import LanguageSelector from "./LanguageSelector";

const navItems = [
  { path: "/", key: "nav.dashboard", icon: BarChart3 },
  { path: "/contributors", key: "nav.contributors", icon: Users },
  { path: "/glossary", key: "nav.glossary", icon: BookOpen },
  { path: "/guide", key: "nav.guide", icon: HelpCircle },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { lang } = useLanguage();
  const { t } = useTranslation();
  const location = useLocation();
  const [dark, setDark] = useState(() =>
    typeof window !== "undefined" && document.documentElement.classList.contains("dark")
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container mx-auto px-4">
          <div className="flex h-14 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <img src={logoImg} alt="LeRobot" className="h-8 rounded-md" />
              <div className="hidden sm:block">
                <h1 className="text-sm font-bold tracking-tight text-foreground leading-tight">
                  LeRobot i18n Tracker
                </h1>
                <p className="text-[10px] text-muted-foreground leading-tight">{t("nav.subtitle")}</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {t(item.key)}
                  </Link>
                );
              })}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1.5">
              <LanguageSelector />
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <a href="https://github.com/huggingface/lerobot" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDark(!dark)}>
                {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Mobile Nav */}
          {mobileMenuOpen && (
            <nav className="md:hidden pb-3 space-y-1">
              {navItems.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {t(item.key)}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-8">
        <div className="container mx-auto px-4 py-4 text-xs text-muted-foreground">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <a href="https://github.com/huggingface/lerobot" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-foreground transition-colors">
                <Github className="h-3.5 w-3.5" />
                huggingface/lerobot
              </a>
              <a href={`https://github.com/huggingface/lerobot/issues/${lang.issueNumber}`} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                Issue #{lang.issueNumber}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span>Maintainer: <strong className="text-foreground">@pkooij</strong></span>
              <span>•</span>
              <span>Lead: <a href="https://github.com/1wos" target="_blank" rel="noopener noreferrer" className="font-bold text-foreground hover:text-primary transition-colors">@1wos</a></span>
              <a href="https://github.com/1wos" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors" title="GitHub">
                <Github className="h-4 w-4" />
              </a>
              <a href="mailto:1wosomm1@gmail.com" className="hover:text-foreground transition-colors" title="Email">
                <Mail className="h-4 w-4" />
              </a>
              <a href="https://www.linkedin.com/in/someee/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors" title="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
