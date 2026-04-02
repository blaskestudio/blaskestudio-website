# Blaske Studio — Claude Instructions

## Project

Next.js 16 App Router website for Blaske Studio, a full-service production studio in South Bend, Indiana. Built with Tailwind CSS v4 and TypeScript.

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
