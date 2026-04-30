import type * as Switch from "@radix-ui/react-switch"
import * as React from "react"
import type { DataAttributes } from "../../internal/types"

export type UseToggleSwitchProps = Omit<
	React.ButtonHTMLAttributes<HTMLButtonElement>,
	"type" | "role" | "aria-checked"
> & {
	checked?: boolean
	defaultChecked?: boolean
	onCheckedChange?: (checked: boolean) => void
}

export function useToggleSwitch(props: UseToggleSwitchProps) {
	const {
		checked,
		defaultChecked = false,
		onCheckedChange,
		disabled,
		...rest
	} = props

	const handleCheckedChange = React.useCallback(
		(nextChecked: boolean) => {
			onCheckedChange?.(nextChecked)
		},
		[onCheckedChange],
	)

	return {
		checked,
		disabled,
		onCheckedChange: handleCheckedChange,
		rootProps: {
			...rest,
			defaultChecked,
			checked,
			onCheckedChange: handleCheckedChange,
			disabled,
			"data-checked": checked ? "checked" : "unchecked",
		} as Switch.SwitchProps & DataAttributes,
	}
}
