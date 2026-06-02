# Lindsey Draugel for District 2

Campaign landing page for **Lindsey Draugel**, candidate for the Berkeley County
School District Board, District 2. Single page, "notebook paper" theme to match
the yard sign.

Built with **Angular 21** (standalone components, signals, zoneless) and
**Tailwind CSS v4**. Subtle scroll-reveal animations via a small
IntersectionObserver directive (respects `prefers-reduced-motion`). No backend.

## Quick start

```bash
npm install        # install dependencies
npm start          # dev server on http://localhost:4220 (also bound to your LAN)
```

The dev server is configured to bind `0.0.0.0:4220`, so you can open it from a
phone on the **same Wi-Fi**.

### View it on your phone (same network)

1. Run `npm start` (or `npm run start:lan`).
2. Find this computer's LAN IP: run `ipconfig` and look for the Wi-Fi "IPv4
   Address" (for example `192.168.50.8`).
3. On your phone's browser, go to `http://<that-ip>:4220` (for example
   `http://192.168.50.8:4220`).

Troubleshooting LAN access:

- **Windows Firewall**: the first time Node binds to all interfaces, Windows may
  prompt to allow it. Allow Node.js on **Private** networks, or the phone cannot
  connect.
- **VPN**: a VPN such as NordVPN can block local-network access. If the phone
  cannot reach the site, turn on the VPN's "Allow LAN / local network" option or
  disconnect the VPN while testing.

## Production build and local preview

```bash
npm run build      # outputs static files to dist/draugelbcsd/browser
npm run serve:prod # serves that build over the LAN on port 4220
# or do both at once:
npm run preview
```

## Deployment (GitHub Pages)

A GitHub Actions workflow (`.github/workflows/deploy.yml`) builds the site and
deploys it to GitHub Pages on every push to the **develop** branch (it can also
be run manually from the Actions tab).

The build uses `--base-href=/lindseybcsd/` so asset paths resolve correctly at
`https://sdraugel.github.io/lindseybcsd/`.

**One-time setup in the GitHub repo:** Settings > Pages > "Build and deployment"
> Source = **GitHub Actions**. After that, every push to `develop` publishes.

## Project structure

```
src/
  index.html              fonts, meta tags, social card
  styles.css              Tailwind import + theme tokens (notebook palette, fonts)
  app/
    app.ts / app.html     page composition (the section order)
    shared/
      paper.ts            notebook-paper background wrapper (<app-paper>)
      checkmark.ts        hand-drawn checkbox + check motif (<app-check>)
      button.directive.ts pill button styling ([appButton])
      reveal.directive.ts scroll fade/slide-in ([appReveal])
    sections/
      nav, hero, bio, experience, gallery, priorities, contact, footer
public/
  img/                    optimized site photos (served at /img/...)
src/imgs/                 original full-size photos (source; not shipped)
```

### Theming

All colors, fonts, and notebook-paper variables live in
[src/styles.css](src/styles.css) inside the `@theme` block and `:root`. Adjust
the brand blue, raspberry, paper color, ruled-line spacing, and the red margin
offset there.

## TODO placeholders to fill in

These are intentionally left for you to complete (search the code for `TODO`):

| What | Where |
| --- | --- |
| **Contact form backend** (Formspree or EmailJS). Right now a valid submit opens the visitor's email app via `mailto:`. | `src/app/sections/contact/contact.ts` (`TODO(backend)`) |
| **Instagram URL** (or remove the icon). Facebook is already wired to the live page. | `src/app/sections/contact/contact.ts` (`TODO(social)`) |
| **Campaign-finance disclaimer + committee name.** Confirm the exact SC-required "Paid for by ..." wording before publishing. | `src/app/sections/footer/footer.ts` (`TODO(legal)`) |
| **Social share image** (`og:image`) needs an absolute URL once hosted, and the favicon is still the Angular default. | `src/index.html` (`TODO(asset)`), `public/favicon.ico` |
| **Photos** (swap any of the headshot / family / gallery images). Originals are in `src/imgs/`; optimized copies are in `public/img/`. | `src/app/sections/bio/bio.ts`, `src/app/sections/gallery/gallery.ts` |

## Notes on choices

- **spartan-ng**: evaluated but not wired in. It is `0.0.1-alpha` and its helm
  CLI would rewrite the theme and add code to maintain; for a static landing page
  the accessible Tailwind primitives here cover the need. To add it later:
  `npm i -D @spartan-ng/cli` then `ng g @spartan-ng/cli:init`.
- **Accessibility**: semantic headings, labeled form fields with inline errors,
  a skip link, visible focus rings, alt text, and reduced-motion support.
