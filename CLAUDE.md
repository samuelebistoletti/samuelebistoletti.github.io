# Claude Context: Claudify

This project uses Claudify, a professional operating system for Claude Code.
Always read `.claude/memory.md` before taking action.

<!-- SYSTEM-SHIPPED:START -->
<!--
  Content between SYSTEM-SHIPPED markers is the Claudify system layer.
  Installing an update (re-download and copy the new .claude/ files over) replaces this section.
  To override a system rule, add a contradicting rule in the CUSTOMER-OWNED section below.
  Local rules win because the auditor reads top-to-bottom.
-->

## Core memory (loaded every session)

@.claude/memory.md

The line above is a native Claude Code import: the contents of `.claude/memory.md` load into the main session deterministically at every session start, not just when a command remembers to read it. This closes the gap where subagents get their mandatory reads injected by the `SubagentStart` hook but the main conversation could still start blind.

`knowledge-base.md` is deliberately NOT imported here: it can be up to 200 lines (roughly 2K tokens on every session start, most sessions never need all of it), it is already injected into every subagent via the mandatory-reads hook, and `/start` Step 2 reads it at the start of every working session. Importing it would pay its full token cost in every session, including trivial ones. If your knowledge base is small and you want it always-on, add `@.claude/knowledge-base.md` in the CUSTOMER-OWNED section below.

**Add your own imports (CUSTOMER-OWNED section):** any `@path` on its own line imports that file, so you can make your own project files load deterministically, for example `@memory.md` for a root-level memory file, `@docs/architecture.md`, or `@memory/integration_stripe.md` for a domain memory file. Keep imports small and load-bearing; every imported line costs context in every session.

**Global vs project resolution:** relative `@paths` resolve against the file containing the import, so `@.claude/memory.md` here always means THIS project's memory. A `~/.claude/CLAUDE.md` (global install) loads for every project and its imports resolve against `~/.claude/`; the project CLAUDE.md loads on top of it, and project rules win on conflict. If you installed Claudify globally AND per-project, the per-project files are the ones this import loads.

## Quick Start
- Run `/start` to begin work
- Run `/sync` mid-day to refresh memory
- Run `/wrap-up` at end of day
- Run `/audit` to verify recent work quality
- Run `/test` to write focused tests for a change and run them to prove they pass
- Run `/prove` to force the loop closed on a done-claim, real PASS/FAIL with command evidence
- Run `/mutation-gate` to check your tests actually catch bugs (mutation score on changed files)
- Run `/memory-consolidate` to merge duplicates, expire stale guesses, and prune memory
- Run `/undo-bash` to restore a file a destructive bash command changed (from a safe-run snapshot)
- Run `/verify` to prove a change works by running it, not just reading it
- Run `/security-review` for an adversarial security pass on your diff
- Run `/test-hooks` to prove every shipped hook fires and blocks as documented
- Run `/safe-clear` to safely flush context and resume fresh
- Run `/unstick` when stuck on a problem
- Run `/retro` for sprint retrospective
- Run `/system-audit` for deep infrastructure audit
- Run `/enhance <prompt>` to compile a raw prompt into an agent-tailored, project-aware version
- Run `/intel [focus]` to scan the Claude ecosystem for new features, patterns, and improvement opportunities
- Run `/recall [query]` to query the episodic ledger: what happened when we touched X, success rate on Y
- Run `/forget` to review stale memory and archive it to the attic (reversible, never deleted)

## Key Files
- Memory: `.claude/memory.md` (read this for current context)
- Knowledge Base: `.claude/knowledge-base.md` (system-wide learned rules, read before every task)
- Task Board: `Task Board.md`
- Scratchpad: `Scratchpad.md` (quick capture, processed during /sync, cleared at /wrap-up)
- Daily Notes: `Daily Notes/` (created automatically by /start)
- Knowledge Nominations: `.claude/knowledge-nominations.md` (candidate learnings, auditor reviews)
- Command Index: `.claude/command-index.md` (all commands with triggers and tools)
- Episodes: `memory/episodes/` (append-only session ledger; read `INDEX.md` only, query the rest via /recall)
- Attic: `memory/attic/` (archived-not-deleted memory, moved there by /forget; decay rules in `memory/.staleness.json`)

