import type { Meta, StoryObj } from "@storybook/react"
import { Button } from "./Button"

const meta = {
	title: "Components/Button",
	component: Button,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		style: {
			control: "select",
			options: ["primary", "secondary", "neutral", "outline", "ghost"],
		},
		size: {
			control: "select",
			options: ["lg", "md", "sm"],
		},
		loading: { control: "boolean" },
		disabled: { control: "boolean" },
		onPress: { action: "pressed" },
	},
	args: {
		children: "버튼 라벨",
		style: "primary",
		size: "lg",
	},
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Loading: Story = {
	args: { loading: true },
}

export const Disabled: Story = {
	args: { disabled: true },
}

export const WithStartIcon: Story = {
	args: {
		startIcon: (
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				aria-hidden="true"
			>
				<path d="M12 5v14M5 12h14" />
			</svg>
		),
	},
}

export const AllVariants: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
			{(["lg", "md", "sm"] as const).map((size) => (
				<div
					key={size}
					style={{ display: "flex", gap: "12px", alignItems: "center" }}
				>
					<span style={{ width: "40px", fontSize: "12px", color: "#999" }}>
						{size}
					</span>
					{(
						["primary", "secondary", "neutral", "outline", "ghost"] as const
					).map((style) => (
						<Button key={style} style={style} size={size}>
							{style.charAt(0).toUpperCase() + style.slice(1)}
						</Button>
					))}
				</div>
			))}
		</div>
	),
}
