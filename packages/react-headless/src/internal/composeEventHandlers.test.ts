import { describe, expect, it, vi } from "vitest"

import { composeEventHandlers } from "./composeEventHandlers"

describe("composeEventHandlers", () => {
	it("기본값에서는 defaultPrevented면 내부 핸들러를 호출하지 않는다", () => {
		const original = vi.fn((event: { defaultPrevented: boolean }) => {
			event.defaultPrevented = true
		})
		const ours = vi.fn()

		const handler = composeEventHandlers(
			original as unknown as (event: React.SyntheticEvent) => void,
			ours as unknown as (event: React.SyntheticEvent) => void,
		)

		handler({ defaultPrevented: false } as React.SyntheticEvent)
		expect(ours).not.toHaveBeenCalled()
	})

	it("checkDefaultPrevented를 false로 주면 항상 내부 핸들러를 호출한다", () => {
		const original = vi.fn((event: { defaultPrevented: boolean }) => {
			event.defaultPrevented = true
		})
		const ours = vi.fn()

		const handler = composeEventHandlers(
			original as unknown as (event: React.SyntheticEvent) => void,
			ours as unknown as (event: React.SyntheticEvent) => void,
			{ checkDefaultPrevented: false },
		)

		handler({ defaultPrevented: false } as React.SyntheticEvent)
		expect(ours).toHaveBeenCalledTimes(1)
	})
})
