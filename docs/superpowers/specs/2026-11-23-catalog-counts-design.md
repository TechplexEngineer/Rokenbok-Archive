# Catalog Counts Design

## Intent

Show the number of documented sets on the sets page and the number of documented parts on the parts page, directly in each page's existing jumbotron subtitle.

## Scope and constraints

- Count only published pages in the relevant section (`.Pages`).
- Do not include parts that are listed as missing their own part page.
- Keep the existing page layout and shared jumbotron partial unchanged.

## Approach

The list templates will append a pluralized count to the existing subtitle via `printf` and `len .Pages`. This keeps the count derived from Hugo's page collection and avoids duplicated catalog data.

