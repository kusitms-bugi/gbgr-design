import type { StorybookConfig } from "@storybook/react-vite"

const config: StorybookConfig = {
	stories: ["../packages/react/src/**/*.stories.tsx"],
	framework: {
		name: "@storybook/react-vite",
		options: {},
	},
	sites: {
		basePath: "/gbgr-design",
	},
	viteFinal: async (config) => {
		config.resolve = config.resolve || {}
		config.resolve.dedupe = [
			...(config.resolve.dedupe || []),
			"react",
			"react-dom",
		]

		config.optimizeDeps = config.optimizeDeps || {}
		config.optimizeDeps.include = [
			...(config.optimizeDeps.include || []),
			"react",
			"react-dom",
			"react/jsx-runtime",
		]

		return config
	},
}

export default config
