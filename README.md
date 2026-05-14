<p align="center">
  <img src="public/lerobot-logo.png" alt="LeRobot" height="80" />
</p>

<h1 align="center">LeRobot i18n Tracker</h1>

<p align="center">
  Real-time translation tracking dashboard for <a href="https://github.com/huggingface/lerobot">huggingface/lerobot</a> documentation
</p>

<p align="center">
  <a href="https://github.com/huggingface/lerobot/issues/3058">Korean Issue #3058</a> &middot;
  <a href="https://github.com/huggingface/lerobot/issues/3290">Chinese Issue #3290</a>
</p>

---

## About

LeRobot i18n Tracker is a community-driven dashboard that tracks the progress of translating [LeRobot](https://github.com/huggingface/lerobot) documentation into multiple languages. It was created to coordinate translation efforts across contributors and provide real-time visibility into what's been translated, what's in progress, and what still needs work.

This project is referenced in the [official LeRobot v0.6.0 roadmap](https://github.com/huggingface/lerobot/issues/3134) under "Internationalization."

## Features

- **Real-time tracking** — Syncs with GitHub API to show translation status for all 57 `.mdx` doc files
- **Multi-language support** — Switch between Korean (ko) and Chinese (zh) translation progress
- **Auto-detection of new files** — Parses `_toctree.yml` to automatically pick up newly added documentation
- **Comment volunteer detection** — Detects when someone volunteers to translate a file via issue comments
- **Outdated detection** — Flags translated files when the English source has been updated
- **Status filtering** — Filter by Done, Outdated, In Review, Translating, Requested, or Untranslated
- **i18n UI** — Dashboard interface available in Korean and English
- **5-stage status system** — Done, In Review, Translating, Requested, Untranslated
- **Section grouping** — Files organized by documentation sections from `_toctree.yml`
- **Contribution guide** — Built-in guide with branch rules, PR conventions, and quick start commands

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS + shadcn/ui
- **Data**: GitHub REST API + Search API
- **Backend**: Supabase Edge Function (GitHub API proxy)
- **State**: TanStack React Query (with 5-min cache)
- **i18n**: react-i18next
- **Hosting**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- Bun

### Installation

```bash
git clone https://github.com/lerobot-i18n/translation-tracker.git
cd translation-tracker
bun install
```

### Environment Variables

Create a `.env` file with your Supabase credentials:

```env
# Required — Supabase Edge Function proxy for GitHub API
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your-anon-key>

# Optional — increases GitHub API rate limit (60/hr → 5,000/hr)
VITE_GITHUB_TOKEN=<your-github-token>
```

> The GitHub token needs no scopes — it's for public-repo rate limiting only.

### Development

```bash
bun run dev
```

Open [http://localhost:8080](http://localhost:8080).

## Deployment Automation

The project is ready for Vercel Git Integration:

- **Production deploys**: every push to `main`
- **Preview deploys**: every pull request
- **Build command**: `bun run build`
- **Output directory**: `dist`

GitHub Actions also runs tests and build checks on every pull request and every push to `main`.

## Project Structure

```
src/
├── components/       # UI components (StatusBadge, TranslationTable, etc.)
├── contexts/         # LanguageContext (data lang + UI lang)
├── hooks/            # React Query hooks (useGithubData, etc.)
├── i18n/             # Translation files (ko.json, en.json)
├── pages/            # Route pages (Index, Guide, Contributors, Glossary)
└── services/         # GitHub API integration (githubApi.ts)
supabase/
└── functions/        # Edge Function (github-proxy)
```

## How It Works

```
GitHub API (huggingface/lerobot)
  ├── File tree → 57 .mdx files detected
  ├── _toctree.yml → Section grouping
  ├── Issue checklist → Assignee, reviewer, PR info
  └── Issue comments → Volunteer detection
          ↓
  Dashboard (real-time, 5-min cache)
  ├── Status: Done / Outdated / Review / Translating / Requested / Untranslated
  ├── Language switch: Korean (ko) ↔ Chinese (zh)
  └── UI language: 한국어 ↔ English
```

## Supported Languages

| Language | Directory | Issue | Status |
|----------|-----------|-------|--------|
| Korean (한국어) | `docs/source/ko/` | [#3058](https://github.com/huggingface/lerobot/issues/3058) | Active |
| Chinese (中文) | `docs/source/zh/` | [#3290](https://github.com/huggingface/lerobot/issues/3290) | Active |

## Contributing

Contributions to the dashboard are welcome! For translating LeRobot documentation:

1. Visit the [Korean issue #3058](https://github.com/huggingface/lerobot/issues/3058) or [Chinese issue #3290](https://github.com/huggingface/lerobot/issues/3290)
2. Comment to claim a file
3. Follow the contribution guide in the dashboard's **Guide** tab

## Maintainer

**JEONG SOMI (정소미)** — [@1wos](https://github.com/1wos)

- Lead translator & dashboard creator
- [Email](mailto:1wosomm1@gmail.com) · [LinkedIn](https://www.linkedin.com/in/someee/)
