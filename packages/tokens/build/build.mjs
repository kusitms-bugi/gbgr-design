#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import StyleDictionary from "style-dictionary"

const __dirname = dirname(fileURLToPath(import.meta.url))
const pkgRoot = join(__dirname, "..")
const distDir = join(pkgRoot, "dist")

// --- Helper Functions ---

function ensureDir(dir) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
}

function isTokenLeaf(v) {
	return (
		v &&
		typeof v === "object" &&
		!Array.isArray(v) &&
		"value" in v &&
		"type" in v
	)
}

function deepMerge(target, source) {
	for (const [k, v] of Object.entries(source ?? {})) {
		if (v && typeof v === "object" && !Array.isArray(v)) {
			if (!target[k] || typeof target[k] !== "object") target[k] = {}
			deepMerge(target[k], v)
		} else {
			target[k] = v
		}
	}
	return target
}

function isValidIdentifier(key) {
	return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key)
}

function tokenLeafTsType(leaf) {
	const valueType = typeof leaf?.value === "number" ? "number" : "string"
	const tokenType =
		typeof leaf?.type === "string" ? JSON.stringify(leaf.type) : "string"
	return `TokenLeaf<${valueType}, ${tokenType}>`
}

function toTsType(node, indentLevel = 0) {
	if (isTokenLeaf(node)) return tokenLeafTsType(node)
	if (!node || typeof node !== "object" || Array.isArray(node)) return "unknown"

	const indent = "\t".repeat(indentLevel)
	const nextIndent = "\t".repeat(indentLevel + 1)

	const entries = Object.entries(node)
	if (entries.length === 0) return "Record<string, unknown>"

	const lines = entries.map(([key, value]) => {
		const prop = isValidIdentifier(key) ? key : JSON.stringify(key)
		return `${nextIndent}${prop}: ${toTsType(value, indentLevel + 1)};`
	})

	return `{\n${lines.join("\n")}\n${indent}}`
}

// --- Custom Transforms ---

// Transform font weight strings to numbers
StyleDictionary.registerTransform({
  name: "gbgr/fontWeight",
  type: "value",
  matcher: (token) => token.type === 'text' && token.path[0] === 'fontWeights',
  transformer: (token) => {
    const weights = {
      Bold: 700,
      SemiBold: 600,
      Medium: 500,
      Regular: 400,
    }
    return weights[token.value] ?? token.value
  },
})

// Transform number tokens to px values
StyleDictionary.registerTransform({
  name: "gbgr/px",
  type: "value",
  matcher: (token) =>
    (typeof token.value === 'number') &&
    (token.type === 'number') && // Explicitly check for type number
    (['radius', 'spacing', 'device mode', 'fontSize'].includes(token.path[0])), // Check top-level category
  transformer: (token) => `${token.value}px`,
})

// --- Custom Formats ---

StyleDictionary.registerFileHeader({
  name: "gbgr/fileHeader",
  fileHeader: () => [
    "Do not edit directly",
    `Generated on ${new Date().toUTCString()}`,
  ],
});

// Format for dark theme overrides
StyleDictionary.registerFormat({
  name: "css/dark-theme-override",
  formatter: function ({ dictionary, file }) {
    let output = StyleDictionary.formatHelpers.fileHeader({ file })
    const vars = StyleDictionary.formatHelpers.formattedVariables({
      format: "css",
      dictionary,
    })

    // 1) Explicit app theme toggle (`data-theme="dark"`) on either <html> (:root) or <body> (or any container).
    output += ':root[data-theme="dark"], [data-theme="dark"] {\n'
    output += vars
    output += "\n}\n\n"

    // 2) Automatic dark mode when the app doesn't set `data-theme` at all.
    //    Keeps explicit `data-theme="light"` (or any custom value) from being overridden.
    output += "@media (prefers-color-scheme: dark) {\n"
    output += "\t:root:not([data-theme]) {\n"
    output += vars
    output += "\n\t}\n"
    output += "}\n"
    return output
  },
})

// --- Main Build Logic ---

