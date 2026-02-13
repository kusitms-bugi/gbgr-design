import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

describe("react-headless 엔트리 export", () => {
	it("모든 공개 훅 export를 유지한다", () => {
		const source = readFileSync(resolve(__dirname, "./index.ts"), "utf8")

		expect(source).toContain("export { useAccordion }")
		expect(source).toContain("export { useButton }")
		expect(source).toContain("export { useModeToggle }")
		expect(source).toContain("export { useTextField }")
	})
})
