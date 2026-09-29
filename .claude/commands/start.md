---
description: Start the day - load memory, open task board, ready to work
argument-hint: ""
allowed-tools:
  - Read
  - Edit
  - Write
  - Glob
  - Grep
  - Bash(date:*)
  - Bash(ls:*)
  - Bash(grep:*)
  - Bash(rm:*)
  - mcp__memory__search_nodes
  - mcp__memory__open_nodes
---

Begin a working session. Load context, create today's daily note, review tasks.

On the very first run after install, this command does more: it scans the project, configures `CLAUDE.md` from what it finds, seeds a couple of starter facts, and asks a few setup questions. That is the setup the installer promised. Every run after that is the normal, fast start below.

## Steps

### Step 1: Get today's date

```bash
date +"%m%d%y %H:%M %A"
```

### Step 1.5: First-run check

Decide whether this is the first run since install. It is a first run if EITHER of these is true:

```bash
# Marker the installer drops at the project root (gitignored, removed after onboarding)
ls __NEEDS_ONBOARD 2>/dev/null
# Belt and braces: CLAUDE.md still carries the shipped placeholder prose
grep -l "Replace this section with your project" CLAUDE.md 2>/dev/null
```

- If NEITHER matches: skip straight to Step 2. This is a normal start.
- If EITHER matches: run **First-run setup** below, in full, BEFORE Step 2. Then continue into Step 2 as usual.

Do not announce a separate "onboarding mode" and stop. First-run setup flows directly into the normal start so the session ends ready to work.

---

## First-run setup (first run only)

The goal: turn the placeholder `CLAUDE.md` into a real orientation for THIS project, seed one or two confirmed facts, and learn what the project is. Only run this when Step 1.5 says it is a first run.

This step is safe to repeat. It only ever replaces shipped placeholder prose, never content you or the buyer already wrote, and never anything inside a `SYSTEM-SHIPPED` block. If a section has already been filled in, leave it exactly as it is.

### A. Detect the stack

Look before you write. Identify the project from the files actually present, not from memory. This is the same signal-file detection the `verifier` agent uses. Glob the project root (and one level down for monorepos) and read the manifests you find:

| Signal file | Stack | Read for |
|---|---|---|
| `package.json` | Node / JS / TS | `name`, `scripts` (test/build/lint/typecheck), `dependencies` (framework: next, react, vue, svelte, express, etc.), package manager via lockfile |
| `pnpm-lock.yaml` / `yarn.lock` / `package-lock.json` / `bun.lockb` | (lockfile) | Package manager (pnpm / yarn / npm / bun) |
| `tsconfig.json` | TypeScript | Confirms TS over plain JS |
| `pyproject.toml` / `setup.cfg` / `requirements.txt` / `Pipfile` | Python | Project name, deps, test runner (pytest/tox), framework (django/flask/fastapi) |
| `go.mod` | Go | Module name, Go version |
| `Cargo.toml` | Rust | Crate name, dependencies |
| `pom.xml` / `build.gradle` | Java / Kotlin | Build tool, artifact name |
| `Gemfile` | Ruby | Framework (rails/sinatra), gems |
| `composer.json` | PHP | Framework (laravel/symfony), deps |
| `*.csproj` / `*.sln` | .NET | Project name, target framework |
| `Makefile` | any | Real target names (build/test/lint) |
| `Dockerfile` / `docker-compose.yml` | containerised | Services, base images |
| `.github/workflows/` | CI present | What the project tests/builds on push |
| `README.md` | any | One-line description of what the project does |

Read what you find, do not guess. Note: detected languages and frameworks, the package manager, the test runner, the build/lint commands that actually exist, and a one-line sense of what the project does (from README if present). If a signal is genuinely absent, leave that detail out rather than inventing it.

### B. Fill the CLAUDE.md placeholders (placeholders only)

`CLAUDE.md` has a `CUSTOMER-OWNED` section with three placeholder blocks: **## This project**, **## Project conventions**, and **## Local context**. Replace ONLY the placeholder prose in each, using what Step A found. Rules:

- Edit only inside the `<!-- CUSTOMER-OWNED:START -->` ... `<!-- CUSTOMER-OWNED:END -->` block. NEVER touch anything between `<!-- SYSTEM-SHIPPED:START -->` and `<!-- SYSTEM-SHIPPED:END -->`.
- Replace a block ONLY if it still contains its shipped placeholder text. The tells are phrases like "Replace this section with your project", "Your project-specific conventions", and "Anything else Claude needs to know about THIS project". If a block has already been filled with real content, leave it byte-for-byte unchanged.
- Use a targeted edit on each placeholder block. Do not rewrite the whole file.

