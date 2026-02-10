import useIsBrowser from "@docusaurus/useIsBrowser"
import { ModeToggle } from "@gbgr/react"
import clsx from "clsx"
import type React from "react"

type ColorModeChoice = "light" | "dark" | null

export type Props = {
	className?: string
	buttonClassName?: string
	respectPrefersColorScheme: boolean
	value: ColorModeChoice
	onChange: (value: ColorModeChoice) => void
}

export default function ColorModeToggle(props: Props): React.ReactNode {
	const isBrowser = useIsBrowser()

	// Note: Docusaurus supports 3-state switching (light/dark/system(null)).
	// GBGR ModeToggle is 2-state, so we map "system" to the resolved current theme.
	const resolvedValue: "light" | "dark" =
		props.value === null
			? isBrowser &&
				props.respectPrefersColorScheme &&
				window.matchMedia?.("(prefers-color-scheme: dark)")?.matches
				? "dark"
				: "light"
			: props.value

	return (
		<div className={clsx(props.className)}>
			<ModeToggle
				value={resolvedValue}
				onValueChange={(next) => props.onChange(next)}
				disabled={!isBrowser}
				className={props.buttonClassName}
				aria-label="Toggle color mode"
			/>
		</div>
	)
}
