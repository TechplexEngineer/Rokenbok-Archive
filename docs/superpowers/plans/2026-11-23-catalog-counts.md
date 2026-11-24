# Catalog Counts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Display documented set and part totals in the existing sets and parts page jumbotrons.

**Architecture:** Compute each total in its existing Hugo list template from `.Pages`, then pass the formatted subtitle into the shared jumbotron partial. No data model or partial changes are needed.

**Tech Stack:** Hugo Go templates, static Markdown content.

**Spec:** `docs/superpowers/specs/2026-11-23-catalog-counts-design.md`

## Global Constraints

- Count only published pages in the relevant section (`.Pages`).
- Do not include parts that are listed as missing their own part page.
- Keep the existing page layout and shared jumbotron partial unchanged.

## Review Focus

- Empty sections should still render a zero count without template errors; verify the expressions use `len .Pages` directly.
- Existing subtitles should remain intact; verify the formatted text includes the original subtitle.
- The parts missing-page inventory should not affect the total; verify the count is computed before that inventory.

### Task 1: Add catalog totals to list-page subtitles

**Files:**
- Modify: `site/layouts/set/list.html`
- Modify: `site/layouts/part/list.html`

**Interfaces:**
- Consumes: each list page's `.Pages` collection and `.Params.subtitle`.
- Produces: jumbotron subtitles formatted as `<existing subtitle> (<count> sets|parts)`.

- [ ] **Step 1: Write and run a failing template assertion**

Run a targeted `rg` assertion for the expected `printf` expressions. It must fail before the template edits because neither list template currently formats a count.

- [ ] **Step 2: Add the formatted count expressions**

Pass `printf "%s (%d sets)" .Params.subtitle (len .Pages)` to the sets jumbotron and `printf "%s (%d parts)" .Params.subtitle (len .Pages)` to the parts jumbotron.

- [ ] **Step 3: Build the site**

Run `npm run build:hugo`. Expected: Hugo exits 0 and generates the site without template errors.

- [ ] **Step 4: Verify rendered output**

Inspect the generated set and part list HTML and confirm each contains its original subtitle followed by a numeric count and the correct noun.
