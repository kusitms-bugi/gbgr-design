import type { SidebarsConfig } from "@docusaurus/plugin-content-docs"

const sidebars: SidebarsConfig = {
	main: [
		"intro",
		{
			type: "category",
			label: "Components",
			items: [
				"components/button",
				"components/mode-toggle",
				"components/text-field",
				"components/icons",
			],
		},
		{
			type: "category",
			label: "Foundation",
			items: [
				"foundation/overview",
				{
					type: "category",
					label: "Color",
					items: ["foundation/color/overview", "foundation/color/palette"],
				},

				"foundation/typography",
				"foundation/spacing",
				"foundation/iconography",
			],
		},
	],
}

export default sidebars
