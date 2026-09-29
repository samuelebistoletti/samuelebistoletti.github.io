---
name: _TEMPLATE
description: Copy this file to create a new domain memory file. One file per durable topic (a project area, an integration, a service). Replace every bracketed placeholder.
type: domain-memory
---

# [Domain name]

One or two lines on what this domain covers and why it has its own memory file.

## Current state

- [What is true about this domain right now. Keep it short and current.]

## Dated log

Append one line per session that materially touched this domain (this is where
`/safe-clear` Step 4b writes). Newest at the bottom. One line per session, no more.

- [MMDDYY] [What happened in this domain this session.]

## Durable facts

- [Facts worth keeping beyond the log. Tag provenance: [verified] or [guessed].]

<!--
How this file gets used:
- Register the domain in .claude/hooks/topic-routing.yml so auto-load-topics.sh
  surfaces this file when the topic comes up, e.g.:
    my-domain:
      - memory/my-domain.md
- /safe-clear Step 4b appends a dated line here when a session did substantive
  work in this domain.
- /memory-consolidate treats these files as in scope for merge/expire passes.
Naming: memory/{domain}.md for areas, memory/integration_{name}.md for
third-party systems, memory/project_{name}.md for sub-projects.
-->