async function main() {
  console.log("🚀 Starting token build process...")
  ensureDir(distDir)

  // 1. Load and prepare token data
  console.log("🔄 Loading and parsing tokens-studio.json...")
  const tokensPath = join(pkgRoot, "src", "tokens-studio.json")
  const tokens = JSON.parse(readFileSync(tokensPath, "utf-8"))

  const tokenSets = {
    global: tokens["global/global"] || {},
    light: tokens["Primitives/light"] || {},
    dark: tokens["Primitives/dark"] || {},
  }
  
  // Create a unified source for Style Dictionary by merging themes.
  // Style-dictionary needs a single object. We will select the active set later.
  const source = deepMerge(deepMerge({}, tokenSets.light), tokenSets.global);

	// 1.1 Emit JSON + TypeScript outputs for consumers/validation
	writeFileSync(
		join(distDir, "sd.input.json"),
		JSON.stringify(source, null, 2),
		"utf-8",
	)

	writeFileSync(
		join(distDir, "tokens.json"),
		JSON.stringify(source, null, 2),
		"utf-8",
	)

	const tokensDts = `export type TokenLeaf<TValue = string | number, TType extends string = string> = {
\tvalue: TValue;
\ttype: TType;
\t[key: string]: unknown;
};

export type Tokens = ${toTsType(source, 0)};

declare const tokens: Tokens;
export default tokens;
`

	writeFileSync(join(distDir, "tokens.d.ts"), tokensDts, "utf-8")

  // 2. Find differences between light and dark themes
  console.log("🌗 Comparing light and dark themes...")
  const createExportableSd = (tokens) => StyleDictionary.extend({
    tokens,
    platforms: {
      "json-export": {
        transformGroup: "js",
        buildPath: "dist/", // This path is not actually used, but is required
        files: [{ destination: "dummy.json", format: "json/nested" }]
      }
    }
  });

  const lightSd = createExportableSd(tokenSets.light);
  const darkSd = createExportableSd(tokenSets.dark);

  const lightProps = lightSd.exportPlatform("json-export")
  const darkProps = darkSd.exportPlatform("json-export")

  const changedTokenNames = new Set()
  function findDiffs(light, dark, path = []) {
    for (const key in light) {
      const currentPath = [...path, key]
      if (dark[key] === undefined) continue
      
      if (typeof light[key] === 'object' && light[key] !== null) {
        if ("value" in light[key] && "value" in dark[key]) {
          if (light[key].value !== dark[key].value) {
            changedTokenNames.add(currentPath.join("-"))
          }
        } else {
          findDiffs(light[key], dark[key], currentPath)
        }
      }
    }
  }

  findDiffs(lightProps, darkProps)
  console.log(`Found ${changedTokenNames.size} differences for dark theme.`)

  // 3. Configure and run Style Dictionary
  const sd = StyleDictionary.extend({
    // We pass 'source' here, which is the merged light+global tokens
    tokens: source, 
    
    // We'll also pass the raw dark tokens so we can access them in the platform config
    darkTokens: tokenSets.dark,

    platforms: {
      // --- Platform: tokens.base.css ---
      base: {
        transformGroup: "css",
        transforms: ["attribute/cti", "name/cti/kebab", "gbgr/fontWeight", "gbgr/px", "color/css"],
        buildPath: `${distDir}/`,
        files: [
          {
            destination: "tokens.base.css",
            format: "css/variables",
            filter: (token) => {
              const path = token.path.join(".")
              return (
                path.startsWith("color.global") ||
                path.startsWith("font") || // fontFamilies, fontWeights, fontSize
                path.startsWith("radius") ||
                path.startsWith("spacing") ||
                path.startsWith("device mode")
              )
            },
            options: {
              fileHeader: "gbgr/fileHeader",
            },
          },
        ],
      },

      // --- Platform: theme.light.css ---
      light: {
        transformGroup: "css",
        buildPath: `${distDir}/`,
        files: [
          {
            destination: "theme.light.css",
            format: "css/variables",
            filter: (token) => {
              const path = token.path.join(".")
              return (
                !path.startsWith("color.global") &&
                !path.startsWith("font") &&
                !path.startsWith("radius") &&
                !path.startsWith("spacing") &&
                !path.startsWith("device mode")
              )
            },
            options: {
              fileHeader: "gbgr/fileHeader",
            },
          },
        ],
      },
      
      // --- Platform: theme.dark.css (override-only) ---
      dark: {
        // Use the dark tokens for this platform
        tokens: tokenSets.dark,
        transformGroup: "css",
        buildPath: `${distDir}/`,
        files: [
          {
            destination: "theme.dark.css",
            format: "css/dark-theme-override",
            // Filter to only include tokens that were different from light theme
            filter: (token) => changedTokenNames.has(token.name),
            options: {
              fileHeader: "gbgr/fileHeader",
            },
          },
        ],
      },
    },
  })

  console.log("🏗️ Building tokens with Style Dictionary...")
  sd.buildAllPlatforms()
  console.log("✅ Style Dictionary build complete.")

  // 4. Create entrypoint CSS files
  console.log("✍️ Creating entrypoint CSS files...")

  const themeCssContent = `/* This file is auto-generated. */
@import "./theme.light.css";
@import "./theme.dark.css";
`
  writeFileSync(join(distDir, "theme.css"), themeCssContent)

  const indexCssContent = `/* This file is auto-generated. */
/* Consider adding a CSS reset here if needed */
@import "./tokens.base.css";
@import "./theme.css";
`
  writeFileSync(join(distDir, "index.css"), indexCssContent)

  console.log("✅ Entrypoint files created: theme.css, index.css")
  console.log("🎉 Build completed successfully!")
}

main().catch((e) => {
  console.error("❌ Build failed:", e)
  process.exit(1)
})
