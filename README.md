# Discord Username Checker

Simple website: generate short Discord usernames (2–5 char combos, patterns, wordlists) and check **live availability** against Discord’s official endpoint.

No tokens. No auto-claim. Generator + checker only.

## Features

- Short combos: `2C` `2L` `2N` `3C` `3L` `3N` `4N` `4L` `4C`
- Patterns: Semi 3L, Dotted, _Repeaters, Letter Repeaters, 4L/5L Pronounceable, Faces (`X_X`)
- Wordlists: EN / FR style stems
- Real check via `POST /api/v9/unique-username/username-attempt-unauthed`
- Statuses: **available** / **taken** / **invalid** / **error**
- Clean single-page UI

## Run locally

```bash
git clone https://github.com/someone405-ship-it/discord-username-checker.git
cd discord-username-checker
npm install
npm start
```

Open **http://localhost:3847**

## API

| Method | Path | Body | Notes |
|--------|------|------|-------|
| GET | `/api/presets` | — | list generator presets |
| POST | `/api/generate` | `{ "preset": "3L", "limit": 1500 }` | returns usernames array |
| POST | `/api/check` | `{ "usernames": ["name1","name2"] }` | max 500 per request |
| POST | `/api/check-one` | `{ "username": "name" }` | single name |

## Deploy

Any Node host works (Railway, Render, Fly, VPS):

```bash
npm install
npm start
```

Set `PORT` env if the host requires it.

## Notes

- Rate limits are real — keep batch sizes reasonable.
- Discord rules: 2–32 chars, no `@ # : ``` discord`, etc.
