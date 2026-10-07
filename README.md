```
██╗███╗   ██╗████████╗███████╗███╗   ██╗████████╗
██║████╗  ██║╚══██╔══╝██╔════╝████╗  ██║╚══██╔══╝
██║██╔██╗ ██║   ██║   █████╗  ██╔██╗ ██║   ██║
██║██║╚██╗██║   ██║   ██╔══╝  ██║╚██╗██║   ██║
██║██║ ╚████║   ██║   ███████╗██║ ╚████║   ██║
╚═╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚═╝  ╚═══╝   ╚═╝
   └──▶ ███████╗██████╗ ███████╗ ██████╗
        ██╔════╝██╔══██╗██╔════╝██╔════╝
        ███████╗██████╔╝█████╗  ██║
        ╚════██║██╔═══╝ ██╔══╝  ██║
        ███████║██║     ███████╗╚██████╗
        ╚══════╝╚═╝     ╚══════╝ ╚═════╝
           └──▶ ██████╗ ██╗      █████╗ ███╗   ██╗
                ██╔══██╗██║     ██╔══██╗████╗  ██║
                ██████╔╝██║     ███████║██╔██╗ ██║
                ██╔═══╝ ██║     ██╔══██║██║╚██╗██║
                ██║     ███████╗██║  ██║██║ ╚████║
                ╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝
```

**Know exactly what you're building before anyone builds it.**

`intent-spec-plan` is a Claude Code plugin based on Anthropic's
**[AI-native SDLC playbook](https://claude.com/blog/the-ai-native-sdlc-playbook)**. The playbook
starts every piece of work with three files, each read by the next stage: an `intent` (Plan), a
`spec` (Design) and a `plan` (Build). This plugin makes those three files for any project, gets
your approval on each, and tracks them on one live page.

```
  you ──▶ one question at a time ──▶ INTENT ──✓──▶ SPEC ──✓──▶ PLAN ──✓──▶ your teams
                                       │            │            │
                                  what & why    exactly what   in what order,
                                                 gets built    ticket by ticket
```

## The three steps

**1 · Intent.** What you want, why, and within which limits. Claude asks one question at a time.
Each question comes with a recommended answer and the real numbers behind it. Then it writes a
one-page intent in your own words.

**2 · Spec.** Exactly what will be built, pictures first:

- what users see, in every state;
- the rules and limits;
- what could go wrong, and what stops it;
- every requirement, traced to the intent, with the test that proves it.

The engineers' detail is folded underneath each section.

**3 · Build plan.** The order it's built in. Each step is one ticket for one team, with its files,
tests written first, a live check, and a ticket ready to paste. Risky work ships behind a flag
that starts off.

Nothing moves until you approve it. There is no spec until the intent is approved, and no plan
until the spec is.

## The tracker page

Every initiative gets one live page, a Claude artifact. A sticky bar across the top shows where
the initiative stands, and switches between the three documents:

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ ACME BILLING · REFUND  │  APPROVED 7 OCT     NEEDS YOUR YES     NOT STARTED             │
│ ●─●─● SELF-SERVE       │  ● 1 INTENT ─────── ● 2 SPEC ───────── ○ 3 PLAN  [YOUR MOVE →] │
└─────────────────────────────────────────────────────────────────────────────────────────┘
     ● mint = approved      ● amber = needs your yes      ○ = drafting / not started
```

Underneath is the overview:

- a "Your move" card that says what needs you now;
- the three stages, with live status;
- the log of decisions;
- the project's standing rules.

Setting a stage to **Approved** on the page is your approval. Claude reads it before starting the
next step.

## Install

In Claude Code:

```
/plugin marketplace add teamgonuts/intent-spec-plan
/plugin install intent-spec-plan@teamgonuts
```

## Use

| Command | What it does |
|---|---|
| `/intent-spec-plan:setup` | Once per project. Records who approves, the project's name, its code repos, where the documents live, its standing rules, and where real numbers come from. |
| `/intent-spec-plan:intent` | Starts an initiative. It creates the tracker page, asks its questions, and writes `intent.html`. |
| `/intent-spec-plan:spec` | After the intent is approved: writes `spec.html`. |
| `/intent-spec-plan:build-plan` | After the spec is approved: writes `plan.html`. |

You don't have to type the commands. Saying "I want to shape a feature that lets customers…" is
enough to start, and each step points to the next.

## What you get

```
intent-spec-plan.json          your project's settings (from setup)
initiatives/
├── sdlc-kit.css               the shared stylesheet (master copy)
├── standing-rules.md          rules every initiative inherits (optional)
└── refund/
    ├── intent.html            step 1
    ├── spec.html              step 2
    ├── plan.html              step 3
    ├── sdlc-kit.css           a copy, so the files open styled from disk
    ├── tracker.json           the tracker page's words and its artifact URL
    └── page.html              the built tracker page (generated)
```

## How it works

- **The page is the file.** The tracker page embeds each document unchanged, so the page you
  approve is the file engineers read. [`kit/build-page.mjs`](kit/build-page.mjs) rebuilds it
  whenever a document changes.
- **Progress is live.** Stages and the log live in the artifact's own database, so they update
  without republishing. See [`kit/tracker.md`](kit/tracker.md).
- **Checked before you see it.** Every document goes through a self-check against its template's
  rules, then fresh reviewer agents on other models. The intent gets one reviewer. The spec and
  the plan each get two: one checks accuracy against the code, one checks intent and safety.
- **Your words are kept.** Each document ends with the questions you were asked and your exact
  answers. Changes after approval are dated amendments.
- **No tickets filed behind your back.** The plan carries them, ready to paste, and you decide
  where they go.

## Requirements

- **Claude Code with artifacts**, for the live tracker. Without them, the page still builds
  locally and opens from disk.
- **Node.js 18 or newer**, to build the page. Without it, Claude assembles the page by hand.
- **Your code repositories**, for the spec and the plan. Setup asks for them. If they aren't known
  yet, Claude asks the first time it needs the code.
- **Data connectors**, optional (analytics, a warehouse, support tools), so questions and specs
  carry real numbers.

## Credits

- The loop follows Anthropic's
  [AI-native SDLC playbook](https://claude.com/blog/the-ai-native-sdlc-playbook).
- The one-question-at-a-time discipline is adapted from the brainstorming skill in
  [obra/superpowers](https://github.com/obra/superpowers) by Jesse Vincent (MIT).
- The spec's two layers follow the Rust RFC process's guide-level and reference-level
  explanations.

## License

MIT. See [LICENSE](LICENSE).
