import * as React from "react"
import {
	type ButtonPressEvent as HeadlessButtonPressEvent,
	useButton,
} from "../hooks/button/useButton"

import { cn } from "../utils/cn"

export type ButtonStyle =
	| "primary"
	| "secondary"
	| "neutral"
	| "outline"
	| "ghost"
export type ButtonSize = "sm" | "md" | "lg"

export type ButtonProps = Omit<
	React.ButtonHTMLAttributes<HTMLButtonElement>,
	"type"
> & {
	style?: ButtonStyle
	size?: ButtonSize
	loading?: boolean
	type?: "button" | "submit" | "reset"
	onPress?: (event: HeadlessButtonPressEvent) => void
	startIcon?: React.ReactNode
	endIcon?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(props, ref) => {
		const {
			style = "primary",
			size = "md",
			loading = false,
			className,
			type = "button",
			onPress,
			startIcon,
			endIcon,
			children,
			disabled,
			...rest
		} = props

		const { buttonProps } = useButton({
			...rest,
			type,
			onPress,
			disabled: disabled || loading,
			loading,
		})

		return (
			<button
				{...buttonProps}
				ref={ref}
				className={cn(
					"gbgr-button",
					`gbgr-button--size-${size}`,
					`gbgr-button--style-${style}`,
					className,
				)}
			>
				{startIcon ? (
					<span className="gbgr-button__icon">{startIcon}</span>
				) : null}
				<span className="gbgr-button__label">{children}</span>
				{endIcon ? <span className="gbgr-button__icon">{endIcon}</span> : null}
				{loading && (
					<span className="gbgr-button__loader" aria-hidden="true">
						<span className="gbgr-button__loader-dot" />
						<span className="gbgr-button__loader-dot" />
						<span className="gbgr-button__loader-dot" />
					</span>
				)}
			</button>
		)
	},
)

Button.displayName = "Button"
