---
name: build-plan
description: Write an initiative's build plan as one HTML page (<docs>/<code>/plan.html) that the owner approves and the engineering teams build from. It's drafted by the built-in Plan agent, then shaped into ordered steps, each one ticket with its files, tests written first, a live check and a ticket ready to paste. It adds a coverage map, two fresh reviews and approval on the tracker page. Never files tickets. Use after a spec is approved. Named build-plan so it never shadows the built-in /plan. Every turn that edits a plan.html ends with a link to the file and the tracker page.
---

# Build plan: the third and last step of every initiative

The build plan turns an approved spec into the order it is built in.

- **Each step** is one ticket and one pull request that an engineering team can pick up and build
  without this conversation.
- **The plan is the hand-off.** Once it is approved, the teams build from it. This skill never
  files tickets: each step ends with a ticket ready to paste into the team's tracker, and the
  owner decides when and where it goes.
- **The skeleton** is `template.html`, next to this file. The styling is the shared
  `sdlc-kit.css`.
- **The tracker page** is described in `kit/tracker.md`, two levels up from this skill's base
  directory.

## The built-in planner does the thinking; this skill does the house format

Claude Code's own planner keeps getting better, so this skill never copies its method. It calls the
planner, and only adds what the initiative needs on top.

1. **Draft with the built-in Plan agent.** Start it through the Agent tool
   (`subagent_type: "Plan"`), read-only. Give it:
   - the approved spec, its builder detail included;
   - the intent;
   - the code at a named commit;
   - an earlier plan in the docs folder, if there is one, as the example of granularity.

   Ask it for:
   - the build order;
   - the files each change touches;
   - what depends on what;
   - the riskiest parts;
   - where the code differs from what the spec assumes.

   Say which model it runs on.
2. **Shape its answer** into the steps below, then check it (section 3). Where you depart from its
   order, say why in "Found while planning".

If the owner is drafting with you in plan mode (the built-in `/plan`), that plan is the draft
instead. This skill still writes the file and runs the checks.

## One file: the HTML is the plan

The plan is **`<docs>/<code>/plan.html`**, beside `intent.html` and `spec.html`, styled by the same
`sdlc-kit.css` copy.

- **The owner reads and approves it as a page.** The engineers and reviewers read the same file.
- **The tracker page** embeds its `<main>` unchanged, as it does the spec's.
- **Each step shows what users will see.** Under it, a `<details class="builder">` holds the
  engineers' detail and the ticket.
- **A generator is allowed.** If you write the plan through a script, the committed HTML is still
  the plan. Later edits go into the HTML.

## Hard gate

No build plan before the spec is approved: check the tracker's Spec stage first. Nothing is
built, and no ticket is filed, before the plan is approved. Approval is the tracker's Build plan
stage set to *Approved*, with the file's status reading `approved <date>`.

## 1. Read before writing

- The approved spec (every requirement, its "Proven by" tests and its live checks), the intent,
  and the standing rules.
- The code at a named commit, from the main branch of each repository in `code_repos`.
  - If none is set, ask for it now (one question), and save it.
  - Check every EXISTING file, function and test the plan will name.
  - Quote a path and line in the builder detail where it helps the engineer.
- **Who builds it.** Which teams own the code each step touches (look for CODEOWNERS, team
  folders, or ask the owner once). Name the owning team per step, as far as the code shows it.
- **What else is moving.** Other initiatives in the docs folder, and anything the owner says
  outranks this work.

Set the tracker's Build plan stage to *Drafting* when you start.

## 2. Write it in the template

| # | Section | The picture | The builder detail |
|---|---|---|---|
| 0 | Header | Title band: what it is, which spec it's built from, its status, who builds it | — |
| 1 | In one minute | 4–5 cards: the order, what stays off, the size, what it depends on, how it's undone | How it is used: one step one ticket, tests first, review, departures, the switch, how a live check runs, where "checked" is written, gated areas |
| 2 | The steps at a glance | One row a step: what users will see, covers, team, size, risk, live check, waits for | — |
| 3 | Coverage | Every spec requirement against the step that builds it, as a dot chart (`table.cmap`). No empty row | — |
| 4 | Before step 1 | What must be in place first | Flags, access, environments, what other teams are asked for |
| 5… | One per step | Users will see · covers · team and size · risk · live check · waits for | Verify first; files in order (NEW / EXISTING, path and function); tests, written first, by name; Done when; **the ticket, ready to paste** |
| — | The looks before building | Each verify-first look and the step that takes it | — |
| — | Found while planning | What the reviewers and the code changed, and why | — |
| A | Your words and amendments | The owner's answers; amendments after approval | — |

