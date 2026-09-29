
# Feature update v2026.09.02

**Cadence:** End-of-month Feature update
**What's in this publish:** new agents, commands, skills
**Free quarterly inherits:** NO

---

## What shipped

The memory system is the spine of this publish: an episodic ledger and a decay ledger take Claudify from 6 memory tiers to 8, and the session-memory, pattern-detection, and symmetry work below all hang off that same spine, propagated identically across every layer.

## Claudify base

- **Episodic ledger (`/recall` + `episode-append.sh`, memory tier 7)**: records session outcomes automatically at `/wrap-up` and `/safe-clear`. Query with `/recall` to see what happened last time you touched a file or task, without loading full session history.

- **Decay ledger (`/forget` + `staleness-scan.sh`, memory tier 8)**: flags stale memory by TTL class at `/sync` and lets you archive confirmed-stale facts to `memory/attic/`, reversible, never deleted. Keeps always-loaded memory sharp instead of accumulating.

- **Memory architecture, 6 tiers to 8**: `CLAUDE.md` documents the full 8-tier system, core memory now loads natively via `@.claude/memory.md`, and every agent's `MEMORY.md` is enforced against its agent with `check-agent-memory-symmetry.sh`, propagated identically across base, SEO, content, and Analyst.

- **Session-memory completion pass**: the auto-handoff written before every compaction now carries a substantive state summary, `validate-handoff.sh` runs on every manual compaction, and `detect-patterns.sh` auto-nominates recurring failures into your knowledge-nominations queue.

- **`/enhance` and `/intel` commands**: `/enhance` compiles a raw prompt into an agent-tailored version against a seeded registry. `/intel` scans the Claude ecosystem for new features and patterns against your installed system. Two new skills, site-hardening and spec-driven-dev, back further specialist work.

The base system now counts 24 automated checks, 70 commands, and 1,737 skill files across 34 categories; your specialist layers add their own agents, commands, and hooks on top.

## SEO Specialist

- **`/seo-learn` command + `seo-auditor` agent**: predict-then-grade calibration. Every recommendation logs a prediction record and gets graded against the actual outcome at day 7 and day 28, and the auditor now blocks unproven claims from shipping.

- **`/seo-watch` command**: a lightweight daily loop checks rank movement, indexation, Core Web Vitals, and AI-citation changes against your last baseline, and alerts only when a real threshold is crossed. Runs unattended, no browser or full audit needed.

- **8 new SEO doctrine skills**: authority-building, competitor-analysis, geo-mastery, keyword-mastery, serp-features, SEO blog, SEO mastery, and technical SEO now ship as dedicated skill files your SEO layer loads on demand instead of scattered guidance.

## Content Specialist

- **`content-creator` agent, four modes restored**: ad card, X post, still-to-video, and AI Reel generation are back in the pipeline alongside motion graphics and composite modes, unblocking four content formats.

- **`/trend-scan` command**: gathers industry trends, competitor creative intelligence, and platform signals once per brand into a shared pool that every downstream agent reads automatically, instead of each one re-researching separately.

- **`content-auditor` agent + `MISTAKES-LOG.md`**: a 5-dimension hard-gate rubric blocks content before it ships, and a new regression log means a caught failure pattern gets fixed once and never recurs.

- **`/newsletter-month` command**: batch-produces and schedules roughly four newsletter issues through the existing pipeline behind one approval, instead of running the per-issue flow four separate times.

## Settings.json additions

> The update prompt below merges every settings registration for you automatically. This snippet is a manual fallback covering only the two headline registrations; prefer the prompt.

Add to your `.claude/settings.json` under `hooks.PreCompact`, splitting the existing `"auto,manual"` matcher into two blocks so `validate-handoff.sh` only runs on manual compaction. Merge into your existing `hooks` block; don't overwrite your other entries.

```json
{
  "hooks": {
    "PreCompact": [
      {
        "matcher": "auto",
        "hooks": [
          { "type": "command", "command": "\"$CLAUDE_PROJECT_DIR/.claude/hooks/pre-compact-handoff.sh\"", "timeout": 5, "statusMessage": "Saving state before compaction..." }
        ]
      },
      {
        "matcher": "manual",
        "hooks": [
          { "type": "command", "command": "\"$CLAUDE_PROJECT_DIR/.claude/hooks/pre-compact-handoff.sh\"", "timeout": 5, "statusMessage": "Saving state before compaction..." },
          { "type": "command", "command": "\"$CLAUDE_PROJECT_DIR/.claude/hooks/validate-handoff.sh\"", "timeout": 5, "statusMessage": "Validating the session handoff..." }
        ]
      }
    ],
    "SessionStart": [
      {
        "matcher": "user",
        "hooks": [
          { "type": "command", "command": "\"$CLAUDE_PROJECT_DIR/.claude/hooks/check-agent-memory-symmetry.sh\"", "timeout": 3, "statusMessage": "Checking agent-memory symmetry..." }
        ]
      }
    ]
  }
}
```

## Try this next

