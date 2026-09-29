# Knowledge Base

System-wide learned rules. Read by ALL agents and sessions at startup.
Entries are mandatory constraints, not suggestions.

<!-- SYSTEM-SHIPPED:START -->
<!--
  Content between SYSTEM-SHIPPED markers is the Claudify system layer.
  Installing an update (re-download and copy the new .claude/ files over) replaces this section.
  To override a system rule, add a contradicting rule in the CUSTOMER-OWNED section below.
  Local rules win because the auditor reads top-to-bottom.
-->

## Provenance Hierarchy

Every entry MUST cite its source using one of:
- `[Source: user override MMDDYY]`, User explicitly corrected something
- `[Source: empirical MMDDYY]`, Verified through testing or data
- `[Source: agent inference MMDDYY]`, Pattern observed by an agent, confirmed by auditor
- `[Source: system MMDDYY]`, shipped with a Claudify update

## System Hard Rules

(none yet, rules accumulate as Claudify updates ship system-wide constraints)

## System Platform & Tool Rules

(none yet)

## System Project Patterns

(none yet)

## System Known Failure Modes

(none yet)

<!-- SYSTEM-SHIPPED:END -->

<!-- CUSTOMER-OWNED:START -->
<!--
  Content between CUSTOMER-OWNED markers is YOURS.
  Installing an update will never modify anything in this section.
  Add your project-specific rules, learned constraints, and overrides here.
  Rules in this section win over SYSTEM-SHIPPED rules (auditor reads top-to-bottom).
-->

## Your Hard Rules

(your rules accumulate here as you work and your auditor validates learnings, use the same provenance format)

## Your Platform & Tool Rules

(your project-specific platform constraints, deploy rules, infrastructure quirks)

## Your Project Patterns

- Static site: plain HTML/CSS/vanilla JS, no build, no deps, no tests; deployed by GitHub Pages from `main` (CNAME samuele.bistoletti.me). [Source: detected on first run, 092926]
- `index.html` and `it/index.html` are hreflang-paired EN/IT mirrors; edits must land in both. [Source: detected on first run, 092926]
- `m0fex10t-ur7gmcli-r7i92y/` is noindex and excluded from `sitemap.xml`; keep it unlisted. [Source: detected on first run, 092926]

## Your Known Failure Modes

(your project-specific things that went wrong before and should never happen again)

<!-- CUSTOMER-OWNED:END -->
