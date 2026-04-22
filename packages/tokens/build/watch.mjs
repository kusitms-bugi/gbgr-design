#!/usr/bin/env node
import { spawn } from "node:child_process"
import { watch } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const pkgRoot = join(__dirname, "..")
const tokensStudioPath = join(pkgRoot, "src/tokens-studio.json")

let buildTimeout = null

function runBuild() {
	return new Promise((resolve, reject) => {
		const child = spawn("node", ["build/build.mjs"], {
			stdio: "inherit",
			cwd: pkgRoot,
		})
		child.on("error", reject)
		child.on("close", (code) => {
			if (code === 0) resolve()
			else reject(new Error(`Build failed with code ${code}`))
		})
	})
}

console.log(`👀 Watching ${tokensStudioPath} for changes...`)
console.log("Press Ctrl+C to stop watching\n")

watch(tokensStudioPath, { persistent: true }, (eventType) => {
	if (eventType === "change") {
		// Debounce: wait 300ms before rebuilding
		if (buildTimeout) clearTimeout(buildTimeout)

		buildTimeout = setTimeout(async () => {
			console.log("\n🔄 Tokens file changed, rebuilding...\n")
			try {
				await runBuild()
				console.log("\n✅ Rebuild completed\n")
			} catch (e) {
				console.error("\n❌ Rebuild failed:", e.message, "\n")
			}
		}, 300)
	}
})

// Initial build
runBuild().catch((e) => {
	console.error("❌ Initial build failed:", e.message)
	process.exit(1)
})
