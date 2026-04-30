import * as React from "react"

export type UseFilterChipProps = {
	/** Controlled selected state */
	selected?: boolean
	/** Uncontrolled initial selected state */
	defaultSelected?: boolean
	/** Callback when selected changes */
	onSelectedChange?: (selected: boolean) => void
	/** Whether the chip is disabled */
	disabled?: boolean
}

export function useFilterChip(props: UseFilterChipProps) {
	const {
		selected,
		defaultSelected = false,
		onSelectedChange,
		disabled,
		...rest
	} = props

	const [internalSelected, setInternalSelected] =
		React.useState(defaultSelected)
	const isSelected = selected ?? internalSelected

	const handleClick = React.useCallback(
		(_e: React.MouseEvent<HTMLButtonElement>) => {
			if (disabled) return
			const next = !isSelected
			setInternalSelected(next)
			onSelectedChange?.(next)
		},
		[disabled, isSelected, onSelectedChange],
	)

	const handleKeyDown = React.useCallback(
		(e: React.KeyboardEvent<HTMLButtonElement>) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault()
				if (disabled) return
				const next = !isSelected
				setInternalSelected(next)
				onSelectedChange?.(next)
			}
		},
		[disabled, isSelected, onSelectedChange],
	)

	return {
		isSelected,
		rootProps: {
			...rest,
			role: "option",
			"aria-selected": isSelected,
			disabled,
			onClick: handleClick,
			onKeyDown: handleKeyDown,
			"data-selected": isSelected ? "selected" : "unselected",
		} as React.ButtonHTMLAttributes<HTMLButtonElement> & {
			"data-selected": string
		},
	}
}
