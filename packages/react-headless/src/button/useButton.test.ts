import { act, renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { useButton } from "./useButton"

describe("useButton", () => {
	it("포인터 이벤트에 따라 상태가 전환된다", () => {
		const { result } = renderHook(() => useButton({}))

		act(() => {
			result.current.events.pointerEnter()
		})
		expect(result.current.state).toBe("hovered")

		act(() => {
			result.current.events.pointerDown(1)
		})
		expect(result.current.state).toBe("pressed")

		act(() => {
			result.current.events.pointerUp(1, true)
		})
		expect(result.current.state).toBe("hovered")

		act(() => {
			result.current.events.pointerLeave()
		})
		expect(result.current.state).toBe("idle")
	})

	it("클릭 시 onPress를 호출한다", () => {
		const onPress = vi.fn()
		const { result } = renderHook(() => useButton({ onPress }))

		const event = {
			defaultPrevented: false,
			preventDefault: vi.fn(),
			stopPropagation: vi.fn(),
		} as unknown as React.MouseEvent<HTMLButtonElement>

		act(() => {
			result.current.buttonProps.onClick?.(event)
		})

		expect(onPress).toHaveBeenCalledTimes(1)
	})

	it("disabled이면 클릭을 막고 이벤트를 중단한다", () => {
		const onPress = vi.fn()
		const { result } = renderHook(() => useButton({ disabled: true, onPress }))

		const event = {
			defaultPrevented: false,
			preventDefault: vi.fn(),
			stopPropagation: vi.fn(),
		} as unknown as React.MouseEvent<HTMLButtonElement>

		act(() => {
			result.current.buttonProps.onClick?.(event)
		})

		expect(onPress).not.toHaveBeenCalled()
		expect(event.preventDefault).toHaveBeenCalledTimes(1)
		expect(event.stopPropagation).toHaveBeenCalledTimes(1)
		expect(result.current.state).toBe("disabled")
	})
})
