import {
	type ButtonPressEvent as HeadlessButtonPressEvent,
	useButton,
} from "@gbgr/react-headless"
import clsx from "clsx"
import * as React from "react"

export type ButtonTone = "primary" | "sub" | "grey"
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl"

export type ButtonPressEvent = HeadlessButtonPressEvent

export type ButtonProps = Omit<
	React.ButtonHTMLAttributes<HTMLButtonElement>,
	"type"
> & {
	tone?: ButtonTone
	size?: ButtonSize
	loading?: boolean
	type?: "button" | "submit" | "reset"
	onPress?: (event: ButtonPressEvent) => void
	startIcon?: React.ReactNode
	endIcon?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(props, ref) => {
		const {
			tone = "primary",
			size = "md",
			className,
			type = "button",
			onPress,
			startIcon,
			endIcon,
			children,
			...rest
		} = props

		const { buttonProps } = useButton({
			...rest,
			type,
			onPress,
		})

		return (
			<button
				{...buttonProps}
				ref={ref}
				className={clsx(
					"gbgr-button",
					size === "xs"
						? "gbgr-button--size-xs"
						: size === "sm"
							? "gbgr-button--size-sm"
							: size === "md"
								? "gbgr-button--size-md"
								: size === "lg"
									? "gbgr-button--size-lg"
									: "gbgr-button--size-xl",
					tone === "primary"
						? "gbgr-button--tone-primary"
						: tone === "sub"
							? "gbgr-button--tone-sub"
							: "gbgr-button--tone-grey",
					className,
				)}
			>
				{startIcon ? (
					<span className="gbgr-button__icon">{startIcon}</span>
				) : null}
				{children}
				{endIcon ? <span className="gbgr-button__icon">{endIcon}</span> : null}
			</button>
		)
	},
)

Button.displayName = "Button"
