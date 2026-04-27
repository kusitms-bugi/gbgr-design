#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const pkgRoot = join(__dirname, "..")
const distDir = join(pkgRoot, "dist")

function ensureDir(dir) {
	if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
}

function stripExtensions(obj) {
	if (!obj || typeof obj !== "object" || Array.isArray(obj)) return obj
	const result = Array.isArray(obj) ? [] : {}
	for (const [k, v] of Object.entries(obj)) {
		if (k === "$extensions") continue
		result[k] = stripExtensions(v)
	}
	return result
}

function buildLookup(obj, prefix = "") {
	const map = new Map()
	for (const [k, v] of Object.entries(obj)) {
		const path = prefix ? `${prefix}.${k}` : k
		if (v && typeof v === "object" && !Array.isArray(v)) {
			if ("value" in v && "type" in v) {
				map.set(path, v)
			} else {
				for (const [pk, pv] of buildLookup(v, path)) {
					map.set(pk, pv)
				}
			}
		}
	}
	return map
}

function resolveAllRefs(obj, lookup, maxPasses = 20) {
	for (let pass = 0; pass < maxPasses; pass++) {
		let changed = false
		obj = resolveRefs(obj, lookup, () => {
			changed = true
		})
		if (!changed) break
	}
	return obj
}

function resolveRefs(obj, lookup, onResolve) {
	if (typeof obj === "string") {
		const m = obj.match(/^\{(.+)\}$/)
		if (m) {
			const entry = lookup.get(m[1])
			if (entry && typeof entry.value !== "object") {
				onResolve()
				return entry.value
			}
		}
		return obj
	}
	if (!obj || typeof obj !== "object" || Array.isArray(obj)) return obj
	const result = Array.isArray(obj) ? [] : {}
	for (const [k, v] of Object.entries(obj)) {
		result[k] = resolveRefs(v, lookup, onResolve)
	}
	return result
}

function resolveCompositeValues(obj, lookup) {
	if (!obj || typeof obj !== "object" || Array.isArray(obj)) return obj
	for (const [, v] of Object.entries(obj)) {
		if (v && typeof v === "object" && !Array.isArray(v)) {
			if (
				"value" in v &&
				"type" in v &&
				typeof v.value === "object" &&
				!Array.isArray(v.value)
			) {
				const resolved = {}
				for (const [vk, vv] of Object.entries(v.value)) {
					if (typeof vv === "string") {
						const m = vv.match(/^\{(.+)\}$/)
						resolved[vk] = m && lookup.has(m[1]) ? lookup.get(m[1]).value : vv
					} else {
						resolved[vk] = vv
					}
				}
				v.value = resolved
			} else {
				resolveCompositeValues(v, lookup)
			}
		}
	}
	return obj
}

// --- CSS Variable Naming ---
// Base.Grey.50 → --color-global-grey-50
// Base.Grey Opacity.300 → --color-global-grey-opacity-300
// Semantic.Border.Neutral.Strong → --color-semantic-border-neutral-strong
// fontSize.0 → --font-size-0

function cleanSegment(s) {
	return s
		.replace(/\s+/g, "-")
		.replace(/[()]/g, "")
		.replace(/--+/g, "-")
		.toLowerCase()
}

function buildCssName(pathParts) {
	const [section, ...rest] = pathParts

	if (section === "Base") {
		// Base.Grey.50 → color-global-grey-50
		// Base.Yellow Opacity.200 → color-global-yellow-opacity-200
		// Base.Green.500 → color-global-green-500
		return `color-global-${rest.map(cleanSegment).join("-")}`
	}
	if (section === "Semantic") {
		return `color-semantic-${rest.map(cleanSegment).join("-")}`
	}
	if (section === "Elevation") {
		return `elevation-${rest.map(cleanSegment).join("-")}`
	}
	// fontSize, letterSpacing, etc
	return rest.length > 0
		? `${cleanSegment(section)}-${rest.map(cleanSegment).join("-")}`
		: cleanSegment(section)
}

