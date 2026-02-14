import { useCheckbox } from "@gbgr/react-headless"
import clsx from "clsx"
import * as React from "react"

export type CheckboxProps = Omit<
	React.ButtonHTMLAttributes<HTMLButtonElement>,
	"type" | "role" | "aria-checked"
> & {
	checked?: boolean
	defaultChecked?: boolean
	onCheckedChange?: (checked: boolean) => void
}

export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
	(props, ref) => {
		const {
			checked,
			defaultChecked,
			onCheckedChange,
			className,
			children,
			...rest
		} = props

		const { buttonProps } = useCheckbox({
			...rest,
			checked,
			defaultChecked,
			onCheckedChange,
		})

		return (
			<button
				{...buttonProps}
				ref={ref}
				className={clsx("gbgr-checkbox", className)}
			>
				<span className="gbgr-checkbox__control" aria-hidden="true">
					<svg
						className="gbgr-checkbox__mark"
						viewBox="0 0 10.5 7.5"
						fill="none"
						aria-hidden="true"
					>
						<path
							d="M1 3.69061L4 6.5L9.5 1"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</span>
				{children ? (
					<span className="gbgr-checkbox__label">{children}</span>
				) : null}
			</button>
		)
	},
)

Checkbox.displayName = "Checkbox"
