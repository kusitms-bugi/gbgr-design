import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

describe("ModeToggle", () => {
	it("displayName을 유지한다", () => {
		const source = readFileSync(resolve(__dirname, "./ModeToggle.tsx"), "utf8")

		expect(source).toContain('ModeToggle.displayName = "ModeToggle"')
	})

	it("헤드리스 훅과 아이콘 조합 구조를 유지한다", () => {
		const source = readFileSync(resolve(__dirname, "./ModeToggle.tsx"), "utf8")

		expect(source).toContain("useModeToggle")
		expect(source).toContain("<SunIcon />")
		expect(source).toContain("<MoonIcon />")
	})
})
