import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

describe("Accordion", () => {
	it("필수 컴포넌트의 displayName을 노출한다", () => {
		const source = readFileSync(resolve(__dirname, "./Accordion.tsx"), "utf8")

		expect(source).toContain('Accordion.displayName = "Accordion"')
		expect(source).toContain('AccordionHeader.displayName = "AccordionHeader"')
		expect(source).toContain('AccordionItem.displayName = "AccordionItem"')
		expect(source).toContain(
			'AccordionTrigger.displayName = "AccordionTrigger"',
		)
		expect(source).toContain(
			'AccordionContent.displayName = "AccordionContent"',
		)
	})

	it("헤더와 콘텐츠를 분리하는 구조를 유지한다", () => {
		const source = readFileSync(resolve(__dirname, "./Accordion.tsx"), "utf8")

		expect(source).toContain("child.type === AccordionHeader")
		expect(source).toContain("gbgr-accordion__set")
	})
})
