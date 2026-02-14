import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

describe("ui 엔트리 export", () => {
	it("react와 icons 패키지를 재노출한다", () => {
		const source = readFileSync(resolve(__dirname, "./index.ts"), "utf8")

		expect(source).toContain('export * from "@gbgr/icons"')
		expect(source).toContain('export * from "@gbgr/react"')
	})

	it("문서 샘플의 @gbgr/ui import 경로를 유지한다", () => {
		const pkg = JSON.parse(
			readFileSync(resolve(__dirname, "../package.json"), "utf8"),
		) as { exports?: Record<string, unknown> }

		expect(pkg.exports).toMatchObject({
			".": expect.any(Object),
			"./styles.css": "./src/styles.css",
		})
	})
})
