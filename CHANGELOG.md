# Changelog

## 0.2.0 · 2026-10-07

- The tracker page is redesigned in a paper, slate and mint palette, with tracked uppercase display
  type.
- A sticky top band switches between the overview, the intent, the spec and the plan, and shows
  each stage's status as a live dot. Deep links (`#spec`, `#step-3`) open the right view.
- The stages show correctly before the live database answers, read from each document's status
  line.
- The shared stylesheet (`kit/sdlc-kit.css`) uses the same palette, so the documents match the page
  when opened from disk.
- The README gains its banner and leads with the AI-native SDLC playbook the loop is based on.
  Each skill names the playbook stage it implements.

## 0.1.0 · 2026-10-07

First release.

- `setup`, `intent`, `spec` and `build-plan` skills.
- One HTML template per document, with one shared stylesheet (`kit/sdlc-kit.css`).
- A tracker page per initiative, published as a Claude artifact with live stages and a log
  (`kit/page.template.html`, `kit/build-page.mjs`, `kit/tracker.md`).
- The build plan is written for engineering teams: each step carries a ticket ready to paste, and
  the plugin never files tickets.
