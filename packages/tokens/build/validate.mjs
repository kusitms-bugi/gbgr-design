#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const pkgRoot = join(__dirname, "..")
const distDir = join(pkgRoot, "dist")

function isTokenLeaf(v) {
	return v && typeof v === "object" && "value" in v && "type" in v
}

const COLOR_HEX_REGEX = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/
const COLOR_RGB_REGEX = /^rgba?\(/
const REFERENCE_REGEX = /^\{[^}]+\}$/

function validateTokenValue(value, type, path) {
	const errors = []

	if (type === "color") {
		if (typeof value !== "string") {
			errors.push(`${path}: color value must be a string`)
		} else if (
			!COLOR_HEX_REGEX.test(value) &&
			!COLOR_RGB_REGEX.test(value) &&
			!REFERENCE_REGEX.test(value) &&
			!value.startsWith("linear-gradient") &&
			!value.startsWith("radial-gradient")
		) {
			errors.push(
				`${path}: invalid color value "${value}". Expected hex (#fff or #ffffff), rgb/rgba, reference ({...}), or gradient`,
			)
		}
	} else if (type === "number") {
		if (typeof value !== "number") {
			errors.push(`${path}: number value must be a number`)
		}
	} else if (type === "opacity") {
		if (typeof value !== "number") {
			errors.push(`${path}: opacity value must be a number`)
		} else if (value < 0 || value > 1) {
			errors.push(`${path}: opacity value must be between 0 and 1`)
		}
	} else if (type === "text") {
		if (typeof value !== "string") {
			errors.push(`${path}: text value must be a string`)
		}
	}

	return errors
}

function validateTokens(obj, path = "root", errors = []) {
	if (!obj || typeof obj !== "object") {
		errors.push(`${path}: must be an object`)
		return errors
	}

	for (const [key, value] of Object.entries(obj)) {
		const currentPath = path === "root" ? key : `${path}.${key}`

		if (isTokenLeaf(value)) {
			// Validate token leaf structure
			if (!("value" in value)) {
				errors.push(`${currentPath}: missing required field "value"`)
			}
			if (!("type" in value)) {
				errors.push(`${currentPath}: missing required field "type"`)
			}

			if (value.value !== undefined && value.type) {
				const valueErrors = validateTokenValue(
					value.value,
					value.type,
					currentPath,
				)
				errors.push(...valueErrors)
			}
		} else if (value && typeof value === "object" && !Array.isArray(value)) {
			// Recursively validate nested objects
			validateTokens(value, currentPath, errors)
		} else if (Array.isArray(value)) {
			errors.push(`${currentPath}: arrays are not supported in token structure`)
		}
	}

	return errors
}

function validateReferences(tokens, errors = []) {
	const tokenPaths = new Set()

	// Collect all token paths
	function collectPaths(obj, path = "") {
		if (isTokenLeaf(obj)) {
			tokenPaths.add(path)
			return
		}
		if (obj && typeof obj === "object" && !Array.isArray(obj)) {
			for (const [key, value] of Object.entries(obj)) {
				const currentPath = path ? `${path}.${key}` : key
				collectPaths(value, currentPath)
			}
		}
	}

	collectPaths(tokens)

	// Validate references
	function checkReferences(obj, path = "") {
		if (isTokenLeaf(obj)) {
			if (typeof obj.value === "string" && REFERENCE_REGEX.test(obj.value)) {
				const refPath = obj.value.slice(1, -1) // Remove { }
				if (!tokenPaths.has(refPath)) {
					errors.push(
						`${path}: reference "${obj.value}" points to non-existent token path "${refPath}"`,
					)
				}
			}
			return
		}
		if (obj && typeof obj === "object" && !Array.isArray(obj)) {
			for (const [key, value] of Object.entries(obj)) {
				const currentPath = path ? `${path}.${key}` : key
				checkReferences(value, currentPath)
			}
		}
	}

	checkReferences(tokens)
	return errors
}

async function main() {
	const errors = []
	const warnings = []

	// 1. Check if required files exist
	const sdInputPath = join(distDir, "sd.input.json")
	const tokensJsonPath = join(distDir, "tokens.json")
	const tokensDtsPath = join(distDir, "tokens.d.ts")
	const themeCssPath = join(distDir, "theme.css")

	if (!existsSync(sdInputPath)) {
		errors.push("❌ dist/sd.input.json not found. Run build first.")
	}
	if (!existsSync(tokensJsonPath)) {
		errors.push("❌ dist/tokens.json not found. Run build first.")
	}
	if (!existsSync(tokensDtsPath)) {
		errors.push("❌ dist/tokens.d.ts not found. Run build first.")
	}
	if (!existsSync(themeCssPath)) {
		errors.push("❌ dist/theme.css not found. Run build first.")
	}

	if (errors.length > 0) {
		console.error("Validation failed:\n")
		for (const e of errors) {
			console.error(e)
		}
		process.exit(1)
	}

	// 2. Validate token structure
	console.log("🔍 Validating token structure...")
	const tokens = JSON.parse(readFileSync(sdInputPath, "utf8"))
	const structureErrors = validateTokens(tokens)

	if (structureErrors.length > 0) {
		errors.push(...structureErrors)
	} else {
		console.log("✅ Token structure is valid")
	}

	// 3. Validate references
	console.log("🔍 Validating token references...")
	const referenceErrors = validateReferences(tokens)

	if (referenceErrors.length > 0) {
		errors.push(...referenceErrors)
	} else {
		console.log("✅ All token references are valid")
	}

	// 4. Check for common issues
	console.log("🔍 Checking for common issues...")
	const tokenCount = countTokens(tokens)
	console.log(`📊 Found ${tokenCount} tokens`)

	if (tokenCount === 0) {
		warnings.push("⚠️  No tokens found in the file")
	}

	// Report results
	if (errors.length > 0) {
		console.error("\n❌ Validation failed:\n")
		for (const e of errors) {
			console.error(`  ${e}`)
		}
		process.exit(1)
	}

	if (warnings.length > 0) {
		console.warn("\n⚠️  Warnings:\n")
		for (const w of warnings) {
			console.warn(`  ${w}`)
		}
	}

	console.log("\n✅ All validations passed!")
}

function countTokens(obj) {
	let count = 0
	if (isTokenLeaf(obj)) {
		return 1
	}
	if (obj && typeof obj === "object" && !Array.isArray(obj)) {
		for (const value of Object.values(obj)) {
			count += countTokens(value)
		}
	}
	return count
}

main().catch((err) => {
	console.error("❌ Validation error:", err.message)
	process.exit(1)
})
