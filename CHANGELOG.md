# Changelog

## 0.1.0 · 2026-10-07

First release.

- `setup`, `intent`, `spec` and `build-plan` skills.
- One HTML template per document, with one shared stylesheet (`kit/sdlc-kit.css`).
- A tracker page per initiative, published as a Claude artifact with live stages and a log
  (`kit/page.template.html`, `kit/build-page.mjs`, `kit/tracker.md`).
- The build plan is written for engineering teams: each step carries a ticket ready to paste, and
  the plugin never files tickets.