For **## This project**, write what you detected, for example:
- **Project**: one or two lines on what the codebase does (from README / package name).
- **Stack**: the languages, frameworks, and package manager you found.
- **Commands**: the real test / build / lint commands that exist (omit any that do not).
- Leave Production URL / Repo as a short prompt for the buyer to fill if you could not detect them, rather than guessing a value.

For **## Project conventions**, record only conventions you can actually see (for example "TypeScript strict mode is on", "tests live next to source as `*.test.ts`", "lint runs via `pnpm lint`"). If you cannot see any, leave a one-line note that conventions will be added as they emerge. Do not fabricate rules.

For **## Local context**, put anything else concrete you found that does not fit above (CI provider, containerisation, monorepo layout). If there is nothing, a single honest line is fine.

### C. Seed 1-3 starter facts in knowledge-base.md

Add between one and three facts you are genuinely sure of from the scan into `.claude/knowledge-base.md`. Each MUST carry provenance in this exact form, with today's date from Step 1:

```markdown
- Stack is TypeScript on Node, package manager pnpm. [Source: detected on first run, MMDDYY]
- Tests run with `pnpm test` (vitest). [Source: detected on first run, MMDDYY]
```

Write these into the `CUSTOMER-OWNED` section of `knowledge-base.md`, never the `SYSTEM-SHIPPED` block. Only seed what the files prove. A detected command, framework, or package manager is fair game. Do not seed guesses, opinions, or anything you could not point at a file for. Fewer solid facts beat three shaky ones. The completeness gate will reject an entry with no `[Source:]`, so keep the tag.

### D. Ask the smart onboarding questions

Ask the buyer these, briefly and conversationally (not as a wall of text). The point is to capture what the scan cannot see:

1. In a sentence, what is this project?
2. What is the main goal right now?
3. How do you like to work day to day (branching, review, deploy, anything I should respect)?
4. Any key tools, services, or context I would not pick up from the files?

Fold the answers into the matching `CLAUDE.md` sections from Step B (still CUSTOMER-OWNED only), and into `CLAUDE.local.md` if an answer is personal rather than team-wide. If the buyer skips a question, leave that part as a short prompt rather than inventing an answer.

### E. Clear the first-run marker

Once setup is done, remove the marker so later runs skip straight to the normal start:

```bash
rm -f __NEEDS_ONBOARD
```

Then continue into Step 2. Do not stop here.

---

### Step 2: Load memory (parallel reads)

Read simultaneously:
- `.claude/memory.md`
- `.claude/knowledge-base.md`

These are your working context. Knowledge-base entries are mandatory constraints.

### Step 2.5: Read the knowledge graph (only if the memory MCP server is present)

Memory tier 5 (see CLAUDE.md, Memory Architecture) lives in the optional `memory`
MCP server as structured entities and relations. If `mcp__memory__*` tools are
available in this session:

1. Take the 1-3 subjects named in memory.md's Now section (the project name, the
   active feature, the system being worked on).
2. Call `mcp__memory__search_nodes` once per subject (2-3 calls maximum, this is
   a lookup, not a crawl) and skim the returned entities and relations for facts
   that bear on today's priorities.
3. Fold anything relevant into the Step 6 orientation. Do not dump raw graph
   output at the user.

If the `mcp__memory__*` tools are NOT available, skip this step silently. Do not
mention the missing server, do not suggest installing it, do not error. The
file-based tiers (Steps 2-4) are the complete fallback.

### Step 3: Create daily note

Create `Daily Notes/MMDDYY.md` (if it doesn't exist):

```markdown
# MMDDYY - Daily Work Log

## Decisions
-

## Meetings & Conversations
-

## Notes
-

## End of Day Summary
-
```

### Step 4: Open task board

Read `Task Board.md`. Scan for:
- Overdue items (anything from previous days still open)
- Today's priorities
- Blocked items

### Step 5: Task review

For each task in Today:
1. Is it still relevant?
2. Do I have what I need to start?
3. Are there dependencies?

Move stale tasks to Backlog. Flag blocked items.

### Step 6: Ready to work

Output a brief orientation:
- What day it is
- Top 1-3 priorities for today
- Any blockers or open threads from memory.md
- "Ready to work. What's first?"

If this was a first run, lead with one line confirming what setup did (for example "Detected a TypeScript / Next.js project, configured CLAUDE.md, seeded 2 starter facts") before the orientation, so the buyer sees the promised setup actually happened.

Keep it short. The user wants to start working, not read a report.
