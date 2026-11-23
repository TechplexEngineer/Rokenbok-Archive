# Rokenbok Archive

This is a static Hugo archive site, bundled with Webpack and deployed to Cloudflare Workers Static Assets.

## Getting started

The former Netlify CMS and Netlify Identity integration are disabled. Content changes are made directly in this repository and deployed through Cloudflare.

## Local Development

Clone this repository, and run `yarn` or `npm install` from the new folder to install all required dependencies.

Then start the development server with `yarn start` or `npm start`.

## Cloudflare Workers deployment

The Workers configuration in `wrangler.jsonc` publishes the generated `dist/` directory as static assets. It retains Hugo's URL structure and custom `404.html` page.

1. Authenticate once with `npx wrangler login`.
2. Run `npm run deploy` to build and deploy the Worker named `rokenbok-archive`.
3. In the Cloudflare dashboard, add a custom domain to that Worker when the deployment is ready to receive production traffic.

Use `npm run cf:dev` to build and preview the Worker locally. Use `npm run deploy:dry-run` to validate the deployment configuration without publishing it.

The project targets Node 12 as declared in `.nvmrc`; use a compatible runtime to build this legacy Webpack/Node Sass toolchain.

## Layouts

The template is based on small, content-agnostic partials that can be mixed and matched. The pre-built pages showcase just a few of the possible combinations. Refer to the `site/layouts/partials` folder for all available partials.

Use Hugo’s `dict` functionality to feed content into partials and avoid repeating yourself and creating discrepancies.

## CSS

The template uses a custom fork of Tachyons and PostCSS with cssnext and cssnano. To customize the template for your brand, refer to `src/css/imports/_variables.css` where most of the important global variables like colors and spacing are stored.

## SVG

All SVG icons stored in `site/static/img/icons` are automatically optimized with SVGO (gulp-svgmin) and concatenated into a single SVG sprite stored as a a partial called `svg.html`. Make sure you use consistent icons in terms of viewport and art direction for optimal results. Refer to an SVG via the `<use>` tag like so:

```
<svg width="16px" height="16px" class="db">
  <use xlink:href="#SVG-ID"></use>
</svg>
```
