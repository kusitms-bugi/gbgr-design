import type { Meta, StoryObj } from "@storybook/react"
import { ToggleSwitch } from "./ToggleSwitch"

const meta = {
	title: "Components/ToggleSwitch",
	component: ToggleSwitch,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		size: {
			control: "select",
			options: ["long", "short"],
		},
		checked: { control: "boolean" },
		disabled: { control: "boolean" },
		onCheckedChange: { action: "checkedChange" },
	},
	args: {
		size: "long",
	},
} satisfies Meta<typeof ToggleSwitch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Short: Story = {
	args: { size: "short" },
}

export const Checked: Story = {
	args: { checked: true },
}

export const ShortChecked: Story = {
	args: { size: "short", checked: true },
}

export const Disabled: Story = {
	args: { disabled: true },
}

export const DisabledChecked: Story = {
	args: { disabled: true, checked: true },
}

export const AllVariants: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
			{(["long", "short"] as const).map((size) => (
				<div
					key={size}
					style={{ display: "flex", gap: "12px", alignItems: "center" }}
				>
					<span style={{ width: "50px", fontSize: "12px", color: "#999" }}>
						{size}
					</span>
					<ToggleSwitch size={size} />
					<ToggleSwitch size={size} checked />
					<ToggleSwitch size={size} disabled />
					<ToggleSwitch size={size} disabled checked />
				</div>
			))}
		</div>
	),
}
