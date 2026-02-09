import type React from "react"
import { tokensBase } from "../../generated/tokensBase"
import styles from "./ColorPalette.module.css"

type GlobalColorToken = {
	variable: string
	shade: string
	value: string
}

function getGlobalPalette(paletteName: string): GlobalColorToken[] {
	const prefix = `color-global-${paletteName}-`
	const items = tokensBase
		.filter((t) => t.name.startsWith(prefix))
		.map((t) => ({
			variable: `--${t.name}`,
			shade: t.name.slice(prefix.length),
			value: t.value,
		}))

	items.sort((a, b) => {
		const na = Number(a.shade)
		const nb = Number(b.shade)
		if (Number.isNaN(na) || Number.isNaN(nb))
			return a.shade.localeCompare(b.shade)
		return na - nb
	})

	return items
}

async function copyText(text: string) {
	try {
		await navigator.clipboard.writeText(text)
	} catch {
		// no-op
	}
}

export function ColorPalette(props: {
	palette: string
	title?: string
}): React.JSX.Element {
	const tokens = getGlobalPalette(props.palette)
	return (
		<section>
			<h2>{props.title ?? props.palette}</h2>
			<div className={styles.paletteGrid}>
				{tokens.map((t) => (
					<div key={t.variable} className={styles.swatchCard}>
						<div className={styles.swatch} style={{ background: t.value }} />
						<div className={styles.meta}>
							<div className={styles.nameRow}>
								<span className={styles.tokenName}>
									{props.palette} {t.shade}
								</span>
								<button
									type="button"
									className={styles.copyButton}
									onClick={() => copyText(t.variable)}
									title="Copy CSS variable name"
								>
									Copy var
								</button>
							</div>
							<div className={styles.valueRow}>
								<span className={styles.value}>{t.value}</span>
								<button
									type="button"
									className={styles.copyButton}
									onClick={() => copyText(t.value)}
									title="Copy color value"
								>
									Copy
								</button>
							</div>
							<div className={styles.tokenName}>{t.variable}</div>
						</div>
					</div>
				))}
			</div>
		</section>
	)
}