After updating, try `/recall "what happened when we touched X"` for a file, command, or topic you've worked on recently. It queries the new episodic ledger directly and surfaces the outcome, decision, and lesson from your last sessions there.

With thanks to Mikael Pettersson for same-day field reporting on this release. The hook hardening wave (cross-platform fixes, the package-build lint gate, and three-platform CI) shipped within hours of his reports.

## How to update

Download the latest package from the link in this email (or recover it any time at claudify.tech/recover), keep it zipped, open Claude Code in your project, and paste the update prompt included below this changelog. Claude applies the whole update for you: it stages the files, merges them additively so everything you have written stays untouched, verifies its own work, and then demonstrates the new capabilities live.

### The update prompt

Copy everything in this block and paste it into Claude Code in your project:

```text
Apply my Claudify update. The downloaded zip is in my Downloads folder (claudify-*.zip, newest one); if you cannot find it, ask me for the path. Do not unzip it into my project directly. Follow this procedure exactly:

1. STAGE. Extract the zip into a temporary folder called .claudify-update-staging/ inside my project. Never extract into the project root.

2. PROTECT. First record a checksum of every protected file that exists, so step 4 can prove they survived. These are MINE and must never be overwritten, whatever the staging tree contains: always mine: CLAUDE.md (everything outside the SYSTEM-SHIPPED markers), CLAUDE.local.md, .mcp.json, .gitignore, and .claude/memory.md; mine ONLY IF they differ from every shipped version: .claude/settings.json, .claude/knowledge-base.md, and every .claude/agent-memory/**/MEMORY.md. Ownership algorithm: hash my file (LF-normalized) and compare against BOTH the staged .claude/UPDATE-MANIFEST.json and my installed .claude/UPDATE-MANIFEST.json if I have one; a match against either means it is an untouched vendor file, safe to update wholesale; matching neither means it is mine and must be kept (for settings.json, fall back to the per-group merge rule in step 3). Note: manifests installed before September 2026 carry a path bug where keys lost the leading dot (claude/... instead of .claude/...); normalize keys before comparing. Also always mine: anything in memory/ I have written, and my working files Task Board.md, Scratchpad.md, and Daily Notes/ if they exist with content. If I do not have one of these files yet, copy the shipped version as my starting point.

3. MERGE ADDITIVELY. Rule of ownership: a file that exists in the staging tree is system-shipped unless it is on the protect list. Copy every new system file into place (any faithful copy method is fine; if one tool is blocked by my permission settings, use another). WHATS-NEW.md is copied into my project root deliberately: it is my installed record of this update. Update every existing system file (agents, commands, skills, hooks, INTEGRATION.md, SETUP.md) to the staged version, with one exception: .claude/command-index.md is never copied; after the merge, regenerate it from what is actually installed (one row per file in .claude/commands/, name from the filename, description and argument hint from each file's frontmatter), so the catalog always matches my real install. For CLAUDE.md, replace only the content between the SYSTEM-SHIPPED markers and leave every other line of mine untouched; if my current shipped block documents specialist layers (SEO, content, analyst) that the staged block does not, carry those specialist sections into my CUSTOMER-OWNED block first so no layer documentation is lost; if my content after the shipped block is not yet wrapped in CUSTOMER-OWNED markers, fold it into the existing CUSTOMER-OWNED block (or create exactly one pair if none exists); never create a second marker pair. For .claude/settings.json, merge per event-and-matcher group: any group I have never customized is taken wholesale from the staged file; any group I have customized stays exactly as mine, additions and deletions included. My permissions and every other key of mine are preserved untouched. Validate the result parses as JSON.

4. VERIFY YOUR OWN WORK. Run bash -n on every hook script this update added or changed (use the staged .claude/UPDATE-MANIFEST.json version and hashes to identify them; on a first-time merge just check them all). Run the hook test suite at .claude/hooks/tests/ if present (via its run-all.sh runner, which builds its own fixture; individual test files are not meant to run bare). Confirm my protected files are byte-identical to before the merge except where I approved a merge. Confirm the new memory directories exist (memory/episodes/, memory/attic/, memory/.staleness.json). If anything failed, say so plainly and stop.

5. SHOW ME. Read WHATS-NEW.md at the root of the staging tree, then give me your honest read on what this update actually adds and how well it is engineered. Then demonstrate, live: show the 8-tier memory architecture map from CLAUDE.md, append the first episode to my episodic ledger recording this update (run exactly: bash .claude/hooks/episode-append.sh --task "Applied Claudify update v2026.09.02" --outcome success --domain system-maintenance, checking the script header first if the flags differ), run bash .claude/hooks/staleness-scan.sh and show me the report, and list the new commands I can now run (/recall, /forget, /enhance, /intel, and my layer extras).

6. CLEAN UP. Remove the staging folder with: find .claudify-update-staging -type f -delete && find .claudify-update-staging -depth -type d -exec rmdir {} + (my currently loaded safety hooks block recursive force deletion, and that is correct behavior; do not fight them). Then confirm my project is clean.
```