## System Architecture
- **Agents** (`.claude/agents/`): Specialist subagents with persistent memory
  - `auditor`: Quality gate. Reviews work, promotes knowledge, proposes SOP revisions
  - `unsticker`: Unblocks you when stuck. Root-cause analysis, fresh approaches
  - `error-whisperer`: Translates cryptic errors into fixes. Pattern matching across sessions
  - `rubber-duck`: Forces you to articulate the real problem. Socratic debugging
  - `pr-ghostwriter`: Writes PR descriptions, commit messages, changelogs from diffs
  - `yak-shave-detector`: Catches scope creep. "You started doing X but now you're doing Y"
  - `debt-collector`: Tracks tech debt. Catalogues shortcuts, suggests when to pay them down
  - `onboarding-sherpa`: Learns a new codebase fast. Architecture maps, key-file identification
  - `archaeologist`: Excavates why code exists. Git blame + context reconstruction
  - `verifier`: Runs the project to prove a change works. PASS/FAIL with real command evidence, never a code-reading opinion
  - `security-review`: Adversarial read-only security pass over your diff. Severity-ranked findings with file:line and a concrete fix
  - `test-writer`: Writes focused tests for a change, then hands to verifier to prove they run. PASS/FAIL with real evidence, not a code-reading opinion
- **Commands** (`.claude/commands/`): Workflow rituals and utilities
- **Hooks** (`.claude/hooks/`): Deterministic safety enforcement (logging, verification). Every shipped hook has a proof: run `/test-hooks` to see each one fire and block exactly as documented (tests live in `.claude/hooks/tests/`).
- **Logs** (`.claude/logs/`): Audit trail + incident log, auto-populated by hooks
- **Skills** (`.claude/skills/`): Domain knowledge, loaded on demand

**Commands and skills are one mechanism.** Since July 2026, Claude Code treats them identically: `.claude/commands/name.md` and `.claude/skills/name/SKILL.md` both register `/name`. Claudify keeps workflow rituals in `commands/` and domain knowledge in `skills/` as an organizational convention, not a platform distinction. New slash commands you author may use either format.

**Subagent defaults (Claude Code 2.1.198+):** subagents run in the background by default. Every shipped command that consumes a subagent's verdict in-procedure states `run_in_background: false` at the spawn step; do the same in your own pipelines. Nested spawning (an agent spawning agents) is opt-in via the `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH` environment variable; this template presets it to 2 in `.claude/settings.json`. Concurrency caps: 20 subagents at once, 200 per session. No shipped Claudify pipeline comes near either cap.

**Hook matcher semantics (July 2026):** matchers containing a hyphen are now exact-match; use `mcp__server__.*` to cover a whole MCP server. Comma lists (`"auto,manual"`) fire on each listed value. In `if:` conditions, a single-segment `dir/**` glob is cwd-only; use `**/dir/**` to match at any depth. All shipped matchers were audited against these rules and none were affected.

