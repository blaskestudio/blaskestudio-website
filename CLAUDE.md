# Blaske Studio — Claude Instructions

## Project

Next.js 16 App Router website for Blaske Studio, a full-service production studio in South Bend, Indiana. Built with Tailwind CSS v4 and TypeScript.

---

## Daily Workflow

### Making changes
1. Open terminal in this project folder and run `claude`
2. Describe what you want changed (be specific)
3. Preview at `http://localhost:3000` (dev server: `npm run dev`)
4. When happy, commit and deploy:

```bash
git add -A
git commit -m "describe what changed"
git push origin main
```

`git push origin main` pushes to both GitHub repos simultaneously — Vercel auto-deploys production (`blaskestudio-website.vercel.app`) within ~2 minutes.

### Updating the client preview
```bash
git checkout preview && git merge main && git push camzyn preview && git checkout main
```
Client preview URL: `https://blaskestudio-website-git-preview-camille-3771s-projects.vercel.app`

### Git remotes
- `origin` → pushes to both `blaskestudio/blaskestudio-website` AND `camzyn/blaskestudio-website`
- `camzyn` → `camzyn/blaskestudio-website` only (what Vercel watches)
- Vercel production branch: `main` on `camzyn`

### Cost-effective Claude usage
- **Claude Code CLI** (`claude` in terminal) — for all code changes; can read/edit files and check the browser
- **Claude.ai web** — for questions, copy writing, planning; no file access needed so cheaper
- Keep sessions focused on one task — shorter sessions cost less
- Start a new session for unrelated tasks rather than continuing a long one

---

---

## gstack

Use the `/browse` skill from gstack for all web browsing tasks. **Never use `mcp__claude-in-chrome__*` tools directly.**

### Available skills

- `/browse` — web browsing
- `/office-hours` — async Q&A / consulting session
- `/plan-ceo-review` — review a plan from a CEO perspective
- `/plan-eng-review` — review a plan from an engineering perspective
- `/plan-design-review` — review a plan from a design perspective
- `/design-consultation` — design consultation session
- `/review` — code review
- `/ship` — ship a feature end-to-end
- `/browse` — browse the web
- `/qa` — full QA pass
- `/qa-only` — QA without fixing
- `/design-review` — visual design review
- `/setup-browser-cookies` — configure browser auth cookies
- `/retro` — run a retrospective
- `/debug` — debug a problem
- `/document-release` — document a release

If gstack skills aren't working, run the following to rebuild the binary and re-register skills:

```bash
cd .claude/skills/gstack && ./setup
```
