import { useAccordion, type AccordionType, type UseAccordionProps } from "@gbgr/react-headless"
import { MinusIcon, PlusIcon } from "@gbgr/icons"
import clsx from "clsx"
import * as React from "react"

export type AccordionProps = Omit<
	React.HTMLAttributes<HTMLDivElement>,
	"onChange" | "defaultValue"
> &
	UseAccordionProps

type AccordionContextValue = ReturnType<typeof useAccordion>

const AccordionContext = React.createContext<AccordionContextValue | null>(null)

export type AccordionHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
	size?: "lg" | "md"
}

export const AccordionHeader = React.forwardRef<HTMLDivElement, AccordionHeaderProps>(
	({ className, size = "lg", children, ...props }, ref) => {
		return (
			<div
				{...props}
				ref={ref}
				className={clsx("gbgr-accordion__header", className)}
				data-size={size}
			>
				<h2 className="gbgr-accordion__header-title">{children}</h2>
			</div>
		)
	},
)

AccordionHeader.displayName = "AccordionHeader"

function useAccordionContext() {
	const ctx = React.useContext(AccordionContext)
	if (!ctx) {
		throw new Error("Accordion components must be used within <Accordion />")
	}
	return ctx
}

type AccordionItemContextValue = {
	value: string
	disabled?: boolean
}

const AccordionItemContext = React.createContext<AccordionItemContextValue | null>(
	null,
)

function useAccordionItemContext() {
	const ctx = React.useContext(AccordionItemContext)
	if (!ctx) {
		throw new Error(
			"AccordionTrigger/AccordionContent must be used within <AccordionItem />",
		)
	}
	return ctx
}

export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
	(props, ref) => {
		const {
			type,
			value,
			defaultValue,
			onValueChange,
			collapsible,
			disabled,
			className,
			children,
			...rest
		} = props

		const accordion = useAccordion({
			type: (type ?? "single") as AccordionType,
			value,
			defaultValue,
			onValueChange,
			collapsible,
			disabled,
		})

		const allChildren = React.Children.toArray(children)
		const headerChild = allChildren.find((child) => {
			return React.isValidElement(child) && child.type === AccordionHeader
		})
		const contentChildren = allChildren.filter((child) => child !== headerChild)

		return (
			<AccordionContext.Provider value={accordion}>
				<div
					{...rest}
					ref={ref}
					className={clsx("gbgr-accordion", className)}
					data-type={accordion.type}
					data-disabled={disabled ? "" : undefined}
				>
					{headerChild}
					<div className="gbgr-accordion__set">{contentChildren}</div>
				</div>
			</AccordionContext.Provider>
		)
	},
)

Accordion.displayName = "Accordion"

export type AccordionItemProps = React.HTMLAttributes<HTMLDivElement> & {
	value: string
	disabled?: boolean
}

export const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
	(props, ref) => {
		const { value, disabled, className, children, ...rest } = props
		const accordion = useAccordionContext()

		const itemProps = accordion.getItemProps({ value, disabled }, rest)

		return (
			<AccordionItemContext.Provider value={{ value, disabled }}>
				<div
					{...itemProps}
					ref={ref}
					className={clsx("gbgr-accordion__item", className)}
				>
					{children}
				</div>
			</AccordionItemContext.Provider>
		)
	},
)

AccordionItem.displayName = "AccordionItem"

export type AccordionTriggerProps = Omit<
	React.ButtonHTMLAttributes<HTMLButtonElement>,
	"type"
> & {
	label?: React.ReactNode
}

export const AccordionTrigger = React.forwardRef<
	HTMLButtonElement,
	AccordionTriggerProps
>((props, ref) => {
	const { className, children, label = "Q", ...rest } = props
	const accordion = useAccordionContext()
	const item = useAccordionItemContext()

	const triggerProps = accordion.getTriggerProps(
		{ value: item.value, disabled: item.disabled },
		rest,
	)

	return (
		<button
			{...triggerProps}
			ref={ref}
			className={clsx("gbgr-accordion__trigger", className)}
		>
			<span className="gbgr-accordion__left">
				<span className="gbgr-accordion__label">{label}</span>
				<span className="gbgr-accordion__question">{children}</span>
			</span>
			<span className="gbgr-accordion__icons" aria-hidden="true">
				<span className="gbgr-accordion__icon gbgr-accordion__icon--open">
					<MinusIcon />
				</span>
				<span className="gbgr-accordion__icon gbgr-accordion__icon--closed">
					<PlusIcon />
				</span>
			</span>
		</button>
	)
})

AccordionTrigger.displayName = "AccordionTrigger"

export type AccordionContentProps = React.HTMLAttributes<HTMLDivElement>

export const AccordionContent = React.forwardRef<
	HTMLDivElement,
	AccordionContentProps
>((props, ref) => {
	const { className, children, ...rest } = props
	const accordion = useAccordionContext()
	const item = useAccordionItemContext()

	const contentProps = accordion.getContentProps({ value: item.value }, rest)

	return (
		<div
			{...contentProps}
			ref={ref}
			className={clsx("gbgr-accordion__content", className)}
		>
			<div className="gbgr-accordion__content-inner">{children}</div>
		</div>
	)
})

AccordionContent.displayName = "AccordionContent"
