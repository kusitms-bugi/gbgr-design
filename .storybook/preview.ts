import type { Preview } from "@storybook/react"
import "../packages/tokens/dist/index.css"
import "../packages/react/src/styles.css"
import "../packages/react/src/button/button.css"
import "../packages/react/src/segmented-control/segmented-control.css"
import "../packages/react/src/toggle-switch/toggle-switch.css"
import "../packages/react/src/checkbox/checkbox.css"
import "../packages/react/src/radio/radio.css"
import "../packages/react/src/accordion/accordion.css"
import "../packages/react/src/mode-toggle/mode-toggle.css"
import "../packages/react/src/text-field/text-field.css"
import "../packages/react/src/filter-chip/filter-chip.css"
import "../packages/react/src/menu/menu.css"

function applyTheme(theme: string) {
	if (theme === "dark") {
		document.documentElement.setAttribute("data-theme", "dark")
	} else {
		document.documentElement.removeAttribute("data-theme")
	}
}

const preview: Preview = {
	parameters: {
		backgrounds: {
			disable: true,
		},
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
	},
	initialGlobals: {
		theme: "light",
	},
	globalTypes: {
		theme: {
			name: "Theme",
			description: "Global theme for components",
			defaultValue: "light",
			toolbar: {
				title: "Theme",
				icon: "circlehollow",
				items: [
					{ value: "light", icon: "sun", title: "Light" },
					{ value: "dark", icon: "moon", title: "Dark" },
				],
				dynamicTitle: true,
			},
		},
	},
	decorators: [
		(Story, context) => {
			applyTheme(context.globals.theme)
			return Story()
		},
	],
}

// Set Storybook canvas background to match theme
const style = document.createElement("style")
style.textContent = `
  .sb-show-main, .sb-main-padded {
    background: var(--color-semantic-surface-fill-base, #f4f4f4) !important;
    transition: background-color 200ms ease;
  }
  [data-theme="dark"] .sb-show-main,
  [data-theme="dark"] .sb-main-padded {
    background: var(--color-semantic-surface-fill-base, #1a1a1a) !important;
  }
`
document.head.appendChild(style)

export default preview
