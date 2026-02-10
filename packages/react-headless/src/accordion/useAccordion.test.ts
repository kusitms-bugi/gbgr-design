import { act, renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { useAccordion } from "./useAccordion"

describe("useAccordion", () => {
	it("single 모드에서 collapsible이면 같은 아이템을 다시 누를 때 닫힌다", () => {
		const { result } = renderHook(() =>
			useAccordion({ type: "single", collapsible: true }),
		)

		act(() => {
			result.current.toggleItem("item-a")
		})
		expect(result.current.value).toBe("item-a")

		act(() => {
			result.current.toggleItem("item-a")
		})
		expect(result.current.value).toBeNull()
	})

	it("disabled 상태에서는 토글해도 닫힌 상태를 유지한다", () => {
		const { result } = renderHook(() =>
			useAccordion({ type: "single", disabled: true }),
		)

		act(() => {
			result.current.toggleItem("item-a")
		})
		expect(result.current.isItemOpen("item-a")).toBe(false)
	})
})
