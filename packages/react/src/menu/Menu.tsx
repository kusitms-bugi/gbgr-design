import * as React from "react"
import { cn } from "../utils/cn"

export type MenuProps = React.HTMLAttributes<HTMLDivElement> & {
	titleLabel?: string
}

export const Menu = React.forwardRef<HTMLDivElement, MenuProps>(
	(props, ref) => {
		const { titleLabel, className, children, ...rest } = props

		const hasTitle = titleLabel != null && titleLabel !== ""

		return (
			<div
				{...rest}
				ref={ref}
				role="menu"
				className={cn("gbgr-menu", className)}
			>
				{hasTitle ? (
					<div className="gbgr-menu__header">
						<span className="gbgr-menu__title">{titleLabel}</span>
					</div>
				) : null}
				<div className="gbgr-menu__list">{children}</div>
			</div>
		)
	},
)

Menu.displayName = "Menu"
