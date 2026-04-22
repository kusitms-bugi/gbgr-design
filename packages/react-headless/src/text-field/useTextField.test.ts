import { act, renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { useTextField } from "./useTextField"

describe("useTextField", () => {
	it("password 타입은 기본적으로 inputType이 password다", () => {
		const { result } = renderHook(() => useTextField({ type: "password" }))

		expect(result.current.isPassword).toBe(true)
		expect(result.current.isPasswordVisible).toBe(false)
		expect(result.current.inputType).toBe("password")
	})

	it("togglePasswordVisible 호출 시 가시성이 전환된다", () => {
		const { result } = renderHook(() => useTextField({ type: "password" }))

		act(() => {
			result.current.togglePasswordVisible()
		})
		expect(result.current.inputType).toBe("text")

		act(() => {
			result.current.togglePasswordVisible()
		})
		expect(result.current.inputType).toBe("password")
	})

	it("disabled이면 비밀번호 가시성 토글을 막는다", () => {
		const onPasswordVisibleChange = vi.fn()
		const { result } = renderHook(() =>
			useTextField({
				type: "password",
				disabled: true,
				onPasswordVisibleChange,
			}),
		)

		act(() => {
			result.current.togglePasswordVisible()
		})

		expect(result.current.isPasswordVisible).toBe(false)
		expect(onPasswordVisibleChange).not.toHaveBeenCalled()
	})

	it("password가 아닌 타입은 토글해도 타입이 바뀌지 않는다", () => {
		const { result } = renderHook(() => useTextField({ type: "email" }))

		act(() => {
			result.current.togglePasswordVisible()
		})

		expect(result.current.isPassword).toBe(false)
		expect(result.current.inputType).toBe("email")
	})
})
