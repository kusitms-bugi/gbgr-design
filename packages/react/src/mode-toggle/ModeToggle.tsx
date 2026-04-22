import { MoonIcon, SunIcon } from "@gbgr/icons"
import { useModeToggle } from "@gbgr/react-headless"
import clsx from "clsx"
import * as React from "react"

export type ModeToggleValue = "light" | "dark"

export type ModeToggleProps = Omit<
	React.ButtonHTMLAttributes<HTMLButtonElement>,
	"type"
> & {
	value?: ModeToggleValue
	defaultValue?: ModeToggleValue
	onValueChange?: (value: ModeToggleValue) => void
}

export const ModeToggle = React.forwardRef<HTMLButtonElement, ModeToggleProps>(
	(props, ref) => {
		const { className, ...rest } = props

		const { buttonProps } = useModeToggle(rest)

		return (
			<button
				{...buttonProps}
				ref={ref}
				className={clsx("gbgr-mode-toggle", className)}
			>
				<span className="gbgr-mode-toggle__thumb" aria-hidden="true" />
				<span
					className={clsx(
						"gbgr-mode-toggle__icon",
						"gbgr-mode-toggle__icon--light",
					)}
				>
					<SunIcon />
				</span>
				<span
					className={clsx(
						"gbgr-mode-toggle__icon",
						"gbgr-mode-toggle__icon--dark",
					)}
				>
					<MoonIcon />
				</span>
			</button>
		)
	},
)

ModeToggle.displayName = "ModeToggle"
