import * as React from "react"

export interface UseSegmentedControlProps {
	/** Number of segments */
	count: number
	value?: number
	defaultValue?: number
	onValueChange?: (index: number) => void
	disabled?: boolean
}

export function useSegmentedControl(props: UseSegmentedControlProps) {
	const {
		count,
		value: controlledValue,
		defaultValue = 0,
		onValueChange,
		disabled = false,
	} = props

	const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
	const currentValue = controlledValue ?? uncontrolledValue

	const setValue = React.useCallback(
		(nextValue: number) => {
			if (disabled) return
			if (nextValue < 0 || nextValue >= count) return
			if (controlledValue === undefined) {
				setUncontrolledValue(nextValue)
			}
			onValueChange?.(nextValue)
		},
		[controlledValue, onValueChange, disabled, count],
	)

	const handleKeyDown = React.useCallback(
		(e: React.KeyboardEvent) => {
			if (disabled) return
			if (e.key === "ArrowRight" || e.key === "ArrowDown") {
				e.preventDefault()
				setValue((currentValue + 1) % count)
			} else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
				e.preventDefault()
				setValue((currentValue - 1 + count) % count)
			} else if (e.key === "Home") {
				e.preventDefault()
				setValue(0)
			} else if (e.key === "End") {
				e.preventDefault()
				setValue(count - 1)
			}
		},
		[disabled, currentValue, count, setValue],
	)

	const getRootProps = React.useCallback(
		() => ({
			role: "tablist" as const,
			onKeyDown: disabled ? undefined : handleKeyDown,
		}),
		[disabled, handleKeyDown],
	)

	const getSegmentProps = React.useCallback(
		(index: number) => {
			const isActive = index === currentValue
			return {
				role: "tab" as const,
				"aria-selected": isActive,
				tabIndex: isActive ? 0 : -1,
				"data-active": isActive ? "" : undefined,
				onClick: disabled ? undefined : () => setValue(index),
			}
		},
		[currentValue, disabled, setValue],
	)

	return {
		value: currentValue,
		setValue,
		getRootProps,
		getSegmentProps,
	}
}
