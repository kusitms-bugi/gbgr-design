import type { Meta, StoryObj } from "@storybook/react"
import { FilterChip } from "./FilterChip"

const meta = {
	title: "Components/FilterChip",
	component: FilterChip,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		selected: { control: "boolean" },
		disabled: { control: "boolean" },
		onSelectedChange: { action: "selectedChange" },
	},
	args: {
		children: "칩 라벨",
	},
} satisfies Meta<typeof FilterChip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Selected: Story = {
	args: { selected: true },
}

export const Disabled: Story = {
	args: { disabled: true },
}

export const DisabledSelected: Story = {
	args: { disabled: true, selected: true },
}

export const AllVariants: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
			<div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
				<span style={{ width: "80px", fontSize: "12px", color: "#999" }}>
					Unselected
				</span>
				<FilterChip>칩 라벨</FilterChip>
				<FilterChip disabled>Disabled</FilterChip>
			</div>
			<div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
				<span style={{ width: "80px", fontSize: "12px", color: "#999" }}>
					Selected
				</span>
				<FilterChip selected>칩 라벨</FilterChip>
				<FilterChip selected disabled>
					Disabled
				</FilterChip>
			</div>
		</div>
	),
}
