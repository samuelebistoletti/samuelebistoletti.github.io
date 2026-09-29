# Command Index

Auto-generated from the installed command files, one row per file in
`.claude/commands/`. Regenerated at package build time and by the update
procedure, so this catalog always matches the system actually installed.
Do not hand-edit; additions belong in the command files themselves.

36 commands installed.

| Command | Arguments | What it does |
|---|---|---|
| `/audit` | "[scope]" | Run the auditor agent against recent work or a specific file/task |
| `/brief` | "[project idea]" | Turn a rough idea into a structured project brief |
| `/competitive-intel` | "[your product or market]" | Deep competitive analysis - research, compare, strategise |
| `/debt-map` | "[directory or project]" | Map and prioritise technical debt across your codebase |
| `/drift-detect` | "" | Detect system configuration drift - find stale rules, contradictions, and orphans |
| `/enhance` | "<raw prompt text>" | Transform a raw prompt into an agent-tailored, project-aware enhanced prompt |
| `/forget` | "" | Governed forgetting - review the staleness scan with the user and archive confirmed-stale memory to the attic (reversible, never deletes) |
| `/handoff` | "[who you're handing off to]" | Structured session handoff to another person or AI |
| `/intel` | "[optional: specific focus area like 'hooks', 'MCP', 'agent SDK']" | Claude ecosystem intelligence scan that finds new features, patterns, and improvement opportunities for your installed system |
| `/launch` | "[product or feature to launch]" | Full product launch pipeline - from idea to go-to-market plan |
| `/memory-consolidate` | "[--dry-run]" | Reflective consolidation pass over memory files. Merges duplicates, expires stale guesses, resolves contradictions, prunes to caps. Conservative and reversible. |
| `/migrate-to-2` | "[optional: path to install, defaults to cwd]" | Upgrade an installed Claudify config from 1.0 to 2.0 in place, backup first, never overwrite your customizations |
| `/mutation-gate` | "[file or path to mutate, or blank for the current change]" | Run mutation testing on changed files - reports the mutation SCORE and surviving mutants, PASS/FAIL on a threshold |
| `/onboard` | "[project directory or repo URL]" | Onboard to a new codebase - architecture scan, key decisions, first tasks |
| `/playbook` | "[name for the playbook]" | Record a workflow and auto-generate a reusable command from it |
| `/proposal` | "[project or client name]" | Generate a client proposal from a project brief |
| `/prove` | "[the claim to prove, or blank for the most recent one]" | Force the loop closed on a completion claim - run the verifier and report real PASS/FAIL with command evidence, or say honestly what could not be verified |
| `/recall` | "[query \| domain \| --outcomes]" | Query the episodic ledger - what happened when we touched X, success rate on Y - via grep/tail only, never full-file loads |
| `/release` | "[version or date range]" | Generate audience-aware release notes from git history |
| `/report` | "[topic and audience]" | Generate a professional report from data or findings - audience-aware |
| `/retro` | "[time period]" | Sprint retrospective - review what worked, what didn't, improve process |
| `/review` | "[file, directory, or PR]" | Deep code review - security, performance, architecture, and actionable fixes |
| `/safe-clear` | "" | Distill session state to disk, then run /compact to actually flush context |
| `/security-review` | "[the change, branch, or files to review]" | Adversarial read-only security pass over your git diff - severity-ranked findings with file:line and a concrete fix |
| `/standup` | "" | Quick daily standup - yesterday, today, blockers from git and tasks |
| `/start` | "" | Start the day - load memory, open task board, ready to work |
| `/sync` | "" | Mid-day sync - review daily note, update memory, process notes |
| `/system-audit` | "" | Deep infrastructure audit of the entire operating system |
| `/test-hooks` | "[hook-name]" | Run the hook-proofs harness and present the PASS/FAIL table for every shipped hook |
| `/test` | "[file or path to test, or blank for the current change]" | Write focused tests for a change, then run them to prove they pass - PASS/FAIL with real evidence |
| `/undo-bash` | "[snapshot-id \| latest \| list]" | List recent safe-run bash snapshots and restore one (or the latest) to its original location |
| `/unstick` | "[what you're stuck on]" | When you're stuck on a problem - get unstuck fast |
| `/utilization` |  | Map what is installed against what has actually been used, then suggest the 3 highest-value unlocks for how this specific user works |
| `/verify` | "[the change, branch, or feature to verify]" | Prove a change works by running the project, not by reading it - PASS/FAIL with real evidence |
| `/which-layer` | "[what you want Claude to do]" | Recommend the right Claude Code layer for a goal (CLAUDE.md, skill, subagent, hook, command, or MCP) and scaffold it |
| `/wrap-up` | "" | End of day - sync memory, clear done list, externalize knowledge, prep tomorrow |
