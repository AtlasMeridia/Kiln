/**
 * Data-dir isolation for store-touching tests (leak fix, 2026-11-01).
 *
 * WHY: `config.ts` captures `DATA_ROOT` from `KILN_DATA_DIR` at module
 * load. Any hoisted static import that transitively reaches config.ts
 * (e.g. `src/agent/models.ts`, `src/store/chats.ts`) evaluates BEFORE a
 * test file's module body — so `process.env.KILN_DATA_DIR = …` set in
 * the body arrives too late, and store singletons write to the repo's
 * real `data/` directory. Five test files leaked fixture chats/jobs
 * into `data/chats/` + `data/jobs/` this way (they only partially
 * cleaned up after themselves, and a failing run left files behind).
 *
 * HOW: `import { … } from "./isolated-data.ts"` as the FIRST import of
 * the test file. ES modules evaluate imports in source order, so this
 * module runs before anything can load config.ts. It points the data
 * and auth seams at a fresh temp dir (respecting a pre-set value) and
 * removes it at process exit — no per-file after() hooks required.
 *
 * Never import app code from here.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "kiln-isolated-"));
if (!process.env.KILN_DATA_DIR) process.env.KILN_DATA_DIR = path.join(dir, "data");
if (!process.env.KILN_AUTH_FILE) {
	process.env.KILN_AUTH_FILE = path.join(dir, "auth.json");
	fs.writeFileSync(process.env.KILN_AUTH_FILE, "{}");
}

process.on("exit", () => {
	try {
		fs.rmSync(dir, { recursive: true, force: true });
	} catch {
		/* best effort — temp dirs are OS-cleaned regardless */
	}
});

export const isolatedDir = dir;
