import type * as Preset from "@docusaurus/preset-classic"
import type { Config } from "@docusaurus/types"
import { themes } from "prism-react-renderer"

const config: Config = {
	title: "GBGR Design",
	tagline: "Design system documentation",
	favicon: "img/favicon.svg",

	url: "https://example.com",
	baseUrl: "/",

	onBrokenLinks: "throw",
	markdown: {
		hooks: {
			onBrokenMarkdownLinks: "warn",
		},
	},

	i18n: {
		defaultLocale: "en",
		locales: ["en"],
	},

	presets: [
		[
			"classic",
			{
				docs: {
					routeBasePath: "/docs",
					sidebarPath: "./sidebars.ts",
					editUrl: undefined,
				},
				blog: false,
				theme: {
					customCss: "./src/css/custom.css",
				},
			} satisfies Preset.Options,
		],
	],

	themeConfig: {
		navbar: {
			title: "GBGR Design",
			items: [
				{
					type: "docSidebar",
					sidebarId: "main",
					position: "left",
					label: "Docs",
				},
			],
		},
		footer: {
			style: "dark",
			copyright: `Copyright © ${new Date().getFullYear()} GBGR`,
		},
		prism: {
			theme: themes.github,
			darkTheme: themes.dracula,
		},
	} satisfies Preset.ThemeConfig,
}

export default config