// Deduplicate: "Grey" parent + "Grey 50" child → "50"
function dedupKey(key, parentKey) {
	if (!parentKey) return key
	// "Grey 50" under "Grey" → "50"
	// "Grey Opacity 800" under "Grey Opacity" → "800"
	// "Grey Opacity" under "Grey" → "Opacity"
	const escaped = parentKey.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
	const stripped = key.replace(new RegExp(`^${escaped}\\s+`), "")
	if (/^\d+$/.test(stripped)) return stripped
	if (stripped !== key) return stripped
	return key
}

function flattenTokens(obj, pathParts = [], parentKey = "") {
	const vars = []
	for (const [k, v] of Object.entries(obj)) {
		const cleanKey = dedupKey(k, parentKey)
		const currentPath = [...pathParts, cleanKey]
		const cssName = buildCssName(currentPath)

		if (v && typeof v === "object" && !Array.isArray(v)) {
			if ("value" in v && "type" in v) {
				let val = v.value
				if (typeof val === "object" && !Array.isArray(val)) {
					if (v.type === "boxShadow") {
						const s = Array.isArray(val) ? val : [val]
						val = s
							.map(
								(x) =>
									`${x.x || 0}px ${x.y || 0}px ${x.blur || 0}px ${x.spread || 0}px ${x.color || "transparent"}`,
							)
							.join(", ")
					} else {
						continue
					}
				}
				// Add px to numeric sizing/spacing/radius/typography tokens
				if (typeof val === "number") {
					const name = cssName
					if (
						name.includes("fontsize") ||
						name.includes("spacing") ||
						name.includes("radius") ||
						name.includes("paragraph") ||
						name.includes("letter") ||
						name.includes("size")
					) {
						val = `${val}px`
					}
				}
				vars.push({ name: cssName, value: val, type: v.type })
			} else {
				vars.push(...flattenTokens(v, currentPath, k))
			}
		}
	}
	return vars
}

function generateCss(vars, header) {
	let css = "/**\n"
	for (const line of header) css += ` * ${line}\n`
	css += " */\n\n:root {\n"
	for (const v of vars) css += `  --${v.name}: ${v.value};\n`
	css += "}\n"
	return css
}

function generateDarkCss(vars, header) {
	let css = "/**\n"
	for (const line of header) css += ` * ${line}\n`
	css += ` */\n\n`
	css += ':root[data-theme="dark"], [data-theme="dark"] {\n'
	for (const v of vars) css += `  --${v.name}: ${v.value};\n`
	css += "}\n\n"
	css += "@media (prefers-color-scheme: dark) {\n"
	css += "\t:root:not([data-theme]) {\n"
	for (const v of vars) css += `\t\t--${v.name}: ${v.value};\n`
	css += "\n\t}\n}\n"
	return css
}

// --- Primitives Processing ---

