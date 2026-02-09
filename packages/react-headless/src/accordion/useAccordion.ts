import * as React from "react"

import { composeEventHandlers } from "../internal/composeEventHandlers"
import type { DataAttributes } from "../internal/types"

export type AccordionType = "single" | "multiple"

type AccordionSingleValue = string | null
type AccordionMultipleValue = string[]

export type UseAccordionProps = {
	type?: AccordionType
	value?: AccordionSingleValue | AccordionMultipleValue
	defaultValue?: AccordionSingleValue | AccordionMultipleValue
	onValueChange?: (value: AccordionSingleValue | AccordionMultipleValue) => void
	/**
	 * Only applies to `type="single"`.
	 * - `true`: clicking an open item can close it (value becomes `null`)
	 * - `false`: at least one item stays open once opened
	 */
	collapsible?: boolean
	disabled?: boolean
}

type GetItemOptions = {
	value: string
	disabled?: boolean
}

type GetTriggerOptions = Omit<GetItemOptions, "disabled"> & {
	disabled?: boolean
}

function toIdSegment(value: string) {
	return encodeURIComponent(value).replace(/%/g, "_")
}

export function useAccordion(props: UseAccordionProps) {
	const {
		type = "single",
		value,
		defaultValue,
		onValueChange,
		collapsible = false,
		disabled = false,
	} = props

	const baseId = React.useId()

	const [uncontrolledSingle, setUncontrolledSingle] =
		React.useState<AccordionSingleValue>(
			typeof defaultValue === "string" ? defaultValue : null,
		)

	const [uncontrolledMultiple, setUncontrolledMultiple] = React.useState<
		AccordionMultipleValue
	>(Array.isArray(defaultValue) ? defaultValue : [])

	const currentValue =
		value ??
		(type === "multiple" ? uncontrolledMultiple : uncontrolledSingle)

	const setValue = React.useCallback(
		(next: AccordionSingleValue | AccordionMultipleValue) => {
			if (value === undefined) {
				if (type === "multiple") {
					setUncontrolledMultiple(Array.isArray(next) ? next : [])
				} else {
					setUncontrolledSingle(typeof next === "string" ? next : null)
				}
			}
			onValueChange?.(next)
		},
		[type, value, onValueChange],
	)

	const isItemOpen = React.useCallback(
		(itemValue: string) => {
			if (type === "multiple") {
				return Array.isArray(currentValue) && currentValue.includes(itemValue)
			}
			return currentValue === itemValue
		},
		[type, currentValue],
	)

	const setItemOpen = React.useCallback(
		(itemValue: string, nextOpen: boolean) => {
			if (disabled) return

			if (type === "multiple") {
				const prev = Array.isArray(currentValue) ? currentValue : []
				const next = nextOpen
					? prev.includes(itemValue)
						? prev
						: [...prev, itemValue]
					: prev.filter((v) => v !== itemValue)
				setValue(next)
				return
			}

			if (nextOpen) {
				setValue(itemValue)
				return
			}

			if (collapsible) {
				setValue(null)
			}
		},
		[type, currentValue, setValue, disabled, collapsible],
	)

	const toggleItem = React.useCallback(
		(itemValue: string) => {
			setItemOpen(itemValue, !isItemOpen(itemValue))
		},
		[isItemOpen, setItemOpen],
	)

	const getItemIds = React.useCallback(
		(itemValue: string) => {
			const seg = toIdSegment(itemValue)
			return {
				triggerId: `${baseId}-accordion-trigger-${seg}`,
				contentId: `${baseId}-accordion-content-${seg}`,
			}
		},
		[baseId],
	)

	const getItemState = React.useCallback(
		(itemValue: string, itemDisabled?: boolean) => {
			const open = isItemOpen(itemValue)
			const itemIsDisabled = disabled || itemDisabled
			return { open, itemIsDisabled }
		},
		[disabled, isItemOpen],
	)

	const getItemProps = React.useCallback(
		(options: GetItemOptions, props?: React.HTMLAttributes<HTMLDivElement>) => {
			const { value: itemValue, disabled: itemDisabled } = options
			const { open, itemIsDisabled } = getItemState(itemValue, itemDisabled)
			return {
				...props,
				"data-state": open ? "open" : "closed",
				"data-disabled": itemIsDisabled ? "" : undefined,
			} as React.HTMLAttributes<HTMLDivElement> & DataAttributes
		},
		[getItemState],
	)

	const getTriggerProps = React.useCallback(
		(
			options: GetTriggerOptions,
			props?: React.ButtonHTMLAttributes<HTMLButtonElement>,
		) => {
			const { value: itemValue, disabled: itemDisabled } = options
			const ids = getItemIds(itemValue)
			const { open, itemIsDisabled } = getItemState(itemValue, itemDisabled)

			const handleClickInternal = (event: React.MouseEvent<HTMLButtonElement>) => {
				if (itemIsDisabled) {
					event.preventDefault()
					event.stopPropagation()
					return
				}
				toggleItem(itemValue)
			}

			return {
				...props,
				id: props?.id ?? ids.triggerId,
				type: "button",
				disabled: itemIsDisabled,
				"aria-expanded": open,
				"aria-controls": ids.contentId,
				"data-state": open ? "open" : "closed",
				"data-disabled": itemIsDisabled ? "" : undefined,
				onClick: composeEventHandlers(props?.onClick, handleClickInternal),
			} as React.ButtonHTMLAttributes<HTMLButtonElement> & DataAttributes
		},
		[getItemIds, getItemState, toggleItem],
	)

	const getContentProps = React.useCallback(
		(
			options: Pick<GetItemOptions, "value">,
			props?: React.HTMLAttributes<HTMLDivElement>,
		) => {
			const { value: itemValue } = options
			const ids = getItemIds(itemValue)
			const open = isItemOpen(itemValue)

			return {
				...props,
				id: props?.id ?? ids.contentId,
				role: "region",
				"aria-labelledby": ids.triggerId,
				"data-state": open ? "open" : "closed",
				"data-hidden": open ? undefined : "",
				hidden: open ? undefined : true,
				"aria-hidden": open ? undefined : true,
			} as React.HTMLAttributes<HTMLDivElement> & DataAttributes
		},
		[getItemIds, isItemOpen],
	)

	return {
		type,
		value: currentValue,
		disabled,
		isItemOpen,
		setItemOpen,
		toggleItem,
		getItemProps,
		getTriggerProps,
		getContentProps,
	}
}
