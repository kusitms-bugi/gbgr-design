import { act, renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { useModeToggle } from "./useModeToggle"

describe("useModeToggle", () => {
	it("기본값 light에서 toggleValue 호출 시 dark로 바뀐다", () => {
		const { result } = renderHook(() =>
			useModeToggle({ defaultValue: "light" }),
		)

		expect(result.current.value).toBe("light")

		act(() => {
			result.current.toggleValue()
		})

		expect(result.current.value).toBe("dark")
		expect(result.current.buttonProps["aria-checked"]).toBe(true)
	})

	it("onClick으로 값이 토글되고 onValueChange가 호출된다", () => {
		const onValueChange = vi.fn()
		const { result } = renderHook(() => useModeToggle({ onValueChange }))

		const event = {
			defaultPrevented: false,
			preventDefault: vi.fn(),
			stopPropagation: vi.fn(),
		} as unknown as React.MouseEvent<HTMLButtonElement>

		act(() => {
			result.current.buttonProps.onClick?.(event)
		})

		expect(onValueChange).toHaveBeenCalledWith("dark")
	})

	it("disabled면 클릭 토글을 막는다", () => {
		const onValueChange = vi.fn()
		const { result } = renderHook(() =>
			useModeToggle({ disabled: true, onValueChange }),
		)

		const event = {
			defaultPrevented: false,
			preventDefault: vi.fn(),
			stopPropagation: vi.fn(),
		} as unknown as React.MouseEvent<HTMLButtonElement>

		act(() => {
			result.current.buttonProps.onClick?.(event)
		})

		expect(onValueChange).not.toHaveBeenCalled()
		expect(event.preventDefault).toHaveBeenCalledTimes(1)
		expect(event.stopPropagation).toHaveBeenCalledTimes(1)
	})
})
