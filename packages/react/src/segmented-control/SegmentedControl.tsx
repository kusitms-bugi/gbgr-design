import * as React from "react"
import { useSegmentedControl } from "../hooks/segmented-control/useSegmentedControl"

import { cn } from "../utils/cn"

export type SegmentedControlStyle = "brand" | "default"
export type SegmentedControlSize = "lg" | "sm"

export type SegmentedControlProps = Omit<
	React.HTMLAttributes<HTMLDivElement>,
	"role"
> & {
	segments: string[]
	value?: number
	defaultValue?: number
	onValueChange?: (index: number) => void
	style?: SegmentedControlStyle
	size?: SegmentedControlSize
	disabled?: boolean
}

export const SegmentedControl = React.forwardRef<
	HTMLDivElement,
	SegmentedControlProps
>((props, ref) => {
	const {
		segments,
		value,
		defaultValue,
		onValueChange,
		style = "brand",
		size = "lg",
		disabled = false,
		className,
		...rest
	} = props

	const {
		value: activeIndex,
		getRootProps,
		getSegmentProps,
	} = useSegmentedControl({
		count: segments.length,
		value,
		defaultValue,
		onValueChange,
		disabled,
	})

	const rootProps = getRootProps()

	return (
		<div
			{...rootProps}
			{...rest}
			ref={ref}
			aria-disabled={disabled || undefined}
			className={cn(
				"gbgr-segmented-control",
				`gbgr-segmented-control--style-${style}`,
				`gbgr-segmented-control--size-${size}`,
				className,
			)}
		>
			{segments.map((label, index) => {
				const isActive = index === activeIndex
				const prevActive = index - 1 === activeIndex
				const showDivider = index > 0 && !isActive && !prevActive
				return (
					// biome-ignore lint/suspicious/noArrayIndexKey: segments are static labels, order never changes
					<React.Fragment key={index}>
						{showDivider && (
							<span
								className="gbgr-segmented-control__divider"
								aria-hidden="true"
							/>
						)}
						<button
							{...getSegmentProps(index)}
							className="gbgr-segmented-control__segment"
							type="button"
						>
							{label}
						</button>
					</React.Fragment>
				)
			})}
		</div>
	)
})

SegmentedControl.displayName = "SegmentedControl"
