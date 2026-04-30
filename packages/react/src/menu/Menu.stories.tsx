import type { Meta, StoryObj } from "@storybook/react"
import { Menu } from "./Menu"
import { MenuItem } from "./MenuItem"

const meta = {
	title: "Components/Menu",
	component: Menu,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		titleLabel: { control: "text" },
	},
	args: {
		titleLabel: "타이틀",
	},
} satisfies Meta<typeof Menu>

export default meta
type Story = StoryObj<typeof meta>

export const IconWithText: Story = {
	render: (args) => (
		<Menu {...args}>
			<MenuItem kind="icon-text" icon={<PlaceholderIcon />}>
				메뉴 아이템
			</MenuItem>
			<MenuItem kind="icon-text" icon={<PlaceholderIcon />}>
				메뉴 아이템
			</MenuItem>
			<MenuItem kind="icon-text" icon={<PlaceholderIcon />}>
				메뉴 아이템
			</MenuItem>
			<MenuItem kind="icon-text" icon={<PlaceholderIcon />}>
				메뉴 아이템
			</MenuItem>
			<MenuItem kind="icon-text" icon={<PlaceholderIcon />}>
				메뉴 아이템
			</MenuItem>
		</Menu>
	),
}

export const TextOnly: Story = {
	render: (args) => (
		<Menu {...args}>
			<MenuItem kind="text-only">메뉴 아이템</MenuItem>
			<MenuItem kind="text-only">메뉴 아이템</MenuItem>
			<MenuItem kind="text-only">메뉴 아이템</MenuItem>
			<MenuItem kind="text-only">메뉴 아이템</MenuItem>
			<MenuItem kind="text-only">메뉴 아이템</MenuItem>
		</Menu>
	),
}

export const Selectable: Story = {
	render: (args) => (
		<Menu {...args}>
			<MenuItem kind="selectable" selected>
				메뉴 아이템
			</MenuItem>
			<MenuItem kind="selectable">메뉴 아이템</MenuItem>
			<MenuItem kind="selectable">메뉴 아이템</MenuItem>
			<MenuItem kind="selectable">메뉴 아이템</MenuItem>
			<MenuItem kind="selectable">메뉴 아이템</MenuItem>
		</Menu>
	),
}

export const WithoutTitle: Story = {
	args: { titleLabel: undefined },
	render: (args) => (
		<Menu {...args}>
			<MenuItem kind="text-only">메뉴 아이템</MenuItem>
			<MenuItem kind="text-only">메뉴 아이템</MenuItem>
			<MenuItem kind="text-only">메뉴 아이템</MenuItem>
		</Menu>
	),
}

export const AllVariants: Story = {
	render: () => (
		<div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
			<Menu titleLabel="Icon + Text">
				<MenuItem kind="icon-text" icon={<PlaceholderIcon />}>
					메뉴 아이템
				</MenuItem>
				<MenuItem kind="icon-text" icon={<PlaceholderIcon />}>
					메뉴 아이템
				</MenuItem>
				<MenuItem kind="icon-text" icon={<PlaceholderIcon />} disabled>
					메뉴 아이템
				</MenuItem>
			</Menu>
			<Menu titleLabel="Text Only">
				<MenuItem kind="text-only">메뉴 아이템</MenuItem>
				<MenuItem kind="text-only">메뉴 아이템</MenuItem>
				<MenuItem kind="text-only" disabled>
					메뉴 아이템
				</MenuItem>
			</Menu>
			<Menu titleLabel="Selectable">
				<MenuItem kind="selectable" selected>
					메뉴 아이템
				</MenuItem>
				<MenuItem kind="selectable">메뉴 아이템</MenuItem>
				<MenuItem kind="selectable" disabled>
					메뉴 아이템
				</MenuItem>
			</Menu>
		</div>
	),
}

/** Placeholder icon matching Figma's "Outline/Default" 15×15 icon */
function PlaceholderIcon() {
	return (
		<svg
			width="15"
			height="15"
			viewBox="0 0 15 15"
			fill="none"
			role="img"
			aria-hidden="true"
		>
			<rect
				x="0.5"
				y="0.5"
				width="14"
				height="14"
				rx="3"
				stroke="currentColor"
				strokeWidth="1"
			/>
		</svg>
	)
}
