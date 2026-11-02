# Scordle

Scordle is a word-guessing game with a 5-minute timer and a scoring system. Guess the 5-letter word in 6 tries; you earn points for each new letter you find, plus bonuses for winning early and solving fast.

Live: [https://kgromero-Scordle.fly.dev/](https://kgromero-Scordle.fly.dev/)

## Features

- Random word from a curated answer list, checked against a 13,000-word dictionary
- Color feedback on each letter, with a flip animation and an on-screen keyboard
- Works with a physical keyboard or touch
- 5-minute countdown that starts when you type your first letter
- Scoring with win and time bonuses, and a score breakdown at the end of each game (see the in-game Rules)
- Stats and full game history, saved in the browser
- Light and dark themes (follows your system setting until you pick one)
- Responsive layout for phones and desktop

## Tech

React-style components on Preact (via `preact/compat`, about 7 KB) + Vite. Everything runs in the browser; there is no backend. In production the built site is served by nginx in a Docker container on Fly.io.

## Development

```
npm install
npm run dev      # start the dev server at http://localhost:5173
npm test         # run the unit tests
npm run build    # build the static site into dist/
```

## Project layout

- `src/game/` – game rules (`logic.js`), game state (`reducer.js`), word lists (`words.js`), saved history (`history.js`)
- `src/components/` – board, keyboard and popups
- `src/words/` – answer and valid-guess word lists
- `public/` – icons and web app manifest (`icon-source.svg` is the editable icon design)

## Deployment

Pushing to `main` deploys to Fly.io through `.github/workflows/fly-deploy.yml`. This needs the `FLY_API_TOKEN` repository secret.

To deploy by hand: `fly deploy`.

## License

MIT, see [LICENSE](LICENSE).
