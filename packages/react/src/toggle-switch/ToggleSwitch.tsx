import * as Switch from "@radix-ui/react-switch"
import * as React from "react"
import {
	type UseToggleSwitchProps,
	useToggleSwitch,
} from "../hooks/toggle-switch/useToggleSwitch"
import { cn } from "../utils/cn"

export type ToggleSwitchSize = "long" | "short"

export type ToggleSwitchProps = Omit<
	UseToggleSwitchProps,
	"role" | "aria-checked"
> & {
	size?: ToggleSwitchSize
}

export const ToggleSwitch = React.forwardRef<
	HTMLButtonElement,
	ToggleSwitchProps
>((props, ref) => {
	const { size = "long", className, ...rest } = props

	const { rootProps } = useToggleSwitch(rest)

	return (
		<Switch.Root
			{...rootProps}
			ref={ref}
			className={cn(
				"gbgr-toggle-switch",
				`gbgr-toggle-switch--${size}`,
				className,
			)}
		>
			<Switch.Thumb className="gbgr-toggle-switch__thumb" />
		</Switch.Root>
	)
})

ToggleSwitch.displayName = "ToggleSwitch"
