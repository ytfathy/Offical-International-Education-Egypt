# International Education Egypt — Website

A complete, dependency-free website (HTML + CSS + JavaScript). No build step.

## Preview locally
Open `index.html` in a browser, or run a local server from this folder:

    npx serve .        # or: python3 -m http.server 8080

## Go live
Upload the whole folder to any static host (Vercel, Netlify, Cloudflare Pages, cPanel hosting, etc.).

## Edit content — `js/config.js`
Everything editable lives in one file:

| What | Where |
|---|---|
| WhatsApp Business number | `site.whatsappNumber` — digits with country code, e.g. `201001234567` |
| WhatsApp message wording | `site.whatsappTemplate`, `site.whatsappBuyTemplate`, `site.whatsappGeneral` |
| Social media links | `site.social` (icons appear only when a link is set) |
| Grades / subjects | `grades`, `subjects` (name, Arabic name, colour, icon) |
| Program text, benefits, features | `programs[]` |
| "Open app" link | `programs[].appUrl` (without it, the button opens WhatsApp to request access) |
| Promotional videos | `programs[].video` — YouTube, Vimeo or direct .mp4 link |
| Platform screenshots | `programs[].screenshots` — e.g. `["assets/screens/g6-math-1.jpg"]` |
| Verified statistics | `stats` (empty = shows grade/subject/program counts) |
| Parent testimonials | `testimonials` (authentic quotes only) |
| Editor notes on the page | `site.showEditorHints` — **set to `false` before launch** |

**Before launch:** confirm each program's `features` list — only keep features the program really includes.

## Deep links
Each program has its own link, e.g. `index.html#program-g6-math`, `#program-g8-science`.

## Brand
`assets/iee-logo.png` is a proportional, unaltered web-size copy of the official logo.
The original full-resolution file is in `assets/brand/official-logo.png`.
