import { act, renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { useCheckbox } from "./useCheckbox"

describe("useCheckbox", () => {
	it("기본적으로 unchecked 상태에서 클릭 시 checked로 전환된다", () => {
		const onCheckedChange = vi.fn()
		const { result } = renderHook(() => useCheckbox({ onCheckedChange }))

		expect(result.current.checked).toBe(false)
		expect(result.current.buttonProps["aria-checked"]).toBe(false)

		const event = {
			defaultPrevented: false,
			preventDefault: vi.fn(),
			stopPropagation: vi.fn(),
		} as unknown as React.MouseEvent<HTMLButtonElement>

		act(() => {
			result.current.buttonProps.onClick?.(event)
		})

		expect(result.current.checked).toBe(true)
		expect(result.current.buttonProps["aria-checked"]).toBe(true)
		expect(onCheckedChange).toHaveBeenCalledWith(true)
	})

	it("controlled 모드에서는 내부 상태를 직접 변경하지 않는다", () => {
		const onCheckedChange = vi.fn()
		const { result, rerender } = renderHook(
			({ checked }) => useCheckbox({ checked, onCheckedChange }),
			{ initialProps: { checked: false } },
		)

		const event = {
			defaultPrevented: false,
			preventDefault: vi.fn(),
			stopPropagation: vi.fn(),
		} as unknown as React.MouseEvent<HTMLButtonElement>

		act(() => {
			result.current.buttonProps.onClick?.(event)
		})

		expect(onCheckedChange).toHaveBeenCalledWith(true)
		expect(result.current.checked).toBe(false)

		rerender({ checked: true })
		expect(result.current.checked).toBe(true)
	})

	it("disabled면 체크 상태를 토글하지 않는다", () => {
		const onCheckedChange = vi.fn()
		const { result } = renderHook(() =>
			useCheckbox({ disabled: true, defaultChecked: false, onCheckedChange }),
		)

		const event = {
			defaultPrevented: false,
			preventDefault: vi.fn(),
			stopPropagation: vi.fn(),
		} as unknown as React.MouseEvent<HTMLButtonElement>

		act(() => {
			result.current.buttonProps.onClick?.(event)
		})

		expect(result.current.checked).toBe(false)
		expect(onCheckedChange).not.toHaveBeenCalled()
	})
})
