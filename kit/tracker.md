# The tracker page

Every initiative has one artifact: the **tracker page**. It shows where the initiative stands
(intent, spec, build plan), then the three documents themselves, then the project's standing rules
and a log of decisions and events. The owner reads, comments on and approves from it.

The skills `intent`, `spec` and `build-plan` all follow this file. `<kit>` below is this folder,
the plugin's `kit/`: two levels up from any of the skills' base directories.

## What lives where

| Thing | Where | Changed by |
|---|---|---|
| The documents | `<docs>/<code>/intent.html`, `spec.html`, `plan.html` | Editing the files, then rebuilding and republishing the page |
| The page's words (title, "Your move") | `<docs>/<code>/tracker.json` | Editing the file, then rebuilding and republishing |
| The built page | `<docs>/<code>/page.html` (generated; never edit by hand) | `node <kit>/build-page.mjs --dir <docs>/<code>` |
| Stage statuses and the log | The artifact's own `db`: collections `stages` and `log` | `ArtifactData`, or the owner on the page. Never needs a republish |

`tracker.json`:

```json
{
  "code": "REFUND",
  "title": "Self-serve refunds",
  "headline": "Customers get a refund without writing to support",
  "lede": "One or two sentences on what this initiative is, in plain words.",
  "started": "2026-10-07",
  "next": { "title": "Answer the questions in chat", "body": "What the owner should do now, in one or two sentences." },
  "meta": ["Optional extra facts for the header, e.g. 'Teams: Payments, Web'"],
  "artifact_url": null
}
```

`owner` and `project` come from `intent-spec-plan.json` unless `tracker.json` sets them.

## Create it: the first thing an initiative does

The `intent` skill does this before its first question, so the owner can watch the initiative take
shape from the start.

1. Make `<docs>/<code>/`, and copy `<docs>/sdlc-kit.css` into it (if the master is missing, copy
   `<kit>/sdlc-kit.css` to `<docs>/` first).
2. Write `tracker.json` as above, with `next` saying the questions are happening in chat.
3. Build: `node <kit>/build-page.mjs --dir <docs>/<code>`.
4. Publish `<docs>/<code>/page.html` with the Artifact tool:
   `icon: "checklist"`, a one-sentence `description`, and `capabilities: {"db": {}, "user": {}}`.
   The page already meets the artifact page contract (a short `<title>`, light and dark tokens,
   phone width); if the Artifact tool asks for its design skill first, load it, then publish the
   file unchanged.
5. Write `artifact_url` into `tracker.json`.
6. Seed the tracker with one `ArtifactData` batch (load the tool with ToolSearch first):
   - set `stages/intent` to `{order: 1, label: "Intent", status: "drafting", date: <today>}`
   - set `stages/spec` to `{order: 2, label: "Spec", status: "not-started"}`
   - set `stages/plan` to `{order: 3, label: "Build plan", status: "not-started"}`
   - set `log/<id>` to `{at: <now ISO>, kind: "event", text: "Initiative started"}`

   Log ids are a sortable timestamp plus a slug, for example `20261007T120000Z-started`. Every log
   entry gets a new id; the page itself adds its own entries with random ids.
7. Check once: one `ArtifactData` list of `stages`. It returns three rows.

## Update it: every time a document or tracker.json changes

1. Update `tracker.json`'s `next` so "Your move" says what the owner should do now.
2. Rebuild with `build-page.mjs`. Fix every placeholder warning it prints before showing the owner a
   document for approval.
3. Republish `page.html`. Within the same conversation, publish the same file path. From another
   conversation, pass `artifact_url` as `url`, `read` the artifact first, then publish. Omit
   `capabilities` and `icon` on a republish, so they stay as they are.

## Move a stage

`ArtifactData` `get` the stage first: the owner may have changed it on the page, and every write
to an existing document needs its `version`. Then send one batch:

- `update` on `stages/<intent|spec|plan>` with `{status, date}` and `if_version` set to the version
  you just read;
- `set` a new `log/<id>` entry saying what happened, in the owner's words where they gave any.

The statuses are `not-started`, `drafting`, `for-approval`, `approved` and `blocked`. A `note` field
holds one short line for the stage card, such as "2 decisions need your yes". Remove it with
`{"__delete__": true}` when it no longer applies. If a pinned write fails because the stage changed,
read it again and look at what the owner set before you redo the write.

## Read approval

The owner approves either by setting the stage to **Approved** on the page, or by saying so in chat.

- Before a skill starts the next stage, `ArtifactData` `get` `stages/<previous>`. If it's
  `approved`, the gate is open.
- If the owner approved in chat, set the stage to `approved` yourself and log their words.
- Either way, the document's own status line then reads `approved <date>`, and the page is rebuilt
  and republished.

## When something is missing

- **No Node.js:** do what `build-page.mjs` does by hand. Copy `page.template.html`, put each
  document's `<header class="sv-band">` and `<main>` where its `<!--@@…_DOC@@-->` marker is, inline
  `sdlc-kit.css` at `<!--@@SPEC_KIT@@-->`, and fill the `@@…@@` text markers from `tracker.json`.
- **No Artifact tool in this session:** build the page anyway and give the owner the local
  `page.html` path. Keep the stages in a `stages` object in `tracker.json`, and say plainly that the
  live tracker isn't available here.
- **The artifact can't be reached** (deleted, or no access): ask the owner before publishing a new
  one, then replace `artifact_url` and seed the new tracker from the stages the documents' status
  lines show.
