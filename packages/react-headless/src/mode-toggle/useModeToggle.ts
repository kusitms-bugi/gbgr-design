import * as React from "react"

import { composeEventHandlers } from "../internal/composeEventHandlers"
import type { DataAttributes } from "../internal/types"

export type ModeToggleValue = "light" | "dark"

export type UseModeToggleProps = Omit<
	React.ButtonHTMLAttributes<HTMLButtonElement>,
	"type" | "role" | "aria-checked"
> & {
	value?: ModeToggleValue
	defaultValue?: ModeToggleValue
	onValueChange?: (value: ModeToggleValue) => void
}

export function useModeToggle(props: UseModeToggleProps) {
	const {
		value,
		defaultValue = "light",
		onValueChange,
		disabled,
		onClick,
		...buttonProps
	} = props

	const [uncontrolledValue, setUncontrolledValue] =
		React.useState<ModeToggleValue>(defaultValue)

	const currentValue = value ?? uncontrolledValue

	const setValue = React.useCallback(
		(nextValue: ModeToggleValue) => {
			if (value === undefined) {
				setUncontrolledValue(nextValue)
			}
			onValueChange?.(nextValue)
		},
		[value, onValueChange],
	)

	const toggleValue = React.useCallback(() => {
		const next = currentValue === "light" ? "dark" : "light"
		setValue(next)
	}, [currentValue, setValue])

	const handleClickInternal = React.useCallback(
		(event: React.MouseEvent<HTMLButtonElement>) => {
			if (disabled) {
				event.preventDefault()
				event.stopPropagation()
				return
			}
			toggleValue()
		},
		[disabled, toggleValue],
	)

	return {
		value: currentValue,
		setValue,
		toggleValue,
		buttonProps: {
			...buttonProps,
			type: "button",
			role: "switch",
			"aria-checked": currentValue === "dark",
			disabled,
			"data-value": currentValue,
			onClick: composeEventHandlers(onClick, handleClickInternal),
		} as React.ButtonHTMLAttributes<HTMLButtonElement> & DataAttributes,
	}
}

