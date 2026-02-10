import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

describe("ui 엔트리 export", () => {
	it("react와 icons 패키지를 재노출한다", () => {
		const source = readFileSync(resolve(__dirname, "./index.ts"), "utf8")

		expect(source).toContain('export * from "@gbgr/icons"')
		expect(source).toContain('export * from "@gbgr/react"')
	})
})