**The rules:**
1. **One step, one ticket, one pull request,** small enough to review in one sitting. A step is
   two steps if it has:
   - more than about six file groups;
   - more than one kind of live check;
   - a size over L.

   Sizes are rough estimates: S is a day or less, M up to three days, L up to a week.
2. **Built switched off.** Anything users would notice, anything that moves money or data, and
   anything that changes what an automated job does is built behind a feature flag that is off.
   Tests show it both ways. One late step switches it on, after its live checks passed. Say who
   decides to switch it on.
3. **Removal goes last.** The old code an initiative replaces is removed in its own step, after
   the new path has run cleanly in production. Then switching the flag off is the undo, and a
   revert never is.
4. **Every spec test is built.** Each test the spec's "Proven by" column names appears in a step,
   by name. If an amendment made a spec test name stale, the plan renames it, and "Found while
   planning" says so.
5. **Live work is named and scheduled.** Each look (V-items from spec §11) and each live check
   says:
   - which step takes it;
   - who runs it, and in which environment;
   - what is recorded;
   - what happens if that environment isn't available: that step waits, and the others go on.
6. **"Checked" is written down.** A live check that passed is noted on its ticket and in the
   tracker page's log. A merged step whose check is still pending stays open.
7. **Every step carries its ticket,** ready to paste, in a `.ticket` block:
   - a title;
   - two or three sentences for someone who hasn't read the spec;
   - links to the step and to its requirements;
   - acceptance criteria that are the step's Done-when lines, word for word.

   **Never file tickets or create issues.** The plan names no ticket numbers; the owner files them.
8. **Parallel where it's safe.** Steps that wait on nothing may run at the same time, on
   different teams. The glance table's "Waits for" column says so.
9. **Explain everything you mention,** the way the spec does: a ticket, rule, file or internal
   term gets a plain clause saying what it is.
10. **Settle what you can before approval.** A list or decision the build would otherwise wait for
    is settled now, when the owner allows it, and the step ships it.

## 3. Check it before the owner sees it

- **Render it** in a browser: the glance table, the coverage map, and one step's builder detail
  and ticket. Check the rebuilt tracker page too.
- **Two fresh reviewers,** each on a different model from the writer, one lens each:
  - **Accuracy:** every claim about what EXISTS, checked against the code with path and line.
    This includes what the plan assumes is missing but already exists.
  - **Intent and safety:** that it covers every requirement and every named test, and doesn't
    switch on anything users would notice before its checks pass. It also checks:
    - step size;
    - what an engineer new to the code would have to guess;
    - contradictions.
- **Verify every finding** before changing anything, and say in "Found while planning" which
  findings changed the plan.

## 4. Show it, then approve

- Rebuild and republish the tracker page, and set the Build plan stage to *For your approval*.
- **Ask one thing:** approve, or what should change, by step number.
- **On approval:**
  - set the status to approved with the date;
  - mark the tracker's Build plan stage *Approved*, and log it;
  - commit if `commit_docs` is true;
  - set "Your move" to the hand-off: the plan is ready for the teams, and each step's ticket is
    ready to paste;
  - rebuild and republish.

## 5. After approval

- **Approved steps are frozen.** A change is made in the same file, with a line in "Found while
  planning" or an Amendments row saying what changed and why. A change of behaviour goes back to
  the spec first.
- When a team's build departs from a step, the plan is updated to match, and the change says why.

## Always: the link

**Every turn in which a `plan.html` was edited ends with a link to the file and to the tracker
page.** For example:
[initiatives/refund/plan.html](initiatives/refund/plan.html) · https://claude.ai/artifact/…
