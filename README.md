# TensorLoom download website (React)

React 19 + TypeScript + Vite + Tailwind 4, the same stack and design tokens as the TensorLoom app. Animations use `motion` (Framer Motion) and respect the visitor's reduced-motion setting.

- `src/release.ts`: **the only file to edit per release** (version, file names, sizes, SHA-256). Download URLs are pinned to the tag: `/releases/download/v<version>/<file>`.
- `src/components/`: hero network animation, live loss curve, download cards and checksum panel.
- The font is self-hosted (`@fontsource-variable/plus-jakarta-sans`), so there are no requests to Google.
- `npm run build` adds a strict Content-Security-Policy meta tag (`'self'` only) to `dist/index.html`.

## Commands
- `npm install`
- `npm run dev`: dev server
- `npm run build`: production build into `dist/`
- `npm run preview`: serve `dist/` at http://127.0.0.1:8080

## Releasing
1. Publish a GitHub Release tagged `v<version>` with installers named exactly as in `src/release.ts`.
2. Put each file's SHA-256 in `src/release.ts` and in the release notes.
3. For macOS, build the `.dmg` on a macOS runner, then fill in the `mac` entries.
4. Deploy `dist/` to any HTTPS static host (Vercel, Netlify, GitHub Pages). No secrets belong in this site.
