import * as React from "react"
import type { DataAttributes } from "../../internal/types"
import { useButton } from "../button/useButton"

export type UseRadioProps = Omit<
	React.ButtonHTMLAttributes<HTMLButtonElement>,
	"type" | "role" | "aria-checked"
> & {
	checked?: boolean
	defaultChecked?: boolean
	onCheckedChange?: (checked: boolean) => void
}

export function useRadio(props: UseRadioProps) {
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

	const {
		buttonProps: baseButtonProps,
		state,
		isDisabled,
	} = useButton({
		...buttonProps,
		disabled,
		onPress: () => {
			setChecked(!currentChecked)
		},
	})

	return {
		checked: currentChecked,
		setChecked,
		state,
		isDisabled,
		buttonProps: {
			...baseButtonProps,
			type: "button",
			role: "radio",
			"aria-checked": currentChecked,
			"data-checked": currentChecked ? "checked" : "unchecked",
		} as React.ButtonHTMLAttributes<HTMLButtonElement> & DataAttributes,
	}
}
