# Kiln dev log

## 2026-10-31 — Fork created

- Forked `amosblomqvist/learnharness` → `AtlasMeridia/Kiln` via `gh repo fork`, renamed to Kiln, cloned to `~/Projects/Kiln`.
- Remotes: `origin` = AtlasMeridia/Kiln, `upstream` = amosblomqvist/learnharness.
- Name rationale: measure = wet clay, teach = shaping, practice = firing it permanent. Matches the Minerali material register and works as a CLI (`kiln plan`).
- License: AGPL-3.0 — fork stays AGPL; network-use clause applies if we ever host it.
- **Pre-existing upstream test failure** (verified on pristine clone, not fork-induced): `tests/subscription-auth.test.ts:35` — "main loader resolves Pi's import-only PUBLIC package exports". `electron/subscriptions.cjs:29` uses Node `registerHooks` to add an `import` resolve condition, but under `tsx --test` (tsx patches CJS resolution) the hook is bypassed, so `require.resolve("@earendil-works/pi-ai")` throws `ERR_PACKAGE_PATH_NOT_EXPORTED` (pi-ai 1.4.0 exports are import-only). Node v22.22.1, tsx 4.23.12 (both from lockfile). Rest of suite: 1 fail / ~1300 pass.
- Upstream stack: TypeScript, Next.js (`app/`, `components/`), Electron desktop wrapper, tests deterministic/no-network per README.
- Pending: rebrand sweep, dev-boot verification, upstream release/update-feed de-coupling.

## 2026-10-31 — Rebrand sweep complete

Decisions (user-approved): data dir renamed to Kiln with one-time migration; update feed → AtlasMeridia/Kiln releases; notarization env-driven (upstream's APPLE_TEAM_ID/keychain profile removed).

- **Identity:** `appId: com.atlasmeridia.kiln`, `productName: Kiln`, package name `kiln` (author AtlasMeridia, homepage → fork). `desktop:dist` notarizes only when `APPLE_TEAM_ID` + `APPLE_KEYCHAIN_PROFILE` are set (`-c.mac.notarize=true`); default build is unsigned. `notify-website.yml` deleted; `release.yml`/`verify-release.ts` dist paths → Kiln.
- **Migration:** `electron/main.cjs` `migrateLegacyUserData()` copies the old `Application Support/LearnHarness` dir whole on first boot (data, auth.json, logs); original kept; never merges/overwrites; skipped in dev shell.
- **Mapping applied (~230 files):** LearnHarness→Kiln, `LH_`→`KILN_` env (DATA_DIR, AUTH_FILE, DEV_URL, DESKTOP_SERVER, DESKTOP_API_SECRET, UPDATE_FEED, …), `lh:`→`kiln:` IPC channels, `lh-`/`lh_`→`kiln-`/`kiln_`, `x-learnharness-*`→`x-kiln-*` headers, types `LhMessage`/`LhMarkerMessage`/`LhMark`→`Kiln*`, `window.lh`→`window.kiln`, `__lh*` globalThis hooks→`__kiln*`, `phaseAt3Lh`→`phaseAt3Kiln`, `lh-cmu`→`kiln-cmu` font-face, `app/globals.css` `.lh-*`/`--lh-*`/`data-lh-*`→`.kiln-*`/`--kiln-*`/`data-kiln-*`, `components/lh-mark.tsx`→`kiln-mark.tsx`, `skills/learnharness/`→`skills/kiln/`, MCP tool names `mcp__kiln__*`.
- **Kept deliberately:** LICENSE untouched; README fork attribution ("fork of LearnHarness by Amos Blomqvist"); the literal `"LearnHarness"` legacy-dir path in the migration; two history comments quoting the old "LH" wordmark; `public/fonts/OFL.txt` ("lh fonts" = foundry name); asset binaries (`docs/assets/*.png`, `build/icon.*` — design pass pending).
- **Verification:** `tsc --noEmit` clean; suite 3186/3187 (the single fail is the pre-existing upstream tsx/registerHooks issue, unchanged by the sweep); dev server renders with `<title>Kiln</title>` and zero LearnHarness strings in the DOM; repo-wide grep shows only the intentional references above.
- Working tree uncommitted; commit+push pending user go-ahead.

## 2026-11-01 — Minerali stage 1: token layer

Adopted atlas-design (Minerali v6.5) tokens. User decisions: full re-skin staged; Minerali faces self-hosted via next/font; graphite only (no cream toggle yet).

- **Token copy:** `app/colors_and_type.css` byte-for-byte from `~/Projects/atlas-design` (cmp-verified). Import order: token file FIRST, then `tailwindcss` — the file's Google Fonts `@import url(...)` must precede all rules in the bundled output; behind Tailwind it landed ~3000 lines deep and Lightning CSS refused the parse. Consequence: Tailwind preflight overrides the token file's *element* defaults (h1–h4 sizes, b/strong); tokens/themes/`.mn-*` survive (vars + classes beat preflight). Body font-size pinned to 16px in globals (Minerali's base sets 18px).
- **Factory palette → Minerali graphite:** shadcn token names kept, values now resolve through the token file (`--background: var(--bg-primary)` #1a1a1d, `--foreground: var(--text-primary)` paper #e6ddc8, card/popover/secondary = `--bg-elevated`, muted = `--bg-deep`, border/input = `--border-color`, ring = `--accent-cut` acid, destructive = `--error`). Kiln's "accent" is a raised hover surface, not a signal → `--mn-smoke`; rust/acid signals are stage-2 work. `.dark` block mirrors via the same vars. Radii → 0/0/2/2 (`--radius: 0`).
- **Emphasis doctrine:** `--kiln-ink-strong` = text color (weight carries bold); `--kiln-ink-italic` = `--accent-text` (Minerali em = rust). Settings rows relabeled ("Empty = rust (accent)"); overrides still work.
- **Faces:** Fraunces (display/titles, `--font-title`) + Literata (prose, `--font-prose`) via `next/font/google` — self-hosted at build, offline-safe; JetBrains Mono chrome unchanged; Source Sans 3 stays for incidental `--font-sans` consumers (streamdown chrome, mermaid). kiln-cmu @font-face removed; `public/fonts/cmunbx.ttf` now unused. Reading-font settings: factory family "Literata", fallback list Fraunces replaces CMU Serif.
- **Derivation curve:** `derivedPalette` offsets +8/+22/+47 → +6/+33/+20 (tracks the Minerali graphite ladder: card #202024, hover ≈ smoke, border ≈ hairline). Custom backgrounds approximate; factory resolves via tokens. Electron title-bar overlay + window `backgroundColor` → #1a1a1d; symbolColor → paper.
- **Verification:** typecheck clean; suite 3186/3187 (only the pre-existing upstream tsx failure). Live DOM: body bg #1a1a1d, fg #e6ddc8, mono chrome, `--ds-version` 6.5, `--radius` 0; `document.fonts` confirms Fraunces 400/700/900 + Literata loaded (next/font self-host).
- **Pending:** stage 2 shape pass (square literal radii in components, hairline borders, rust links/emphasis, acid active-state cut, `--kiln-zoom` audit); `design-desk handoff bootstrap --project kiln` to register in consumers.json (needs a desk.css route); commit the accumulated working tree.
