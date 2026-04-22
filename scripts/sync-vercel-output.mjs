import { existsSync } from "node:fs"
import { cp, mkdir, rm } from "node:fs/promises"
import path from "node:path"

const src = path.join(process.cwd(), "apps", "docs", "dist")
const dest = path.join(process.cwd(), "dist")

if (!existsSync(src)) {
	console.log(`[sync-vercel-output] skip: ${src} not found`)
	process.exit(0)
}

await rm(dest, { recursive: true, force: true })
await mkdir(dest, { recursive: true })
await cp(src, dest, { recursive: true })

console.log(`[sync-vercel-output] copied ${src} -> ${dest}`)
