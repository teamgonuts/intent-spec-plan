---
name: spec
description: Write or change an initiative's spec as one HTML page (<docs>/<code>/spec.html) that is both the page the owner approves and the document engineers build from. Pictures first, builder detail under each section, every requirement traced to the intent with the code that enforces it and the test that proves it, two fresh reviews, approval on the tracker page. Use after an intent is approved, or when an approved spec has to change. Every turn that edits a spec.html ends with a link to the file and the tracker page.
---

# Spec: the second step of every initiative

The spec turns an approved intent into exactly what will be built:

- what users will see;
- how it runs;
- the rules and limits it keeps;
- what could go wrong, and what stops it;
- how it is proven;
- every requirement, with the code that enforces it and the test that proves it.

- **The skeleton** is `template.html`, next to this file. The shared styling is `sdlc-kit.css`,
  the same stylesheet the intent uses.
- **The tracker page** is described in `kit/tracker.md`, two levels up from this skill's base
  directory.
- **The owner** is the person named in `intent-spec-plan.json`, who approves.

## One file: the HTML is the spec

The spec is **`<docs>/<code>/spec.html`**. It is never a `.md` file.

- **The owner reads and approves it as a page.** Engineers and reviewers read the same file. HTML
  is plain text to them.
- **The tracker page embeds its title band and `<main>` unchanged.** There is no second copy to
  drift.
- **The styling stays out of the file, and is shared.** The `sdlc-kit.css` beside it is the one
  stylesheet for `intent.html`, `spec.html` and `plan.html`. So the file opens styled from disk,
  and each file is mostly content.
- **Diffs stay readable.** Each requirement row, card and paragraph sits on its own lines.

## Hard gate

- **No spec before the intent is approved.** Check the tracker's Intent stage first (see
  `kit/tracker.md`).
- **No build plan, ticket or code until the owner has approved the spec.** Approval is the
  tracker's Spec stage set to *Approved*, with the file's status reading `approved <date>` and
  every decision that needs the owner's yes answered.

## 1. Read before writing

- The approved intent, appendix included, and the standing rules if the project has them.
- **The code at a named commit,** from the main branch of each repository in `code_repos`.
  - If none is set, ask for it now (one question), and save it to the config.
  - Read-only mapping agents help; say which model each runs on.
  - Check every claim they make about what EXISTS.
- **The data: bring real numbers,** from the data sources in the config:
  - how often each case happens;
  - real values for the worked example;
  - the real wording of every message users see today.
- Research notes and sources. Look facts up; never derive them. Respect each source's terms of
  use.
- An earlier spec in the docs folder, if there is one, as the example of the form.

## 2. Ask only what is the owner's

- **Most gaps are decisions the spec makes itself.** They go in section 2 for the owner's approval,
  not into questions.
- **Ask only when the choice is truly theirs:** money, a change to one of their earlier rules, or
  anything that can't be undone. Ask one question at a time, recommended answer first, and at most
  five.
- **Never decide against something the owner already chose.** If they said "no overall cap", the
  spec does not add a cap to be safe. If a real risk remains, ask.

Set the tracker's Spec stage to *Drafting* when you start.

## 3. Write it in the template

Fill `template.html` into `<docs>/<code>/spec.html`. Every spec has these sections, in this order:

| # | Section | The picture | The builder detail |
|---|---|---|---|
| 0 | Header | The title band: what it is, which intent it's built from, its status | Inputs (the intent, the code commit, the data, research) and how to read the IDs |
| 1 | In one minute | 3–5 cards in plain words | — |
| 2 | Decisions this spec makes | A box; any that needs the owner's yes is marked "Needs your yes" | Which requirement each decision shapes |
| 3 | What you'll see | Mockups of every screen and message it changes, in every state, on real data | Every line's exact words; the states to design for |
| 4 | How it runs | What starts it, then numbered steps, each tagged with who or what acts | The sequence: steps, services, functions, calls |
| 5 | Rules and limits | A rule ladder, limit cards, and a worked example on real data | Each rule and limit with its value and where it's enforced |
| 6 | When things go wrong | A card per outcome | What each records and shows, and whether it warns |
| 7 | What could go wrong, and what stops it | The hazards, worst first, each with its guard | Each hazard, its guard and the test that proves it |
| 8 | The record | One record drawn as a receipt: what it stores | Every field, and the exact moment each timestamp means |
| 9 | Proving it | How proving works, said once (below) | How a live check is run and read |
| 10 | Every requirement | One table (below) | Enforced in · the tests by name · gated; then the trace from every intent line to its requirements |
| 11 | Check first | The open questions settled, and the looks the build will take | The same, with evidence |
| 12 | Boundaries | What it never touches | Out of scope; protected areas and the only change allowed |
| 13 | What it replaces | Old → new | Removals and migrations (optional) |
| A | Your words | The questions and the owner's answers; amendments after approval | — |

**Section 9, Proving it.** Three layers in three lines, and the statement that all must pass. Then:

