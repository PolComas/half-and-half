# Installation and verification

This is technical setup documentation. Submission answers and video narration are written by the project owner.

## Local requirements

- Node.js 24 and npm.
- Internet access for the real Supabase and OpenAI integrations.
- An empty Supabase project with a server secret key and an OpenAI account authorized to use the image model configured in `server/config.ts`.
- Two separate browser profiles or browsers to occupy the two seats. Tabs in the same profile share a participant.

The project is currently run locally; it has no deployed public app URL. Both servers bind to the local loopback interface. Responsive layouts and emulated touch tests do not imply that a phone on another network can reach this local server.

## Install and configure

```bash
git clone https://github.com/PolComas/half-and-half.git
cd half-and-half
npm ci
cp -n .env.example .env
```

Keep `.env` local. Set `SUPABASE_URL`, `SUPABASE_SECRET_KEY` and `OPENAI_API_KEY` there. The Supabase credential must be a secret key or a legacy `service_role` key; an `anon` key is insufficient. Never put server credentials in frontend variables, submission fields or Git.

For a new empty Supabase project, apply these SQL files in order using that project's SQL editor:

1. `supabase/migrations/20261022182219_room_generation.sql`
2. `supabase/migrations/20261022182222_private_bucket.sql`
3. `supabase/migrations/20261022185553_hybrid_prompt.sql`
4. `supabase/migrations/20261022191431_final_reveal.sql`

The existing project used during development has these migrations already applied. Do not reapply them to it or to an unrelated database. The tables and image bucket are private; the Node server checks participant access.

Real image generation is disabled in `.env.example`. Before enabling it, the owner must verify available credit, automatic recharge settings and applicable limits, then set both `OPENAI_BILLING_VERIFIED` and `OPENAI_GENERATION_ENABLED` to `true`. Image requests cost money. The application's persistent limit is 20 requests across rooms, including attempts and tests; each room allows three attempts in total. These counters are not the OpenAI account balance.

```bash
npm run preflight
npm run dev
```

Preflight reports credential presence/type and database connectivity without displaying keys or making an OpenAI request. It does not check billing. Open **http://localhost:5173**. Use that hostname consistently; changing origin changes browser identity and local storage. `Ctrl+C` stops both development processes.

## Verify a real round

1. In browser profile A, create a room. In profile B, join with its six-character code.
2. Enter and confirm a different idea in each profile. A real API request starts only after both confirmations; this consumes credit and an attempt.
3. Each profile receives only its own vertical half after the single shared image is ready. Both original ideas are now visible.
4. Use Fill and Brush. Wait for **Saved on this device** before reloading; saved colors should return in that profile. The partner's colors must remain hidden.
5. Finish and confirm in A. It must wait, showing only its own finished half.
6. Finish and confirm in B. Both profiles should reveal the same completed image and offer the same PNG download.
7. Home preserves access to the current room. After reveal, a new room can be opened; up to three revealed PNGs are retained locally on that device.

The creator receives the left half; the joining participant receives the right. Closed areas with gaps in their outlines may fill together; Undo and Brush provide correction. Local drafts and recent artwork do not transfer between devices or survive clearing browser data.

The header's motion button pauses and resumes background animation at its current position. Without an explicit preference, background motion follows the device's reduced-motion setting. Painting still requires a pointer or touch; complete keyboard/screen-reader accessibility and physical mobile/Safari support have not been verified.

## Compiled execution

```bash
npm run build
APP_ORIGIN=http://localhost:3001 npm start
```

Open **http://localhost:3001**, again in two independent profiles. Keep the configured origin stable during a round.

## Automated checks and a free synthetic fixture

```bash
npm run typecheck
npm test
npm run build
```

Integration and browser checks require PostgreSQL 16+ (`pg_config`, `initdb`, `pg_ctl`) and installed Google Chrome. They use a dedicated temporary PostgreSQL cluster at `127.0.0.1:5548`, not the real Supabase project.

```bash
npm run test:db
npm run test:integration
npm run test:e2e
npm run test:db:stop
```

To inspect the synthetic test fixture interactively without API keys or paid generation:

```bash
npm run test:db
node --import tsx tests/support/e2e-server.ts
```

Open **http://localhost:5179** in two separate profiles. The banner says **Test fixture — no AI was called**. This fixture exercises the interaction with a synthetic image; it does **not** demonstrate real image generation and must not be presented as such in the demo. Stop the fixture with `Ctrl+C`, then run `npm run test:db:stop`. Do not run it concurrently with the automated browser suite, which uses the same ports.

Real integration evidence and limitations are recorded in [`devpost/verification.md`](../devpost/verification.md). The required final demo video link has not yet been supplied. Deployment is optional; arrangements for any requested real-service judging access remain to be finalized without publishing credentials.

## License

The original project code is available under [MIT](../LICENSE), approved by its owner on 23 October 2026. Dependencies retain their respective licenses. Quotations and third-party material in historical context are not relicensed as original project code.
