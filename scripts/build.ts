import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";

function run(command: string) {
	const result = spawnSync(command, {
		shell: true,
		stdio: "inherit",
	});

	if (result.error) {
		throw result.error;
	}

	if (result.status !== 0) {
		process.exit(result.status ?? 1);
	}
}

async function listFiles(dir: string, base = dir) {
	const files: string[] = [];
	const entries = await fs.readdir(dir, { withFileTypes: true });

	await Promise.all(
		entries.map(async entry => {
			const fullPath = path.join(dir, entry.name);
			if (entry.isDirectory()) {
				files.push(...(await listFiles(fullPath, base)));
			} else if (entry.isFile()) {
				files.push(path.relative(base, fullPath).split(path.sep).join("/"));
			}
		})
	);

	return files;
}

run("pnpm -F noname... build");
run("pnpm -F ./packages/extension/** build");

console.log("合并打包结果");
await fs.rm("dist", { recursive: true, force: true });
await fs.mkdir("dist", { recursive: true });
await Promise.all([
	fs.cp("apps/core/dist", "dist", { recursive: true }),
	fs.cp("apps/core/audio", "dist/audio", { recursive: true }),
	fs.cp("apps/core/image", "dist/image", { recursive: true }),
	fs.cp("apps/core/extension", "dist/extension", { recursive: true }),
	fs.cp("docs", "dist/docs", { recursive: true }),
	fs.cp(".nomedia", "dist/.nomedia"),
	fs.cp("LICENSE", "dist/LICENSE"),
	fs.cp("README.md", "dist/README.md")
]);

const files = await listFiles("dist");
files.push("game/filelist.json");
files.sort();
await fs.writeFile("dist/game/filelist.json", JSON.stringify(files, null, "\t"));
