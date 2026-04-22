import * as React from "react"

export type UseTextFieldProps = {
	type?: string
	disabled?: boolean
	passwordVisible?: boolean
	defaultPasswordVisible?: boolean
	onPasswordVisibleChange?: (visible: boolean) => void
}

export function useTextField(props: UseTextFieldProps) {
	const {
		type = "text",
		disabled = false,
		passwordVisible,
		defaultPasswordVisible = false,
		onPasswordVisibleChange,
	} = props

	const isPassword = type === "password"

	const [uncontrolledVisible, setUncontrolledVisible] = React.useState(
		defaultPasswordVisible,
	)

	const isPasswordVisible =
		passwordVisible ?? (isPassword ? uncontrolledVisible : false)

	const setPasswordVisible = React.useCallback(
		(next: boolean) => {
			if (!isPassword) return
			if (passwordVisible === undefined) {
				setUncontrolledVisible(next)
			}
			onPasswordVisibleChange?.(next)
		},
		[isPassword, passwordVisible, onPasswordVisibleChange],
	)

	const togglePasswordVisible = React.useCallback(() => {
		if (disabled) return
		setPasswordVisible(!isPasswordVisible)
	}, [disabled, setPasswordVisible, isPasswordVisible])

	return {
		isPassword,
		isPasswordVisible,
		inputType: isPassword ? (isPasswordVisible ? "text" : "password") : type,
		togglePasswordVisible,
	}
}
