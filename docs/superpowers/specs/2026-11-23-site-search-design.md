# Static Site Search Design

## Intent

Add a site-wide, browser-based search for Hugo content pages so visitors can find projects, sets, parts, and other published content without a server-side search service.

## Goals

- Add a search affordance to the shared site navigation.
- Provide a dedicated results page at `/search/`.
- Search all published Hugo content using page title, summary, and rendered text.
- Keep the feature fully static and buildable with Hugo alone.
- Give useful empty, loading, and no-results states.

## Non-goals and anti-goals

- Do not index the contents of PDFs or image files; those are assets, not Hugo content pages.
- Do not add a server, external search API, or runtime dependency on a CMS.
- Do not replace the existing navigation or introduce a framework for one small interaction.

## Constraints

- Hugo will generate a JSON index from the site’s regular pages.
- Fuse.js will run in the browser against that JSON index.
- Search code will live in `site/static/js` and be included by the Hugo search layout.
- Existing Bootstrap styling and navigation patterns should be preserved.

## Approaches

- Hugo JSON + Fuse.js: recommended and selected because it is static, typo-tolerant, and simple for the site’s modest content volume.
- Hugo JSON + Lunr.js: viable, but adds more index/query configuration than this site needs.
- Hosted search: rejected because it adds an external service and runtime dependency to a site that already builds statically.

## Design

Hugo will expose a dedicated JSON output for the home page containing each searchable page’s title, permalink, summary, and plain text. A `/search/` page will load the index and run Fuse.js searches as the visitor types, rendering linked results with short excerpts. The navbar will link to the search page and provide the main entry point without making the header layout fragile on small screens.

The implementation will use a plain static JavaScript file loaded by the Hugo search layout, with Fuse.js loaded from a versioned CDN URL. Search requests will be URL-addressable via a `q` query parameter so results can be shared or revisited, while the page will update the URL as the query changes.

## Verification

The Hugo build must emit the JSON index, search page, and static search script; the search script must pass a syntax check.
