import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

import { Button } from "./Button"

describe("Button", () => {
	it("디버깅을 위해 displayName을 설정한다", () => {
		expect(Button.displayName).toBe("Button")
	})

	it("onPress 호출 전에 defaultPrevented 가드를 유지한다", () => {
		const source = readFileSync(resolve(__dirname, "./Button.tsx"), "utf8")

		expect(source).toContain("if (!event.defaultPrevented)")
		expect(source).toContain("onPress?.(event)")
	})
})
