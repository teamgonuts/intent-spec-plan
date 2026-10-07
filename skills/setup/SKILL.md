---
name: setup
description: Set up a project for the intent → spec → build plan loop. Writes intent-spec-plan.json in the working folder (who approves, the project's name, its code repositories, where the documents live, its standing rules, where real numbers come from), then copies the shared stylesheet into the docs folder. Use when the user asks to set up intent-spec-plan, or before the first intent, spec or build plan in a folder that has no intent-spec-plan.json.
---

# Setup: once per project

The `intent`, `spec` and `build-plan` skills read one file, **`intent-spec-plan.json`**, in the
folder Claude is working in. This skill writes it. Each skill looks for that file first (in the
working folder, then its parents), and runs this setup if it isn't found.

## 1. Look before asking

- Is there already an `intent-spec-plan.json`? If so, show it and ask what should change. Never
  overwrite it silently.
- Is the working folder a git repository (`git rev-parse --show-toplevel`)? Are there sibling
  folders that look like code repositories?
- Which data connectors does this session have (analytics, a warehouse, issue trackers, support
  tools)? These are candidates for `data_sources`.
- `git config user.name` is a candidate for the owner's name. Confirm it; don't assume it.

## 2. Ask, one question at a time

Use AskUserQuestion with two to four options, the recommended one first. Ask in chat for free text
(a name, a path). Don't bundle questions. Cover these, in order:

1. **Who approves.** The name the documents use for the person who approves them ("in <owner>'s
   words"), and optionally their role.
2. **The project's name**, as it should appear on every page.
3. **The code.** The repositories the work will change: a local path (preferred) or a git URL, one
   or more. "Not known yet" is a fine answer: the skills will ask the moment they need to read the
   code, and save the answer here. Never clone a URL without asking.
4. **Where the documents live.** Recommend `initiatives/` in the working folder. Alternatives: a
   folder inside the code repository (engineers will see the files there), or another path.
5. **Standing rules**: the rules every initiative inherits, so intents don't repeat them (for
   example, "never change prices without finance's sign-off"). The options:
   - none for now;
   - start a short `standing-rules.md` in the docs folder from their answers, with IDs S1, S2…;
   - point to an existing Markdown file.
6. **Where real numbers come from.** The intent and spec bring real numbers to every question,
   so name the sources: the connectors found in step 1, logs, dashboards, or "ask me". This is a
   multi-select question.
7. **Commit the documents?** Only if the docs folder is inside a git repository. Recommend
   **no**: approval happens on the tracker page. If yes, each approval is also committed, never
   pushed unless they ask.

## 3. Write it

`intent-spec-plan.json`, in the working folder:

```json
{
  "owner": "Sam Rivera",
  "owner_role": "Product Director",
  "project": "Acme Billing",
  "code_repos": [
    { "name": "billing-web", "path": "../billing-web" }
  ],
  "docs_dir": "initiatives",
  "standing_rules": "initiatives/standing-rules.md",
  "data_sources": ["Amplitude", "BigQuery", "support tickets"],
  "commit_docs": false
}
```

- Paths are relative to this file. `code_repos` may be `[]` when the code isn't known yet.
  `standing_rules` may be `null`.
- Create `docs_dir`, and copy `sdlc-kit.css` from the plugin's `kit/` folder (two levels up from
  this skill's base directory) into it. That copy is the project's master stylesheet. Each
  initiative folder gets its own copy of it.
- If they chose to start standing rules, write `standing-rules.md` with a title, one line saying
  what it is, and their rules as a numbered list `S1.`, `S2.`…, each in their words.

## 4. Confirm

Show the file. Then say in one line what comes next: "Describe what you want, or run `/intent`, and
the first initiative starts with its tracker page."

## The code, later

When `code_repos` is empty and a skill needs to read the code, that skill asks for it then, one
question, and adds the answer here. If a repo path no longer exists, ask again rather than guess.