## Memory Architecture (8 Tiers)
1. **memory.md**: Active session context (what you're doing now). Loaded every session via the native import above.
2. **Agent Memory** (`.claude/agent-memory/`): Per-agent persistent knowledge across sessions. Symmetry rule: every agent in `.claude/agents/` has a matching `MEMORY.md` (checked at SessionStart; see `.claude/agent-memory/README.md`)
3. **Knowledge Base** (`.claude/knowledge-base.md`): System-wide learned rules (auditor-gated; all writes route through nominations)
4. **Knowledge Nominations** (`.claude/knowledge-nominations.md`): Candidate learnings pipeline. Fed by `/wrap-up`, `/safe-clear`, `/memory-consolidate`, and automatically by the failure pattern detector (`detect-patterns.sh`)
5. **MCP Knowledge Graph**: Structured entities and relations (if the memory MCP server is enabled). Read at `/start` Step 2.5, written at `/wrap-up` Step 5b; both degrade silently when the server is absent
6. **Daily Notes**: Chronological session history and handoff records
7. **Episodic Ledger** (`memory/episodes/`): Append-only session outcomes, one JSON record per episode (task, outcome, domain, files, decision, lesson) in `YYYY-MM.jsonl` files, written by `episode-append.sh` at `/wrap-up` and `/safe-clear`. Queried with `/recall`. **Load policy:** `INDEX.md` (capped at 20 lines by the writer) may be loaded into context; the episode `.jsonl` files never are, they are grep/tail territory only
8. **Decay Ledger** (`memory/.staleness.json` + `memory/attic/`): Governed forgetting. Every memory surface carries a TTL class (permanent, 90d, 14d); `staleness-scan.sh` reports stale candidates at `/sync`, and `/forget` archives confirmed ones to the attic with a dated header, reversible, never deleted. This is the only setup that forgets on purpose; context stays sharp because stale facts are retired, not accumulated

Domain memory files (`memory/*.md`) extend tier 1 horizontally: one file per durable topic, created from `memory/_TEMPLATE.md`, routed by `.claude/hooks/topic-routing.yml`, and appended to by `/safe-clear` Step 4b. Tiers 7 and 8 live beside them under `memory/` so the whole file-based layer family is co-located.

## Command Awareness

All agents can invoke system commands. Read `.claude/command-index.md` for the full catalog.

- **Self-execute**: If you have the tools a command requires, read `.claude/commands/{name}.md` and follow the procedure directly.
- **Recommend**: If you lack the tools, output `RECOMMEND: /command [args]: [reason]` for the orchestrator.
- Agents should proactively invoke commands when trigger conditions match.

## Retrieval Map: Where to look for what

| You need... | Check first | Then |
|---|---|---|
| What am I doing right now? | `memory.md` → Now | Task Board → Today |
| How to do a procedure | `.claude/commands/` or `.claude/skills/` | CLAUDE.md |
| A fact or learned rule | `knowledge-base.md` | Agent memory |
| What happened on a specific day | `Daily Notes/MMDDYY.md` | Audit trail |
| What happened when we touched a topic, success rate | `/recall` (episodes INDEX, then grep) | `Daily Notes/` |
| A fact that seems missing (maybe retired) | `memory/attic/` | `.claude/logs/.staleness-report.md` |
| What went wrong before | `knowledge-base.md` → Hard Rules | Agent memory → Known Patterns |
| What commands exist | `.claude/command-index.md` | `.claude/commands/{name}.md` |

## Context Health (context autopilot)

Sessions have finite context. The default model's native 1M context window (Sonnet 5, June 2026) makes overflow rare in normal sessions, and when it does approach, the flush is automatic. Nobody watches a gauge. Three rules make that lossless:

1. **Keep the handoff warm.** At every natural task boundary (a phase finishing, a domain switch), refresh a short Session Handoff (Task, Done, Remaining, Decisions, Files, Refs, Next) in today's daily note. An excellent handoff is always on disk.
2. **The flush is automatic.** Claude Code auto-compacts on its own when context fills. Claude never tells the user to flush and never runs `/safe-clear` for quality reasons. Manual `/safe-clear` followed by `/compact` stays available if the USER wants an explicit distill; Claude never requests it.
3. **Resume is deterministic.** The `PostCompact` hook surfaces the latest handoff and instructs the resumed session to continue the Next action without asking. The honest limit, stated plainly: an early forced flush at a chosen quality point is not possible (a command cannot reduce its own context); the warm handoff makes the automatic one lossless.

**Automatic safety net (hooks):**
- `PreCompact` hook writes a substantive auto-handoff (memory Now section + files touched this session + the latest daily-note Session Handoff) to `.claude/logs/.auto-handoff.md` before compaction, auto and manual, so even an un-prepped session resumes from real state. On manual compaction it additionally runs `validate-handoff.sh` and surfaces any handoff gaps
- `PostCompact` hook restores context after compaction (surfaces the agent-authored handoff first, the auto-handoff as gap-filler)
- `PostToolUseFailure` chain: `log-failures.sh` categorizes every tool failure, then `detect-patterns.sh` fingerprints it; a failure recurring past its threshold (CRITICAL 3x, ERROR 5x, WARN 10x) is auto-nominated to `knowledge-nominations.md` for the auditor (requires `jq`, silent no-op without it)
- `SessionStart(compact)` hook remains wired as a fallback for Claude Code versions without the PostCompact event; scheduled for removal in September
- `SessionStart(user)` hook resets stale gate files on every fresh session
- `SubagentStart` hook injects each subagent's mandatory reads (knowledge base + its own memory) so agents cannot forget the rulebook
- `StopFailure` hook logs any quality-gate hook that fails to run, so the trust layer reports its own failures
- `claim-check` + `safe-run` hooks are active: `claim-check` (Stop, SubagentStop) flags done-claims that lack evidence so they get proven not trusted, and `safe-run` (PreToolUse Bash) snapshots files before a destructive bash command so `/undo-bash` can restore them

**Completeness gates (PreToolUse Write|Edit, hard blocks):**
- **knowledge-base.md**: Every entry needs `[Source:]` provenance, max 200 lines, no TBD/TODO
- **memory.md**: Max 100 lines (Write only)
- **settings.json**: Must be valid JSON (broken JSON breaks all hooks)
- **Agent defs** (`.claude/agents/*.md`): No TBD/TODO. Instructions must be definitive.
- **Ungated** (iterative by nature): Daily Notes, Scratchpad, Templates, Logs, Commands, Skills

**How /safe-clear works (user-initiated only):** Distills session state into memory.md + a daily note handoff, preserving retrieval paths, then STOPS and instructs the user to run `/compact`. The PostCompact hook reads the handoff and continues from Next. A command cannot reduce its own context (every read inside it adds tokens), so `/safe-clear` never auto-resumes and Claude never recommends it proactively.

## Maintenance
- Keep memory.md compact (<100 lines)
- Aggressively prune stale items
- Done list cleared on Fridays
- Review incident log during /sync and /wrap-up
- Auditor proposes SOP revisions. User approves before changes apply.

<!-- SYSTEM-SHIPPED:END -->

<!-- CUSTOMER-OWNED:START -->
<!--
  Content between CUSTOMER-OWNED markers is YOURS.
  Installing an update will never modify anything in this section.
  Add your project-specific orientation, overrides, and conventions here.
  Rules in this section win over SYSTEM-SHIPPED rules (auditor reads top-to-bottom).
-->

## This project

- **Project**: Samuele Bistoletti's personal site. A bilingual (EN/IT) landing page for independent Home Assistant and smart home consulting, plus Italian referral landing pages (Octopus Energy, V2C). Goals: win consulting clients, grow referral revenue, SEO visibility, personal brand.
- **Stack**: Static HTML + CSS + vanilla JS. No build step, no package manager, no dependencies, no test suite.
- **Commands**: none. Preview locally with any static server (e.g. `python3 -m http.server`).
- **Production URL**: https://samuele.bistoletti.me/ (GitHub Pages via `CNAME`)
- **Repo**: github.com/samuelebistoletti/samuelebistoletti.github.io

## Project conventions

- `index.html` (EN) and `it/index.html` (IT) are mirrors: any change to copy, structure, meta tags or JSON-LD goes into both, and the hreflang links stay paired.
- Shared assets live in `assets/` (`styles.css`, `site.js`, self-hosted font, `icons.svg`, `og-image.svg`). `site.js` picks EN/IT strings from `<html lang>`.
- Referral pages are Italian-only at `octopus-energy-referral/` and `v2c-discount-code/`, with IT alias copies at `it/referral-octopus-energy/` and `it/codice-sconto-v2c/`. Each new landing page needs its alias, a `sitemap.xml` entry, and a canonical tag plus meta tags.
- `m0fex10t-ur7gmcli-r7i92y/` is deliberately unlisted (`noindex`). Never add it to the sitemap or link to it.
- Italian copy reads as natural, professional Italian, not a literal translation.
- Dark theme only. Mobile-first. Respect `prefers-reduced-motion`.

## Local context

- Workflow: edit locally, commit, push straight to `main`. GitHub Pages deploys it. There's no CI.
- `robots.txt` disallows `/cdn-cgi/`, which means Cloudflare likely sits in front of the site.
- Claudify files are committed to this public repo by choice. Pages runs Jekyll by default, so committed `.md` files at the root (e.g. `CLAUDE.md`, `Task Board.md`) may be served publicly unless excluded.
- Before every push, QA: links, accessibility, mobile layout, performance, SEO tags, EN/IT parity.

<!-- CUSTOMER-OWNED:END -->
