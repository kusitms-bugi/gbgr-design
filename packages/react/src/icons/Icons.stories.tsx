import {
	AlarmClockIcon,
	AlertHexagonIcon,
	AnnouncementIcon,
	AutoRunIcon,
	BellIcon,
	CalendarDateIcon,
	CalibrationIcon,
	CameraGraphicIcon,
	ClockIcon,
	CloseIcon,
	DashboardIcon,
	DefaultIcon,
	EmailGraphicIcon,
	ErrorTipOffIcon,
	FrameIcon,
	HideIcon,
	HourglassIcon,
	InfoCircleIcon,
	KeyIcon,
	LanguageIcon,
	LayoutTopIcon,
	LinkExternalIcon,
	MdiAppleIcon,
	MdiMicrosoftWindowsIcon,
	MinusIcon,
	MoonIcon,
	PencilLineIcon,
	PlanIcon,
	PlusIcon,
	SettingIcon,
	ShieldTickIcon,
	ShowIcon,
	SidebarDarkLIcon,
	SidebarDarkLSolidIcon,
	SidebarDarkRIcon,
	SidebarDarkRSolidIcon,
	SidebarLightLSolidIcon,
	SidebarLightRSolidIcon,
	SidetapIcon,
	SunIcon,
	ThemeAutomaticIcon,
	ThemeIcon,
	ThemeLightGraphicIcon,
	ThumbsUpIcon,
	WidgetIcon,
} from "@gbgr/icons"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
	title: "Foundations/Icons",
	parameters: {
		layout: "padded",
	},
	tags: ["autodocs"],
} satisfies Meta

export default meta
type Story = StoryObj

const iconGrid: React.CSSProperties = {
	display: "grid",
	gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
	gap: 16,
}

const iconCell: React.CSSProperties = {
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	gap: 8,
	padding: "12px 8px",
	borderRadius: 8,
}

const iconLabel: React.CSSProperties = {
	fontSize: 11,
	color: "#888",
	textAlign: "center",
	wordBreak: "break-word",
	lineHeight: 1.3,
}

const icons = [
	{ name: "AlarmClock", Icon: AlarmClockIcon },
	{ name: "AlertHexagon", Icon: AlertHexagonIcon },
	{ name: "Announcement", Icon: AnnouncementIcon },
	{ name: "AutoRun", Icon: AutoRunIcon },
	{ name: "Bell", Icon: BellIcon },
	{ name: "CalendarDate", Icon: CalendarDateIcon },
	{ name: "Calibration", Icon: CalibrationIcon },
	{ name: "Clock", Icon: ClockIcon },
	{ name: "Close", Icon: CloseIcon },
	{ name: "Dashboard", Icon: DashboardIcon },
	{ name: "Default", Icon: DefaultIcon },
	{ name: "ErrorTipOff", Icon: ErrorTipOffIcon },
	{ name: "Frame", Icon: FrameIcon },
	{ name: "Hide", Icon: HideIcon },
	{ name: "Hourglass", Icon: HourglassIcon },
	{ name: "InfoCircle", Icon: InfoCircleIcon },
	{ name: "Key", Icon: KeyIcon },
	{ name: "Language", Icon: LanguageIcon },
	{ name: "LayoutTop", Icon: LayoutTopIcon },
	{ name: "LinkExternal", Icon: LinkExternalIcon },
	{ name: "MdiApple", Icon: MdiAppleIcon },
	{ name: "MdiMicrosoftWindows", Icon: MdiMicrosoftWindowsIcon },
	{ name: "Minus", Icon: MinusIcon },
	{ name: "Moon", Icon: MoonIcon },
	{ name: "PencilLine", Icon: PencilLineIcon },
	{ name: "Plan", Icon: PlanIcon },
	{ name: "Plus", Icon: PlusIcon },
	{ name: "Setting", Icon: SettingIcon },
	{ name: "ShieldTick", Icon: ShieldTickIcon },
	{ name: "Show", Icon: ShowIcon },
	{ name: "Sidetap", Icon: SidetapIcon },
	{ name: "Sun", Icon: SunIcon },
	{ name: "Theme", Icon: ThemeIcon },
	{ name: "ThumbsUp", Icon: ThumbsUpIcon },
	{ name: "Widget", Icon: WidgetIcon },
]

const graphics = [
	{ name: "CameraGraphic", Icon: CameraGraphicIcon },
	{ name: "EmailGraphic", Icon: EmailGraphicIcon },
	{ name: "SidebarDark (L)", Icon: SidebarDarkLIcon },
	{ name: "SidebarDark (R)", Icon: SidebarDarkRIcon },
	{ name: "SidebarDark Solid (L)", Icon: SidebarDarkLSolidIcon },
	{ name: "SidebarDark Solid (R)", Icon: SidebarDarkRSolidIcon },
	{ name: "SidebarLight Solid (L)", Icon: SidebarLightLSolidIcon },
	{ name: "SidebarLight Solid (R)", Icon: SidebarLightRSolidIcon },
	{ name: "ThemeLight", Icon: ThemeLightGraphicIcon },
	{ name: "ThemeAutomatic", Icon: ThemeAutomaticIcon },
]

export const AllIcons: Story = {
	render: () => (
		<div style={iconGrid}>
			{icons.map(({ name, Icon }) => (
				<div key={name} style={iconCell}>
					<Icon width={24} height={24} />
					<span style={iconLabel}>{name}</span>
				</div>
			))}
		</div>
	),
}

export const AllGraphics: Story = {
	render: () => (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
				gap: 16,
			}}
		>
			{graphics.map(({ name, Icon }) => (
				<div key={name} style={iconCell}>
					<Icon width={58} height={37} />
					<span style={iconLabel}>{name}</span>
				</div>
			))}
		</div>
	),
}

export const IconSizes: Story = {
	render: () => {
		const sizes = [16, 20, 24, 32, 48] as const
		return (
			<div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
				{sizes.map((size) => (
					<div
						key={size}
						style={{ display: "flex", gap: 12, alignItems: "center" }}
					>
						<span style={{ width: "32px", fontSize: 12, color: "#999" }}>
							{size}
						</span>
						<SunIcon width={size} height={size} />
						<MoonIcon width={size} height={size} />
						<BellIcon width={size} height={size} />
						<SettingIcon width={size} height={size} />
						<PlusIcon width={size} height={size} />
					</div>
				))}
			</div>
		)
	},
}
