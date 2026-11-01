# Backlog

## Burn

## Now
- [ ] Triage pre-existing upstream test failure `tests/subscription-auth.test.ts:35` (registerHooks bypassed under tsx → ERR_PACKAGE_PATH_NOT_EXPORTED); check upstream issues before patching

## Next
- [ ] Design pass on banner/logo/icons in Minerali idiom (see ~/Projects/atlas-design; `build/icon.*`, `docs/assets/` banners, sidebar kiln-mark)
- [ ] First desktop build rehearsal: `npm run desktop:dist` (unsigned path) to prove the env-driven notarization wiring

## Blocked
- [ ] ⏸ Nothing blocked

## Later
- [ ] Consider atlas-design `colors_and_type.css` integration for the fork's UI surfaces
- [ ] Commit the rebrand sweep and push to AtlasMeridia/Kiln (working tree currently uncommitted)

## Done
- [x] Forked and renamed repo to AtlasMeridia/Kiln, cloned to ~/Projects/Kiln, added upstream remote — 2026-10-31
- [x] Dev boot verified: `npm install` clean, `npm run dev` serves http 200, test suite green except 1 pre-existing upstream failure — 2026-10-31
- [x] Rebrand sweep: 156+ files to Kiln (strings, `KILN_*` env, `kiln:` IPC, `x-kiln-*` headers, types `KilnMessage`/`KilnMark`, `window.kiln`, `app/globals.css` tokens, `kiln-cmu` font, `skills/kiln/`, workflows, verify-release) — 2026-10-31
- [x] Identity: appId `com.atlasmeridia.kiln`, productName Kiln, publish feed → AtlasMeridia/Kiln releases, notarize env-driven (upstream team ID removed), notify-website workflow deleted, README rewritten with fork attribution — 2026-10-31
- [x] One-time LearnHarness → Kiln userData migration in `electron/main.cjs` (copies old Application Support dir on first boot; original kept) — 2026-10-31
- [x] Verified post-rebrand: typecheck clean, tests 3186/3187 (only the pre-existing upstream tsx failure), dev UI renders with title "Kiln" and zero LearnHarness strings — 2026-10-31
