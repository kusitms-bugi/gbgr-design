import * as React from "react"
import { cn } from "../utils/cn"

export type MenuKind = "icon-text" | "text-only" | "selectable"

export type MenuItemProps = Omit<
	React.ButtonHTMLAttributes<HTMLButtonElement>,
	"style"
> & {
	kind?: MenuKind
	icon?: React.ReactNode
	selected?: boolean
}

export const MenuItem = React.forwardRef<HTMLButtonElement, MenuItemProps>(
	(props, ref) => {
		const {
			kind = "text-only",
			icon,
			selected = false,
			className,
			children,
			disabled,
			...rest
		} = props

		return (
			<button
				{...rest}
				ref={ref}
				role="menuitem"
				disabled={disabled}
				data-selected={kind === "selectable" ? String(selected) : undefined}
				className={cn("gbgr-menu-item", `gbgr-menu-item--${kind}`, className)}
			>
				<span className="gbgr-menu-item__inner">
					{kind === "icon-text" && icon ? (
						<span className="gbgr-menu-item__icon" aria-hidden="true">
							{icon}
						</span>
					) : null}
					{kind === "selectable" && (
						<span className="gbgr-menu-item__check-slot" aria-hidden="true">
							{selected ? (
								<svg
									width="20"
									height="20"
									viewBox="0 0 20 20"
									fill="none"
									role="img"
									aria-hidden="true"
								>
									<rect
										x="2"
										y="2"
										width="16"
										height="16"
										rx="4"
										fill="currentColor"
									/>
									<path
										d="M6.5 10.19L8.5 12L13.5 7.5"
										stroke="white"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							) : null}
						</span>
					)}
					<span className="gbgr-menu-item__label">{children}</span>
				</span>
			</button>
		)
	},
)

MenuItem.displayName = "MenuItem"
