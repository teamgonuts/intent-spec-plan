# intent-spec-plan

A Claude Code plugin that shapes any initiative in three approved steps, before anyone builds it:

1. **Intent**: what you want, why, and within which limits. Claude asks one question at a time, each
   with a recommended answer and real numbers, then writes a one-page intent in your words.
2. **Spec**: exactly what will be built. It shows what users will see in every state, the rules and
   limits, what could go wrong and what stops it, and every requirement with the test that proves
   it. The plain view comes first, and the engineers' detail is folded underneath.
3. **Build plan**: the order it is built in. Each step is one ticket for an engineering team, with
   its files, tests and live check, and ends with a ticket ready to paste into your tracker.

Each step is **one HTML file** that you approve as a page and engineers read as text. Every
initiative also gets a **tracker page**: one Claude artifact that shows where the initiative
stands, embeds all three documents, and keeps a log of decisions. Setting a stage to *Approved*
on that page is your approval.

Nothing moves forward without approval. There is no spec until the intent is approved, and no plan
until the spec is.

## Install

In Claude Code:

```
/plugin marketplace add teamgonuts/intent-spec-plan
/plugin install intent-spec-plan@teamgonuts
```

## Use

| Command | What it does |
|---|---|
| `/intent-spec-plan:setup` | Once per project. Records who approves, the project's name, its code repositories, where the documents live, its standing rules, and where real numbers come from. |
| `/intent-spec-plan:intent` | Starts an initiative: creates its tracker page, asks its questions, and writes `intent.html`. |
| `/intent-spec-plan:spec` | After the intent is approved: writes `spec.html`. |
| `/intent-spec-plan:build-plan` | After the spec is approved: writes `plan.html`. |

You don't have to type the commands. Describing what you want ("I want to shape a feature that
lets customers…") is enough to start the intent, and each step points to the next.

## What you get

```
intent-spec-plan.json          your project's settings (from setup)
initiatives/
  sdlc-kit.css                 the shared stylesheet (master copy)
  standing-rules.md            rules every initiative inherits (optional)
  refund/
    intent.html                step 1
    spec.html                  step 2
    plan.html                  step 3
    sdlc-kit.css               a copy, so the files open styled from disk
    tracker.json               the tracker page's words and its artifact URL
    page.html                  the built tracker page (generated)
```

## How it works

- **Documents are files.** The tracker page embeds each document's title band and `<main>`
  unchanged, so the page you approve is the file engineers read.
  [`kit/build-page.mjs`](kit/build-page.mjs) rebuilds the page whenever a document changes.
- **Progress is live.** The stages and the log live in the artifact's own database, so they update
  without republishing. See [`kit/tracker.md`](kit/tracker.md).
- **Every document is checked before you see it.** Placeholders, the template's rules, and fresh
  reviewer agents on different models each get a pass. The intent gets one reviewer; the spec and
  the plan get two, one for accuracy against the code and one for intent and safety.
- **Your words are kept.** Each document ends with the questions you were asked and your exact
  answers. Changes after approval are dated amendments.
- **Tickets are never filed for you.** The plan carries them, ready to paste, and you decide where
  they go.

## Requirements

- Claude Code with artifacts, for the live tracker page. Without them, the page is still built
  locally and opens from disk.
- Node.js 18 or newer, to build the tracker page. Without it, Claude assembles the page by hand.
- Access to your code repositories, for the spec and the plan. Setup asks for them. If you don't
  know them yet, Claude asks the first time it needs to read code.
- Optional data connectors (analytics, a warehouse, support tools), so questions and specs carry
  real numbers.

## Credits

The question-at-a-time discipline is adapted from the brainstorming skill in
[obra/superpowers](https://github.com/obra/superpowers) by Jesse Vincent (MIT). The spec's two
layers follow the Rust RFC process's guide-level and reference-level explanations.

## License

MIT. See [LICENSE](LICENSE).
