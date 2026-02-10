import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

describe("react 엔트리 export", () => {
	it("주요 컴포넌트 export를 유지한다", () => {
		const source = readFileSync(resolve(__dirname, "./index.ts"), "utf8")

		expect(source).toContain("Accordion,\n\tAccordionContent")
		expect(source).toContain('export { Button }')
		expect(source).toContain('export { ModeToggle }')
		expect(source).toContain('export { TextField }')
	})
})
