import type { Meta, StoryObj } from "@storybook/react"
import { Radio } from "./Radio"

const meta = {
	title: "Components/Radio",
	component: Radio,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		style: {
			control: "select",
			options: ["fill", "outline"],
		},
		checked: { control: "boolean" },
		disabled: { control: "boolean" },
		onCheckedChange: { action: "checkedChange" },
	},
	args: {
		style: "fill",
	},
} satisfies Meta<typeof Radio>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Checked: Story = {
	args: { checked: true },
}

export const Outline: Story = {
	args: { style: "outline" },
}

export const OutlineChecked: Story = {
	args: { style: "outline", checked: true },
}

export const Disabled: Story = {
	args: { disabled: true },
}

export const DisabledChecked: Story = {
	args: { disabled: true, checked: true },
}

export const WithLabel: Story = {
	args: { children: "라벨 텍스트" },
}

export const AllVariants: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
			{(["fill", "outline"] as const).map((style) => (
				<div
					key={style}
					style={{ display: "flex", gap: "12px", alignItems: "center" }}
				>
					<span style={{ width: "60px", fontSize: "12px", color: "#999" }}>
						{style}
					</span>
					<Radio style={style} />
					<Radio style={style} checked />
					<Radio style={style} disabled />
					<Radio style={style} disabled checked />
				</div>
			))}
		</div>
	),
}
