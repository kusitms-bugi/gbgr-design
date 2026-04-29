import type { Preview } from "@storybook/react"
import "../packages/css/src/index.css"
import "../packages/react/src/button/button.css"

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
	},
}

export default preview
