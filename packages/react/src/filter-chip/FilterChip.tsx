import * as React from "react"
import {
	type UseFilterChipProps,
	useFilterChip,
} from "../hooks/filter-chip/useFilterChip"
import { cn } from "../utils/cn"

export type FilterChipProps = Omit<
	UseFilterChipProps,
	"role" | "aria-selected"
> & {
	children?: React.ReactNode
	className?: string
}

export const FilterChip = React.forwardRef<HTMLButtonElement, FilterChipProps>(
	(props, ref) => {
		const { children, className, ...rest } = props
		const { rootProps } = useFilterChip(rest)

		return (
			<button
				{...rootProps}
				ref={ref}
				className={cn("gbgr-filter-chip", className)}
			>
				<span className="gbgr-filter-chip__label">{children}</span>
			</button>
		)
	},
)

FilterChip.displayName = "FilterChip"
