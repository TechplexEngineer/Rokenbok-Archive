# Static Site Search Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a fully static site-wide search powered by a Hugo-generated JSON index and Fuse.js.

**Architecture:** Hugo emits a home-page JSON output containing searchable regular pages. A dedicated `/search/` Hugo page loads that index and a static `site/static/js/search.js` file uses CDN-hosted Fuse.js to render matches, with the query represented in the URL.

**Tech Stack:** Hugo, Go templates, Bootstrap 5, vanilla JavaScript, Fuse.js.

**Spec:** `docs/superpowers/specs/2026-11-23-site-search-design.md`

## Global Constraints

- Search remains fully static; no server or hosted search API.
- Only published Hugo content pages are indexed; PDFs and images are excluded.
- Preserve the existing Bootstrap navigation; do not require the unused webpack source tree.

## Review Focus

- Empty query: show an instruction instead of running a broad search — Task 3.
- No matches: show a clear status message — Task 3.
- Search terms in URL: initialize and update the form from `?q=` — Task 3.
- Relative deployment path: use Hugo-generated URLs rather than root-only URLs — Tasks 1 and 3.
- Build output: JSON index and search page are emitted by the production build — Task 4.

### Task 1: Generate the Hugo search index

**Files:**
- Modify: `config.toml`
- Create: `site/layouts/index.json`

**Interfaces:**
- Produces: `/index.json` with a JSON array of objects containing `title`, `url`, `summary`, and `content`.

- [ ] Add the `JSON` home output format in `config.toml` while retaining HTML and RSS behavior.
- [ ] Render `where .Site.RegularPages "Draft" false` from `site/layouts/index.json`, using `.RelPermalink`, `.Title`, `.Summary`, and `.Plain` with JSON-safe Hugo serialization.
- [ ] Keep the index limited to page metadata and rendered plain text; do not include raw HTML or static assets.

### Task 2: Add the search page and navigation entry

**Files:**
- Create: `site/content/search/_index.md`
- Create: `site/layouts/search/list.html`
- Modify: `site/layouts/partials/nav.html`

**Interfaces:**
- Consumes: `/index.json` and the `site-search` JavaScript behavior from Task 3.
- Produces: a `/search/` page with a labeled form, results container, and status region.

- [ ] Add the search route content with title `Search`.
- [ ] Add the search layout with an accessible search input, submit button, status element, and results list; expose the page root with `data-search-page` and the index URL with Hugo’s `relURL`.
- [ ] Add a Search link to the existing navbar using `relURL` so deployments under a subpath work.

### Task 3: Implement client-side Fuse.js search

**Files:**
- Create: `site/static/js/search.js`
- Modify: `site/static/css/site.css`

**Interfaces:**
- Consumes: search page markup and `/index.json` from Tasks 1–2.
- Produces: interactive search that reads and writes `?q=`, displays result links and excerpts, and handles loading/error/no-results states.

- [ ] Load versioned Fuse.js from the search layout and initialize only when `[data-search-page]` exists; fetch the index, configure weighted title/summary/content keys, and render escaped text into the results container.
- [ ] Read the initial `q` parameter, search on submit and input, update the URL with `history.replaceState`, and keep empty/no-result states accessible via the status region.
- [ ] Add focused search-page styling only where Bootstrap utilities do not cover the layout.

### Task 4: Verify the generated site

**Files:**
- No source changes expected.

- [ ] Run a JavaScript syntax check and confirm zero errors.
- [ ] Run the Hugo build and confirm the generated search page and static script are emitted.
- [ ] Inspect generated output to confirm `dist/index.json` and `dist/search/index.html` exist and the JSON contains searchable page metadata.
- [ ] Review the final diff for accidental generated files or unrelated changes.
