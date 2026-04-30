import * as React from "react"
import { type UseRadioProps, useRadio } from "../hooks/radio/useRadio"
import { cn } from "../utils/cn"

export type RadioStyle = "fill" | "outline"

export type RadioProps = Omit<UseRadioProps, "role" | "aria-checked"> & {
	style?: RadioStyle
}

export const Radio = React.forwardRef<HTMLButtonElement, RadioProps>(
	(props, ref) => {
		const { style = "fill", className, children, ...rest } = props

		const { buttonProps } = useRadio(rest)

		return (
			<button
				{...buttonProps}
				ref={ref}
				className={cn("gbgr-radio", `gbgr-radio--${style}`, className)}
			>
				<span className="gbgr-radio__control" aria-hidden="true">
					<svg
						width="20"
						height="20"
						viewBox="0 0 20 20"
						fill="none"
						className="gbgr-radio__svg"
						role="img"
						aria-hidden="true"
					>
						<defs>
							<clipPath id="gbgr-radio-clip">
								<circle cx="10" cy="10" r="8" />
							</clipPath>
						</defs>
						{/* Base circle (unselected / fill-selected) */}
						<circle cx="10" cy="10" r="8" className="gbgr-radio__circle" />
						{/* Dot for fill-selected */}
						<circle cx="10" cy="10" r="3" className="gbgr-radio__dot" />
						{/* Outline-selected: even-odd path with two cutouts */}
						<path
							d="M10 2C14.4183 2 18 5.58172 18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2ZM10 3.5C6.41015 3.5 3.5 6.41015 3.5 10C3.5 13.5899 6.41015 16.5 10 16.5C13.5899 16.5 16.5 13.5899 16.5 10C16.5 6.41015 13.5899 3.5 10 3.5ZM10 6C12.2091 6 14 7.79086 14 10C14 12.2091 12.2091 14 10 14C7.79086 14 6 12.2091 6 10C6 7.79086 7.79086 6 10 6Z"
							fillRule="evenodd"
							className="gbgr-radio__outline-dot"
						/>
						{/* Hover overlay: clipped to circle shape */}
						<g
							clipPath="url(#gbgr-radio-clip)"
							className="gbgr-radio__hover-overlay"
						>
							<rect
								x="2"
								y="2"
								width="16"
								height="16"
								className="gbgr-radio__hover-rect"
							/>
						</g>
					</svg>
				</span>
				{children ? (
					<span className="gbgr-radio__label">{children}</span>
				) : null}
			</button>
		)
	},
)

Radio.displayName = "Radio"
