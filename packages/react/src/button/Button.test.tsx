import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { Button } from "./Button"

describe("Button", () => {
	it("디버깅을 위해 displayName을 설정한다", () => {
		expect(Button.displayName).toBe("Button")
	})

	it("클릭 시 onPress를 호출한다", () => {
		const onPress = vi.fn()

		render(<Button onPress={onPress}>submit</Button>)

		fireEvent.click(screen.getByRole("button", { name: "submit" }))

		expect(onPress).toHaveBeenCalledTimes(1)
	})

	it("onClick에서 defaultPrevented 되면 onPress를 호출하지 않는다", () => {
		const onClick = vi.fn((event: React.MouseEvent<HTMLButtonElement>) => {
			event.preventDefault()
		})
		const onPress = vi.fn()

		render(
			<Button onClick={onClick} onPress={onPress}>
				submit
			</Button>,
		)

		fireEvent.click(screen.getByRole("button", { name: "submit" }))

		expect(onClick).toHaveBeenCalledTimes(1)
		expect(onPress).not.toHaveBeenCalled()
	})

	it("disabled면 클릭 동작을 막는다", () => {
		const onPress = vi.fn()

		render(
			<Button disabled onPress={onPress}>
				disabled
			</Button>,
		)

		const button = screen.getByRole("button", { name: "disabled" })
		fireEvent.click(button)

		expect((button as HTMLButtonElement).disabled).toBe(true)
		expect(onPress).not.toHaveBeenCalled()
	})

	it("loading이면 disabled와 data-loading을 반영한다", () => {
		render(<Button loading>loading</Button>)

		const button = screen.getByRole("button", { name: "loading" })

		expect((button as HTMLButtonElement).disabled).toBe(true)
		expect(button.getAttribute("data-loading")).toBe("")
	})

	it("포인터 이벤트에 따라 data-state를 반영한다", () => {
		render(<Button>state</Button>)

		const button = screen.getByRole("button", { name: "state" })

		expect(button.getAttribute("data-state")).toBeNull()

		fireEvent.pointerEnter(button)
		expect(button.getAttribute("data-state")).toBe("hovered")

		fireEvent.pointerLeave(button)
		expect(button.getAttribute("data-state")).toBeNull()
	})
})
