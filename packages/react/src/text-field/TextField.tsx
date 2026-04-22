import { HideIcon, InfoCircleIcon, ShowIcon } from "@gbgr/icons"
import { useTextField } from "@gbgr/react-headless"
import clsx from "clsx"
import * as React from "react"

export type TextFieldState = "default" | "success" | "error"

export type TextFieldProps = Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	"size"
> & {
	state?: TextFieldState
	subText?: string
	subIcon?: React.ReactNode
	endAdornment?: React.ReactNode
	passwordVisible?: boolean
	defaultPasswordVisible?: boolean
	onPasswordVisibleChange?: (visible: boolean) => void
}

function SuccessIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
			<circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
			<path
				d="M8.5 12.3 11 14.7 15.7 9.8"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
	(props, ref) => {
		const {
			state = "default",
			subText,
			subIcon,
			endAdornment,
			passwordVisible,
			defaultPasswordVisible,
			onPasswordVisibleChange,
			className,
			type = "text",
			disabled,
			...rest
		} = props

		const { isPassword, isPasswordVisible, inputType, togglePasswordVisible } =
			useTextField({
				type,
				disabled,
				passwordVisible,
				defaultPasswordVisible,
				onPasswordVisibleChange,
			})

		const resolvedEndAdornment = React.useMemo(() => {
			if (endAdornment) return endAdornment
			if (!isPassword) return null

			return (
				<button
					type="button"
					className="gbgr-text-field__button"
					onClick={togglePasswordVisible}
					aria-label={isPasswordVisible ? "Hide password" : "Show password"}
					disabled={disabled}
				>
					{isPasswordVisible ? <HideIcon /> : <ShowIcon />}
				</button>
			)
		}, [
			endAdornment,
			isPassword,
			isPasswordVisible,
			togglePasswordVisible,
			disabled,
		])

		const resolvedSubIcon =
			subIcon ??
			(state === "success" ? (
				<SuccessIcon />
			) : state === "error" ? (
				<InfoCircleIcon />
			) : null)

		return (
			<div className={clsx("gbgr-text-field", className)} data-state={state}>
				<div className="gbgr-text-field__control">
					<input
						{...rest}
						ref={ref}
						type={inputType}
						disabled={disabled}
						className="gbgr-text-field__input"
					/>
					{resolvedEndAdornment ? (
						<span className="gbgr-text-field__end">{resolvedEndAdornment}</span>
					) : null}
				</div>
				{subText ? (
					<div className="gbgr-text-field__sub">
						{resolvedSubIcon ? (
							<span className="gbgr-text-field__sub-icon" aria-hidden="true">
								{resolvedSubIcon}
							</span>
						) : null}
						<span>{subText}</span>
					</div>
				) : null}
			</div>
		)
	},
)

TextField.displayName = "TextField"
