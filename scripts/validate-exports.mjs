/**
 * validate-exports.mjs
 * Verifies that package.json exports match actual built/published files.
 * Run: node scripts/validate-exports.mjs
 */
import { existsSync } from "node:fs"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

const root = fileURLToPath(new URL("..", import.meta.url))

const packages = [
	{ dir: "packages/tokens", name: "@gbgr/tokens" },
	{ dir: "packages/icons", name: "@gbgr/icons" },
	{ dir: "packages/react", name: "@gbgr/react" },
]

let errors = 0

for (const pkg of packages) {
	const pkgJsonPath = join(root, pkg.dir, "package.json")
	if (!existsSync(pkgJsonPath)) continue

	const pkgJson = JSON.parse(
		await import("node:fs").then((f) => f.readFileSync(pkgJsonPath, "utf-8")),
	)
	const exports = pkgJson.exports || {}
	const basePath = join(root, pkg.dir)

	console.log(`\n📦 ${pkg.name}`)

	for (const [exportKey, exportValue] of Object.entries(exports)) {
		// Skip wildcard patterns (e.g. "./*")
		if (exportKey.includes("*")) continue

		// Handle conditional exports (object with import/types/etc)
		let filePath
		if (typeof exportValue === "string") {
			filePath = exportValue
		} else if (typeof exportValue === "object") {
			// Check all conditions
			for (const [condition, path] of Object.entries(exportValue)) {
				filePath = path
				const fullPath = join(basePath, filePath)
				if (!existsSync(fullPath)) {
					console.error(
						`  ✖ ${exportKey} (${condition}): ${filePath} — NOT FOUND`,
					)
					errors++
				} else {
					console.log(`  ✓ ${exportKey} (${condition}): ${filePath}`)
				}
			}
			continue
		}

		if (filePath) {
			const fullPath = join(basePath, filePath)
			if (!existsSync(fullPath)) {
				console.error(`  ✖ ${exportKey}: ${filePath} — NOT FOUND`)
				errors++
			} else {
				console.log(`  ✓ ${exportKey}: ${filePath}`)
			}
		}
	}

	// Check files field
	const files = pkgJson.files || []
	for (const fileDir of files) {
		const fullPath = join(basePath, fileDir)
		if (!existsSync(fullPath)) {
			console.error(`  ✖ files[${fileDir}] — NOT FOUND`)
			errors++
		}
	}
}

console.log("")
if (errors > 0) {
	console.error(`❌ ${errors} export path(s) missing`)
	process.exit(1)
} else {
	console.log("✅ All exports validated")
}
