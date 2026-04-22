import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

describe("TextField", () => {
	it("displayName을 유지한다", () => {
		const source = readFileSync(resolve(__dirname, "./TextField.tsx"), "utf8")

		expect(source).toContain('TextField.displayName = "TextField"')
	})

	it("비밀번호 토글 접근성 라벨과 상태 분기 구조를 유지한다", () => {
		const source = readFileSync(resolve(__dirname, "./TextField.tsx"), "utf8")

		expect(source).toContain("Hide password")
		expect(source).toContain("Show password")
		expect(source).toContain('state === "success"')
		expect(source).toContain('state === "error"')
	})
})
