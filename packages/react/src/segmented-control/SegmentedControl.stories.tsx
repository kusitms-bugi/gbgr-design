import type { Meta, StoryObj } from "@storybook/react"
import { SegmentedControl } from "./SegmentedControl"

const meta = {
	title: "Components/SegmentedControl",
	component: SegmentedControl,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		style: {
			control: "select",
			options: ["brand", "default"],
		},
		size: {
			control: "select",
			options: ["lg", "sm"],
		},
		onValueChange: { action: "valueChange" },
	},
	args: {
		segments: ["선택", "리스트", "리스트", "리스트"],
		style: "brand",
		size: "lg",
	},
} satisfies Meta<typeof SegmentedControl>

export default meta
type Story = StoryObj<typeof meta>

export const BrandLg: Story = {
	args: { style: "brand", size: "lg" },
}

export const BrandSm: Story = {
	args: { style: "brand", size: "sm" },
}

export const DefaultLg: Story = {
	args: { style: "default", size: "lg" },
}

export const DefaultSm: Story = {
	args: { style: "default", size: "sm" },
}

export const AllVariants: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
			<div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
				<span style={{ width: "60px", fontSize: "12px", color: "#999" }}>
					Brand lg
				</span>
				<SegmentedControl
					segments={["선택", "리스트", "리스트", "리스트"]}
					style="brand"
					size="lg"
				/>
			</div>
			<div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
				<span style={{ width: "60px", fontSize: "12px", color: "#999" }}>
					Brand sm
				</span>
				<SegmentedControl
					segments={["선택", "리스트", "리스트", "리스트"]}
					style="brand"
					size="sm"
				/>
			</div>
			<div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
				<span style={{ width: "60px", fontSize: "12px", color: "#999" }}>
					Default lg
				</span>
				<SegmentedControl
					segments={["선택", "리스트", "리스트", "리스트"]}
					style="default"
					size="lg"
				/>
			</div>
			<div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
				<span style={{ width: "60px", fontSize: "12px", color: "#999" }}>
					Default sm
				</span>
				<SegmentedControl
					segments={["선택", "리스트", "리스트", "리스트"]}
					style="default"
					size="sm"
				/>
			</div>
		</div>
	),
}