function processPrimitives(primitives) {
	const vars = []

	// Spacing: Figma pixel-based (Spacing-4 → --spacing-4: 4px)
	// + index-based for component compat (--spacing-1=4px through --spacing-6=32px)
	const spacing = primitives.Spacing || {}
	for (const [k, v] of Object.entries(spacing)) {
		if (v && typeof v === "object" && "value" in v) {
			const size = k.replace("Spacing-", "")
			vars.push({
				name: `spacing-${size}`,
				value: `${v.value}px`,
				type: v.type,
			})
		}
	}
	// Index-based spacing for component compat
	const indexSpacing = [
		["1", 4],
		["2", 8],
		["3", 12],
		["4", 16],
		["5", 24],
		["6", 32],
	]
	for (const [idx, px] of indexSpacing) {
		vars.push({ name: `spacing-${idx}`, value: `${px}px`, type: "number" })
	}

	// Border depth (from Figma Variables, not in tokens-studio.json)
	// TODO: add to Figma tokens-studio.json when needed
	// vars.push({ name: "border-depth0", value: "#ffffff", type: "color" })

	// Misc component tokens (from Figma Variables, not in tokens-studio.json)
	// TODO: add to Figma tokens-studio.json when needed
	// vars.push({ name: "text-default", value: "#22201a", type: "color" })

	// Radius: Radius-4 → --radius-4: 4px, Radius-full → --radius-full: 9999px
	const radius = primitives.Radius || {}
	for (const [k, v] of Object.entries(radius)) {
		if (v && typeof v === "object" && "value" in v) {
			const size = k.replace("Radius-", "").toLowerCase()
			vars.push({ name: `radius-${size}`, value: `${v.value}px`, type: v.type })
		}
	}

	// Typography Font Family
	const families = primitives.Typography?.Font?.Family || {}
	for (const [k, v] of Object.entries(families)) {
		if (v && typeof v === "object" && "value" in v) {
			vars.push({
				name: `font-families-${k.toLowerCase()}`,
				value: v.value,
				type: "fontFamily",
			})
		}
	}

	// Typography Font Weights
	const weights = primitives.Typography?.Font?.Weight || {}
	let weightIdx = 0
	for (const [, v] of Object.entries(weights)) {
		if (v && typeof v === "object" && "value" in v) {
			const numVal =
				{ Regular: 400, Medium: 500, SemiBold: 600, Bold: 700 }[v.value] ||
				v.value
			vars.push({
				name: `font-weights-pretendard-${weightIdx}`,
				value: numVal,
				type: "fontWeight",
			})
			weightIdx++
		}
	}

	// Font sizes: 2XS→10, XS→12, SM→14, MD→16, LG→18, XL→20, 2XL→24, 3XL→28, 4XL→32, 5XL→40, 6XL→48, 7XL→56
	const fontSizes = primitives.Typography?.Font?.Size || {}
	const sizeOrder = [
		"2XS",
		"XS",
		"SM",
		"MD",
		"LG",
		"XL",
		"2XL",
		"3XL",
		"4XL",
		"5XL",
		"6XL",
		"7XL",
	]
	let sizeIdx = 0
	for (const label of sizeOrder) {
		if (fontSizes[label] && "value" in fontSizes[label]) {
			vars.push({
				name: `font-size-${sizeIdx}`,
				value: `${fontSizes[label].value}px`,
				type: "fontSize",
			})
			sizeIdx++
		}
	}

	// Letter spacing
	const letterSpacings = primitives.Typography?.["Letter Spacing"] || {}
	const lsOrder = ["XS", "SM", "None"]
	let lsIdx = 0
	for (const label of lsOrder) {
		if (letterSpacings[label] && "value" in letterSpacings[label]) {
			vars.push({
				name: `letterspacing-${lsIdx}`,
				value: `${letterSpacings[label].value}px`,
				type: "letterSpacing",
			})
			lsIdx++
		}
	}

	// Line height
	const lineHeights = primitives.Typography?.["Line Height"] || {}
	const lhOrder = [
		"XS",
		"SM",
		"MD",
		"LG",
		"XL",
		"2XL",
		"3XL",
		"4XL",
		"5XL",
		"6XL",
	]
	let lhIdx = 0
	for (const label of lhOrder) {
		if (lineHeights[label] && "value" in lineHeights[label]) {
			vars.push({
				name: `lineheight-${lhIdx}`,
				value: `${lineHeights[label].value}px`,
				type: "lineHeight",
			})
			lhIdx++
		}
	}

	return vars
}

// --- Typography Shorthand Processing ---

function processTypographyShorthand(device, primitives) {
	const vars = []

	// Build resolved lookup from ALL tokens (primitives + device)
	const allRaw = { ...stripExtensions(primitives), ...stripExtensions(device) }
	const allLookup = buildLookup(allRaw)
	let resolved = resolveAllRefs(allRaw, allLookup)
	resolved = resolveCompositeValues(resolved, allLookup)

	// Weight name → numeric
	const weightMap = { Regular: 400, Medium: 500, SemiBold: 600, Bold: 700 }

	const categories = [
		"Display",
		"Headline",
		"Title",
		"Body",
		"Caption",
		"Label",
	]
	for (const cat of categories) {
		const group = resolved[cat]
		if (!group) continue

		for (const [styleName, styleData] of Object.entries(group)) {
			// Collect sub-properties
			let weight = null,
				size = null,
				lineHeight = null
			let hasSubProps = false

			for (const [propName, propData] of Object.entries(styleData)) {
				if (propData && typeof propData === "object" && "value" in propData) {
					hasSubProps = true
					const val = propData.value
					if (propName === "Weight") {
						weight = weightMap[val] || val
					}
					if (propName === "Size") size = val
					if (propName === "Line Height") lineHeight = val
				}
			}

			if (hasSubProps && weight && size) {
				const varName = `${cat}-${styleName}`.toLowerCase().replace(/\s+/g, "-")
				const lh = lineHeight || size
				const family = "Pretendard"
				const shorthand = `${weight} ${size}px/${lh}px "${family}"`
				vars.push({ name: varName, value: shorthand, type: "typography" })
			}
		}
	}

	return vars
}

