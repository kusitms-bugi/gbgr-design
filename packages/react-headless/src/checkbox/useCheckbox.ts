import * as React from "react"

import { useButton } from "../button/useButton"
import type { DataAttributes } from "../internal/types"

export type UseCheckboxProps = Omit<
	React.ButtonHTMLAttributes<HTMLButtonElement>,
	"type" | "role" | "aria-checked"
> & {
	checked?: boolean
	defaultChecked?: boolean
	onCheckedChange?: (checked: boolean) => void
}

export function useCheckbox(props: UseCheckboxProps) {
	const {
		checked,
		defaultChecked = false,
		onCheckedChange,
		disabled,
		...buttonProps
	} = props

	const [uncontrolledChecked, setUncontrolledChecked] =
		React.useState(defaultChecked)

	const currentChecked = checked ?? uncontrolledChecked

	const setChecked = React.useCallback(
		(nextChecked: boolean) => {
			if (checked === undefined) {
				setUncontrolledChecked(nextChecked)
			}

			onCheckedChange?.(nextChecked)
		},
		[checked, onCheckedChange],
	)

	const toggleChecked = React.useCallback(() => {
		setChecked(!currentChecked)
	}, [currentChecked, setChecked])

	const {
		buttonProps: baseButtonProps,
		state,
		isDisabled,
	} = useButton({
		...buttonProps,
		disabled,
		onPress: () => {
			toggleChecked()
		},
	})

	return {
		checked: currentChecked,
		setChecked,
		toggleChecked,
		state,
		isDisabled,
		buttonProps: {
			...baseButtonProps,
			type: "button",
			role: "checkbox",
			"aria-checked": currentChecked,
			"data-checked": currentChecked ? "checked" : "unchecked",
		} as React.ButtonHTMLAttributes<HTMLButtonElement> & DataAttributes,
	}
}
