---
name: intent
description: Write or change an initiative's intent as one HTML page (<docs>/<code>/intent.html) that the owner approves and everyone after reads, tracked on a live tracker page (an artifact) from the first question. A brainstorm with the owner one question at a time, then a fixed one-page template, a self-check and a fresh review, before any spec, plan, ticket or code. Use when the user wants to shape a new feature, initiative, project or change, asks for an intent, or when an approved intent has to change. Every turn that edits an intent.html ends with a link to the file and the tracker page.
---

# Intent: the first step of every initiative

The intent records what the owner wants, why, and within which limits, in their own words and on
one page. The spec builds on it, and the build plan on the spec.

- **The owner** is the person named in `intent-spec-plan.json`, who approves. Use their name in the
  document wherever the template says `{Owner}`.
- **The template** is `template.html`, next to this file. The shared styling is `sdlc-kit.css`.
- **The tracker page** is described in `kit/tracker.md`, two levels up from this skill's base
  directory. Read it before you start.

## 0. Before anything

- Find `intent-spec-plan.json` in the working folder or its parents. If there isn't one, run the
  `setup` skill first.
- **Start the tracker page before the first question.** Agree a short code with the owner (propose
  one from their words, like `REFUND`; the folder is its lower-case form). Then create the
  initiative's folder and its tracker page as `kit/tracker.md` says, and give the owner the link.
  The owner watches the initiative take shape from the start.

## One file: the HTML is the intent

The intent is **`<docs>/<code>/intent.html`**. It is never a `.md` file.

- **One file for everyone.** The owner approves it as a page. Engineers and later skills read the
  same file, since HTML is plain text to them. The tracker page embeds its title band and `<main>`
  unchanged, so no second copy can drift.
- **One stylesheet for all three documents.** `sdlc-kit.css` sits next to the file, a copy of the
  docs folder's master, so the file opens styled straight from disk.
- **One section per element.** Each section is a `<section>` with an `<h2>`, and each line with an
  ID sits on its own line in the source, so diffs stay readable.

## Hard gate

There is no spec, plan, ticket or code for an initiative until the owner has approved its intent.
Approval is the tracker's Intent stage set to **Approved** (by the owner on the page, or by you
after they say so in chat), with the file's status line reading `approved <date>`. This holds
however small the work looks.

## 1. Read before asking anything

- What the owner has already said or shared: the request, briefs, docs, tickets, links.
- Earlier initiatives in the docs folder this one touches: their intents, decisions and appendices.
- The standing rules, if the project has them (`standing_rules` in the config). Never ask what a
  standing rule already settles.
- The code, only as far as you need it to ask good questions. The intent itself never mentions
  code. If `code_repos` is empty and you need the code, ask for it (one question), and save the
  answer to the config.
- The data sources in the config, for the numbers your questions will need.

## 2. Size the job

- **A new initiative, or a large change:** the whole process below.
- **A small change to an approved intent:** a few questions, then an *Amendments* row (section 7).
- **Unsure it is possible at all:** say what you will look at and how, look, and report back.
  There is no intent until the answer is in.

## 3. Ask, one question at a time

- **One question per message.** Use AskUserQuestion with two to four options, the recommended one
  first, each saying what it means in practice.
- **Never bundle questions.** One "Yes" to several points is not a decision on each of them.
  Re-ask a bundled answer one point at a time, or as one multi-select question, which decides each
  point on its own.
- **Ask in the owner's terms:** what users would see, what it costs, what could go wrong. Never
  about code.
- **Bring the numbers.** Before asking about a case, look in the data sources for how often it
  happens and what it is worth, and put that in the question. If no source can answer, say so in
  the question rather than guess.
- **Cover every section.** Ask about:
  - the problem and the goal;
  - the outcomes, and how we will know it works;
  - who it serves, and who or what else acts on the same data, money or records;
  - the constraints: always, ask the owner first, never;
  - what is out of scope;
  - anything you would otherwise have to assume.
- **Offer two or three approaches** with their trade-offs and a recommendation whenever the shape
  is still open.
- **Cut what is not needed.** Something the owner did not ask for goes under *Out of scope* or
  *Assumptions*, never into an outcome.
- **Stop** once every section can be filled from the answers. That is usually 5–10 questions.

Keep the tracker's "Your move" current while you ask (`next` in `tracker.json`). A note on the
Intent stage such as "Question 4 of about 7" is enough. Don't republish after every question.

## 4. Write it in the template

Fill `template.html` into `<docs>/<code>/intent.html`. The rules:

1. **Every required heading.** Each one appears in order and is named exactly. An empty one says
   "None." The owner reviews by these headings.
2. **One page.** The body, from the header to *Open questions*, stays under about 600 words. The
   appendix is not counted.
3. **Everything traces.** The appendix's *Became* column names the IDs each answer turned into. A
   line that rests on a standing rule names it (S7). An outcome, rule or constraint that no row
   and no standing rule accounts for is an *Assumption*. The trace lives in the appendix, so it
   costs the body no words.
4. **IDs are written in:** O, M, R, C, N, A and Q numbers. The spec cites them, and tickets trace to
   the spec.
5. **Plain words, for a non-technical reader.** No screens, layouts, pages, files, endpoints or
   jobs. No tickets, dates or build order.
6. **Optional sections only when the content needs them:** *Terms*, *Rules*, *Money and what can't
   be undone*, *Appetite*.

## 5. Check it before the owner sees it

- **Self-check** against the six rules above. No placeholders, no contradictions, and nothing a
  reader could take two ways.
- **One fresh reviewer**: an agent that did not write the intent. Say which model it runs on. It
  asks only three questions:
  - Did the owner ask for this?
  - Is it a mechanism?
  - Who else acts here?

  Verify each finding before changing anything, and record what was accepted.

## 6. Show it, then approve

- **Rebuild and republish** the tracker page (see `kit/tracker.md`). Set the Intent stage to
  *For your approval*, and set "Your move" to approving the intent.
- **Ask one question:** approve, or what should change? The owner reads the whole page by its real
  headings. Never invent groupings for them to review.
- **Each correction** goes into the intent, with a row in the appendix in the owner's words.
  Rebuild and republish.
- **On approval:**
  - set `Status: approved <date>` in the file;
  - set the tracker's Intent stage to *Approved*, and log the owner's words;
  - if `commit_docs` is true, commit the folder (never push unless asked);
  - rebuild and republish;
  - start the spec with the `spec` skill. The spec settles every open question before it is
    approved itself.

## 7. After approval

- **Every change** gets an *Amendments* row: the date, what changed, and the owner's words.
- **The same change** updates the spec and the build plan if they exist, so no stale copy is left.

## Always: the link

**Every turn in which an `intent.html` was edited ends with a link to the file and to the tracker
page,** so the owner can open either in one click. For example:
[initiatives/refund/intent.html](initiatives/refund/intent.html) · https://claude.ai/artifact/…

## Credits

The process is adapted from the brainstorming skill in obra/superpowers
(https://github.com/obra/superpowers), Copyright (c) 2025 Jesse Vincent, used under the MIT
License.
