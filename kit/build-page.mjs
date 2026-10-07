#!/usr/bin/env node
// build-page.mjs — builds an initiative's tracker page (the live tracker, then the intent, the spec
// and the build plan) from the HTML files in its folder.
//
//   node <plugin>/kit/build-page.mjs --dir <docs>/<code> [--out <file>]
//
// Reads <dir>/tracker.json for the page's words, and <dir>/intent.html, spec.html and plan.html for
// the documents. Each document's title band and <main> go into its section unchanged, and the shared
// sdlc-kit.css goes into the page, so the page shows exactly what the files say. A missing document
// leaves that section's placeholder in place. The project's standing rules (the "standing_rules" path
// in intent-spec-plan.json, found by walking up from <dir>) are shown at the foot of the page.
//
// The tracker's stages and log live in the published artifact's own db, not in this page, so a
// rebuild never resets them. Publish the output with the Artifact tool and capabilities {db:{}, user:{}};
// republish to the same URL (tracker.json's artifact_url) whenever a document changes.
//
// Writes <dir>/page.html unless --out is given. Prints a warning for every {…} placeholder still
// left in a document: a document with one left is not done.

import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, resolve, basename, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const KIT = dirname(fileURLToPath(import.meta.url));

function arg(name) {
  const at = process.argv.indexOf(name);
  return at !== -1 ? process.argv[at + 1] : undefined;
}
const dirArg = arg("--dir");
if (!dirArg) {
  console.error("usage: node build-page.mjs --dir <docs>/<code> [--out <file>]");
  process.exit(2);
}
const dir = resolve(dirArg);
const out = resolve(arg("--out") || join(dir, "page.html"));

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const day = (d) => `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
const isoDay = (iso) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || ""));
  return m ? `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]}` : "";
};

let tracker;
try {
  tracker = JSON.parse(await readFile(join(dir, "tracker.json"), "utf8"));
} catch (e) {
  console.error(`${join(dir, "tracker.json")} is missing or not JSON: ${e.message}`);
  process.exit(2);
}

// The project config: walk up from the initiative folder.
let config = {}, configDir = null;
for (let d = dir; ; d = dirname(d)) {
  const p = join(d, "intent-spec-plan.json");
  if (existsSync(p)) {
    try { config = JSON.parse(await readFile(p, "utf8")); configDir = d; } catch { /* unreadable: no config */ }
    break;
  }
  if (dirname(d) === d) break;
}

const code = tracker.code || basename(dir).toUpperCase();
const owner = tracker.owner || config.owner || "the owner";
const project = tracker.project || config.project || "";

// Where each document came from: the commit, when the folder is in git; otherwise the time it was saved.
function git(...a) {
  try { return execFileSync("git", a, { cwd: dir, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim(); }
  catch { return null; }
}
const inGit = git("rev-parse", "--is-inside-work-tree") === "true";

const placeholders = [];
async function embed(file) {
  const path = join(dir, file);
  let html;
  try { html = await readFile(path, "utf8"); } catch { return { html: "", stamp: `${file} not written yet` }; }
  const band = /<header class="sv-band">[\s\S]*?<\/header>/.exec(html);
  const main = /<main [^>]*>[\s\S]*?<\/main>/.exec(html);
  if (!main) throw new Error(`${path} has no <main>`);
  const left = main[0].replace(/<!--[\s\S]*?-->/g, "").match(/\{[^{}<>\n]{1,160}\}/g) || [];
  if (left.length) placeholders.push(`${file}: ${left.length} left, first ${left[0]}`);
  let stamp;
  const sha = inGit ? git("log", "-1", "--format=%h", "--", file) : null;
  if (sha) {
    const dirty = git("status", "--porcelain", "--", file, "sdlc-kit.css");
    stamp = `${file} at ${sha}${dirty ? " + uncommitted changes" : ""}`;
  } else {
    stamp = `${file} saved ${day((await stat(path)).mtime)}`;
  }
  return { html: (band ? band[0] + "\n" : "") + main[0], stamp, ...statusOf(band ? band[0] : "") };
}

// A document's stage, read from its own status line ("Status draft | for … approval | approved YYYY-MM-DD"),
// so the page shows the right dots even where the live tracker can't load.
function statusOf(band) {
  const m = /<b>Status<\/b>\s*([^<]*)/i.exec(band);
  const text = (m ? m[1] : "").trim();
  if (/approved/i.test(text) && !/for .*approval/i.test(text)) {
    const d = /(\d{4}-\d{2}-\d{2})/.exec(text);
    return d ? { status: "approved", date: d[1] } : { status: "approved" };
  }
  if (/approval/i.test(text)) return { status: "for-approval" };
  if (/blocked/i.test(text)) return { status: "blocked" };
  return { status: "drafting" };
}
const intentDoc = await embed("intent.html");
const specDoc = await embed("spec.html");
const planDoc = await embed("plan.html");

let kit = "";
for (const p of [join(dir, "sdlc-kit.css"), join(KIT, "sdlc-kit.css")]) {
  try { kit = await readFile(p, "utf8"); break; } catch { /* next */ }
}

let standing = "", standingPath = "";
if (config.standing_rules && configDir) {
  const p = resolve(configDir, config.standing_rules);
  try { standing = await readFile(p, "utf8"); standingPath = relative(configDir, p).replace(/\\/g, "/"); }
  catch { console.warn(`standing rules not found at ${p}`); }
}

const meta = [
  `<span>Owner: ${esc(owner)}</span>`,
  tracker.started ? `<span>Started ${esc(isoDay(tracker.started))}</span>` : "",
  ...(tracker.meta || []).map((m) => `<span>${esc(m)}</span>`),
].filter(Boolean).join("\n    ");

// The stages as of this build: each written document's own status line. The live db overrides them.
const stages = {};
for (const [id, d] of [["intent", intentDoc], ["spec", specDoc], ["plan", planDoc]]) {
  if (d.html) stages[id] = d.date ? { status: d.status, date: d.date } : { status: d.status };
}

const next = tracker.next || {};
const values = {
  "@@TITLE@@": esc(tracker.page_title || `${code} ${tracker.title || ""}`.trim()),
  "@@SHORT@@": esc(tracker.short || tracker.title || code),
  "@@EYEBROW@@": esc([project, code, tracker.title].filter(Boolean).join(" · ")),
  "@@HEADLINE@@": esc(tracker.headline || tracker.title || code),
  "@@LEDE@@": esc(tracker.lede || "This page holds the intent, the spec and the build plan in one place, made one step at a time, and tracks each until the plan is approved."),
  "@@META@@": meta,
  "@@NEXT_TITLE@@": esc(next.title || "Nothing needs you right now."),
  "@@NEXT_BODY@@": esc(next.body || ""),
  "@@CODE_DIR@@": esc(basename(dir)),
  "@@CODE@@": esc(code),
  "@@PROJECT@@": esc(project || "this project"),
  "@@STANDING_PATH@@": esc(standingPath),
  "@@BUILT@@": esc(day(new Date())),
  "<!--@@INTENT_DOC@@-->": intentDoc.html,
  "<!--@@SPEC_DOC@@-->": specDoc.html,
  "<!--@@PLAN_DOC@@-->": planDoc.html,
  "<!--@@INTENT_COMMIT@@-->": esc(intentDoc.stamp),
  "<!--@@SPEC_COMMIT@@-->": esc(specDoc.stamp),
  "<!--@@PLAN_COMMIT@@-->": esc(planDoc.stamp),
  "<!--@@SPEC_KIT@@-->": kit ? `<style>\n${kit.replace(/<\/style/gi, "<\\/style")}\n</style>` : "",
  // `<` escaped so nothing in the rules can close the script element it sits in.
  '/*@@STANDING@@*/""': JSON.stringify(standing).replace(/</g, "\\u003c"),
  "/*@@STAGES@@*/{}": JSON.stringify(stages),
};

let page = await readFile(join(KIT, "page.template.html"), "utf8");
for (const [mark, value] of Object.entries(values)) {
  if (!page.includes(mark)) { console.error(`page.template.html has no ${mark}`); process.exit(2); }
  page = page.split(mark).join(value); // split/join: no $-patterns, every occurrence
}

await mkdir(dirname(out), { recursive: true });
await writeFile(out, page, "utf8");
console.log(`built ${out}`);
console.log(`  ${intentDoc.stamp} · ${specDoc.stamp} · ${planDoc.stamp}${standing ? " · standing rules" : ""}`);
if (tracker.artifact_url) console.log(`  republish to ${tracker.artifact_url}`);
else console.log("  first publish: no artifact_url in tracker.json yet");
for (const p of placeholders) console.warn(`  placeholder warning: ${p}`);