// --- Main ---

function main() {
	console.log("🚀 Starting token build...")
	ensureDir(distDir)

	const raw = JSON.parse(
		readFileSync(join(pkgRoot, "src", "tokens-studio.json"), "utf-8"),
	)

	const rawLight = stripExtensions(raw["Color/Light"] || {})
	const rawDark = stripExtensions(raw["Color/Dark"] || {})
	const rawPrimitives = raw["Primitives/Mode 1"] || {}
	const rawDevice = raw["Device/Laptop"] || {}

	const lightLookup = buildLookup(rawLight)
	const darkLookup = buildLookup(rawDark)

	let light = resolveAllRefs(rawLight, lightLookup)
	light = resolveCompositeValues(light, lightLookup)

	let dark = resolveAllRefs(rawDark, darkLookup)
	dark = resolveCompositeValues(dark, darkLookup)

	console.log("📐 Light:", Object.keys(light).join(", "))
	console.log("📐 Dark:", Object.keys(dark).join(", "))

	const lightVars = flattenTokens(light)
	const darkVars = flattenTokens(dark)

	// Process primitives (spacing, radius, font basics)
	const primitiveVars = processPrimitives(rawPrimitives)
	console.log(`📐 Primitives: ${primitiveVars.length} tokens`)

	// Process typography shorthand from Device/Laptop
	const typoVars = processTypographyShorthand(rawDevice, rawPrimitives)
	console.log(`📐 Typography shorthand: ${typoVars.length} tokens`)

	const lightMap = new Map(lightVars.map((v) => [v.name, v.value]))
	const darkDiffVars = darkVars.filter((v) => {
		const lv = lightMap.get(v.name)
		return lv !== undefined && lv !== v.value
	})

	console.log(`🌗 ${darkDiffVars.length} tokens differ in dark mode.`)

	const header = [
		"Do not edit directly",
		`Generated on ${new Date().toUTCString()}`,
	]

	// Base: global colors + primitives (spacing, radius, font)
	const baseColorVars = lightVars.filter((v) =>
		v.name.startsWith("color-global-"),
	)
	const baseVars = [...baseColorVars, ...primitiveVars]
	writeFileSync(
		join(distDir, "tokens.base.css"),
		generateCss(baseVars, header),
		"utf-8",
	)

	// Theme light: semantic colors + typography shorthand
	const themeColorVars = lightVars.filter(
		(v) => !v.name.startsWith("color-global-"),
	)
	const themeVars = [...themeColorVars, ...typoVars]
	writeFileSync(
		join(distDir, "theme.light.css"),
		generateCss(themeVars, header),
		"utf-8",
	)

	writeFileSync(
		join(distDir, "theme.dark.css"),
		generateDarkCss(darkDiffVars, header),
		"utf-8",
	)

	writeFileSync(
		join(distDir, "theme.css"),
		`/* auto-generated */\n@import "./theme.light.css";\n@import "./theme.dark.css";\n`,
	)
	writeFileSync(
		join(distDir, "index.css"),
		`/* auto-generated */\n@import "./tokens.base.css";\n@import "./theme.css";\n`,
	)
	writeFileSync(
		join(distDir, "tokens.json"),
		JSON.stringify(light, null, 2),
		"utf-8",
	)
	writeFileSync(
		join(distDir, "tokens.d.ts"),
		`declare const tokens: Record<string, unknown>;\nexport default tokens;\n`,
	)

	console.log("🎉 Build completed successfully!")
}

main()
