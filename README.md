# Parisa Farzan — Case File

An interactive character dossier for Parisa Farzan: ER attending, former South Faction hunter trainer, dishonorably discharged.

Static site — plain HTML/CSS/JS, no build step, no dependencies.

## Features

- Live ECG "vitals monitor" with a scrolling heartbeat line and jittering BPM
- Redacted/stamped classification badges (Hunter Clearance: Revoked)
- Animated tabs (Timeline / Voice / Reputation / Quotes) with a sliding underline
- Typewriter-effect quote rotator, click any `#` pill to jump to a quote
- Cursor-reactive glow on the pillar cards
- Scroll-triggered reveal animations
- Fully responsive, respects `prefers-reduced-motion`

## Preview locally

Open `index.html` directly in a browser, or serve it:

```bash
npx serve .
```

## Deploy to GitHub Pages

1. Create a new GitHub repo and push this folder to it.
2. In the repo settings, go to **Pages**.
3. Under **Source**, choose the `main` branch (root folder).
4. Save — GitHub will publish it at `https://<username>.github.io/<repo-name>/`.