- **A coverage map:** a row per requirement and a dot per thing that proves it, in columns Unit
  tests · Integration tests (the number of tests in the dot) · each live check · the done-check.
  Every row needs at least one test dot, and dots are strict.
- **One table of the live checks:** what each exercises, how it's staged, and when it passes.
- **The done-check.**

**Section 10, Every requirement.**

- The visible columns are ID · rule · users see · what the tests check.
- The builder columns sit behind a switch.
- Which kinds of proof cover a row is the coverage map's job, not this table's.

A section that doesn't apply says so in one line rather than disappearing. Section 13 is the
exception: leave it out when nothing is replaced.

**The rules:**
1. **Pictures first, builder detail under them.** Each section opens with what the owner would see
   or decide. The builder's detail goes in a `<details class="builder">` under it. The owner reads
   the page in one sitting.
2. **Explain everything you mention.** No ticket number, rule, file, internal term or name appears
   without a plain clause saying what it is, at its first mention, and a link if it lives
   somewhere else.
3. **Stay inside the initiative.** Fix only what the initiative needs. A bug found in other code on
   the way is reported to the owner as its own ticket to file, never a requirement here.
4. **One behaviour per requirement,** written as "When …, the product …". Each one:
   - is proven by a named test that fails without it;
   - is tagged with its source (O, R, C, M, S);
   - keeps behaviour in plain words, and mechanisms in the builder columns.
5. **Every number is real,** from the data, the code or a looked-up source. Every word users will
   see is written out. No "should", "may", "appropriate" or "etc." in a requirement.
6. **Banned lists, not blanket bans.** When something is dangerous only sometimes, list the
   dangerous cases by hand from a source. Don't forbid the whole kind.
7. **"Loud" means where the people affected already look.** Name the exact surface: an in-product
   banner, an alert channel, an email. Add no new notification channel unless the owner asks.
8. **No open question survives approval.** Each is settled with evidence, or becomes a look with
   an owner.
9. **Say each thing once.** A fact lives in one section and the others point to it. Never list the
   same proofs or tests in two places with slightly different words. Section 9 says *how* proving
   works and shows coverage as a map; section 10 names each requirement's tests.
   - **Say how it's proven, plainly.** Section 9 says which checks must pass (all of them, unless
     marked "only if ever needed") and what each one checks. Its map gives every requirement a
     plain line on what its tests check.
10. **Stage what you can; wait only for what you can't, and say so.**
    - **Stage it.** A live check doesn't wait for a case that can be set up. Arrange the cheapest
      qualifying case in a test or staging environment, or behind the flag for internal users,
      within limits the spec states.
    - **Some cases can't be staged:** a time window, an event a third party decides, or one that
      would cost real money or can't be undone. For each, the spec says four things:
      - what it waits for;
      - how often that happens, according to the data;
      - what proves it in the meantime (the automated tests);
      - whether the initiative can close without it.

      Nothing waits silently.
    - **One check per mechanism.** When two cases go through the same mechanism, one live check
      covers both, and tests on captured real data prove their difference.
11. **Size.** One row per requirement. Past about 25 requirements, split the initiative or the spec.

## 4. Check it before the owner sees it

- **Render it,** and check every section, table and switch in a browser. Look at the file itself
  and at the rebuilt tracker page.
- **Two fresh reviewers,** each on a different model from the writer, one lens each:
  - **Accuracy:** every claim about what EXISTS, checked against the code, with path and line.
  - **Intent and safety:** coverage, overreach, hazards, contradictions and testability.
- **Verify every finding** before changing anything, and say which findings you dropped and why.
  A reviewer reports gaps, not style.

## 5. Show it, then approve

- Rebuild and republish the tracker page, set the Spec stage to *For your approval*, and add a
  stage note if decisions need the owner's yes.
- **Ask one thing:** approve, or what should change, by section or decision number. Decisions
  marked "Needs your yes" need the owner's answer.
- Each answer goes into the spec, and the owner's words go in the appendix. Rebuild and republish.
- **On approval:**
  - set the status to approved with the date;
  - mark the tracker's Spec stage *Approved*, and log it;
  - commit if `commit_docs` is true;
  - rebuild and republish;
  - start the build plan with the `build-plan` skill.

## 6. After approval

- **Approved text is frozen.** Every change is an Amendments row: the date, what was added, changed
  or removed, why, and the owner's words. A change of behaviour needs the owner's yes again.
- The same change updates the page and the build plan. Changes made after building starts are
  rework; say so when you make one.

## Always: the link

**Every turn in which a `spec.html` was edited ends with a link to the file and to the tracker
page,** so the owner can open either in one click. For example:
[initiatives/refund/spec.html](initiatives/refund/spec.html) · https://claude.ai/artifact/…

## Credits

The process follows the brainstorming discipline of obra/superpowers (MIT), as the `intent` skill
does. The two layers follow the Rust RFC process's guide-level and reference-level explanations.
