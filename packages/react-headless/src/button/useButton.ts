import * as React from "react"
import { composeEventHandlers } from "../internal/composeEventHandlers"
import type { DataAttributes } from "../internal/types"

export type ButtonPressEvent = React.MouseEvent | React.KeyboardEvent

type InteractionState = "idle" | "hovered" | "pressed" | "disabled" | "loading"

export type UseButtonProps = Omit<
	React.ButtonHTMLAttributes<HTMLButtonElement>,
	"disabled" | "type"
> & {
	disabled?: boolean
	loading?: boolean
	type?: "button" | "submit" | "reset"
	onPress?: (event: ButtonPressEvent) => void
}

function isPointInRect(clientX: number, clientY: number, rect: DOMRect) {
	return (
		clientX >= rect.left &&
		clientX <= rect.right &&
		clientY >= rect.top &&
		clientY <= rect.bottom
	)
}

type MachineEvent =
	| { type: "POINTER_ENTER" }
	| { type: "POINTER_LEAVE" }
	| { type: "POINTER_DOWN"; pointerId: number }
	| { type: "POINTER_UP"; pointerId: number; isInside: boolean }
	| { type: "POINTER_CANCEL" }

export function useButton(props: UseButtonProps) {
	const {
		disabled = false,
		loading = false,
		type = "button",
		onPress,
		onClick,
		onPointerEnter,
		onPointerLeave,
		onPointerDown,
		onPointerUp,
		onPointerCancel,
		...buttonProps
	} = props

	const isDisabled = disabled || loading

	const [internalState, setInternalState] = React.useState<
		"idle" | "hovered" | "pressed"
	>("idle")

	const isPressedRef = React.useRef(false)

	React.useEffect(() => {
		if (isDisabled) {
			isPressedRef.current = false
			setInternalState("idle")
		}
	}, [isDisabled])

	const interactionState: InteractionState = disabled
		? "disabled"
		: loading
			? "loading"
			: internalState

	const send = React.useCallback(
		(event: MachineEvent) => {
			if (isDisabled) return

			setInternalState((prev) => {
				switch (event.type) {
					case "POINTER_ENTER": {
						if (isPressedRef.current) return prev
						return "hovered"
					}
					case "POINTER_LEAVE": {
						if (isPressedRef.current) return prev
						return "idle"
					}
					case "POINTER_DOWN": {
						isPressedRef.current = true
						return "pressed"
					}
					case "POINTER_UP": {
						isPressedRef.current = false
						return event.isInside ? "hovered" : "idle"
					}
					case "POINTER_CANCEL": {
						isPressedRef.current = false
						return "idle"
					}
					default: {
						return prev
					}
				}
			})
		},
		[isDisabled],
	)

	const events = React.useMemo(
		() => ({
			pointerEnter: () => send({ type: "POINTER_ENTER" }),
			pointerLeave: () => send({ type: "POINTER_LEAVE" }),
			pointerDown: (pointerId: number) =>
				send({ type: "POINTER_DOWN", pointerId }),
			pointerUp: (pointerId: number, isInside: boolean) =>
				send({ type: "POINTER_UP", pointerId, isInside }),
			pointerCancel: () => send({ type: "POINTER_CANCEL" }),
		}),
		[send],
	)

	const handlePointerEnterInternal = React.useCallback(() => {
		events.pointerEnter()
	}, [events])

	const handlePointerLeaveInternal = React.useCallback(() => {
		events.pointerLeave()
	}, [events])

	const handlePointerDownInternal = React.useCallback(
		(event: React.PointerEvent<HTMLButtonElement>) => {
			if (isDisabled) return
			if (event.button !== 0) return

			events.pointerDown(event.pointerId)

			try {
				event.currentTarget.setPointerCapture(event.pointerId)
			} catch {
				// ignore
			}
		},
		[events, isDisabled],
	)

	const handlePointerUpInternal = React.useCallback(
		(event: React.PointerEvent<HTMLButtonElement>) => {
			if (isDisabled) return

			const rect = event.currentTarget.getBoundingClientRect()
			const isInside = isPointInRect(event.clientX, event.clientY, rect)
			events.pointerUp(event.pointerId, isInside)

			try {
				event.currentTarget.releasePointerCapture(event.pointerId)
			} catch {
				// ignore
			}
		},
		[events, isDisabled],
	)

	const handlePointerCancelInternal = React.useCallback(() => {
		events.pointerCancel()
	}, [events])

	const handleClick = React.useCallback(
		(event: React.MouseEvent<HTMLButtonElement>) => {
			if (isDisabled) {
				event.preventDefault()
				event.stopPropagation()
				return
			}
			onPress?.(event)
		},
		[isDisabled, onPress],
	)

	return {
		state: interactionState,
		isDisabled,
		isLoading: loading,
		events,
		buttonProps: {
			...buttonProps,
			type,
			disabled: isDisabled,
			"aria-disabled": isDisabled ? true : undefined,
			"data-state": interactionState === "idle" ? undefined : interactionState,
			"data-disabled": disabled ? "" : undefined,
			"data-loading": loading ? "" : undefined,
			onClick: composeEventHandlers(onClick, handleClick),
			onPointerEnter: composeEventHandlers(
				onPointerEnter,
				handlePointerEnterInternal,
			),
			onPointerLeave: composeEventHandlers(
				onPointerLeave,
				handlePointerLeaveInternal,
			),
			onPointerDown: composeEventHandlers(
				onPointerDown,
				handlePointerDownInternal,
			),
			onPointerUp: composeEventHandlers(onPointerUp, handlePointerUpInternal),
			onPointerCancel: composeEventHandlers(
				onPointerCancel,
				handlePointerCancelInternal,
			),
		} as React.ButtonHTMLAttributes<HTMLButtonElement> & DataAttributes,
	}
}
