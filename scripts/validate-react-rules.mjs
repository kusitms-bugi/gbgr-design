#!/usr/bin/env node
import { readdir, readFile } from "node:fs/promises"
import path from "node:path"

const REACT_PACKAGE_PATH = path.resolve(process.cwd(), "packages/react/src")
const COLOR_REGEX =
	/(#([0-9a-f]{3}){1,2}|(rgb|hsl)a?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+\s*)?\))/gi
const ALLOWED_COLORS = ["transparent", "currentColor"]

let errorsFound = false

async function* getFiles(dir) {
	const dirents = await readdir(dir, { withFileTypes: true })
	for (const dirent of dirents) {
		const res = path.resolve(dir, dirent.name)
		if (dirent.isDirectory()) {
			yield* getFiles(res)
		} else {
			yield res
		}
	}
}

async function validateFile(filePath) {
	const content = await readFile(filePath, "utf-8")
	const fileExtension = path.extname(filePath)

	if (fileExtension === ".ts" || fileExtension === ".tsx") {
		if (content.includes("@gbgr/tokens/tokens.json")) {
			console.error(
				`[Error] Forbidden import found in ${filePath}:\n'import ... from "@gbgr/tokens/tokens.json"' is not allowed. Use CSS variables instead.`,
			)
			errorsFound = true
		}
	}

	if (fileExtension === ".css") {
		const matches = content.match(COLOR_REGEX) || []
		const violations = matches.filter(
			(match) => !ALLOWED_COLORS.includes(match.toLowerCase()),
		)

		if (violations.length > 0) {
			console.error(
				`[Error] Hardcoded color found in ${filePath}:\nDetected values: ${violations.join(
					", ",
				)}. Please use CSS variables (e.g., var(--gbgr-color-primary)).`,
			)
			errorsFound = true
		}
	}
}

async function main() {
	console.log("🔍 Running custom rule validation for @gbgr/react...")

	for await (const file of getFiles(REACT_PACKAGE_PATH)) {
		await validateFile(file)
	}

	if (errorsFound) {
		console.error("\n❌ Custom rule validation failed.")
		process.exit(1)
	} else {
		console.log("\n✅ Custom rule validation passed.")
	}
}

main()
