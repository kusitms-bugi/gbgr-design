## @gbgr/react-headless

React headless primitives package.

### Button

```tsx
import { useButton } from "@gbgr/react-headless";

export function Example() {
	const { buttonProps } = useButton({
		type: "button",
		onPress: () => console.log("pressed"),
	});

	return (
		<button {...buttonProps}>
			Save
		</button>
	);
}
```

### Button interaction state machine

```tsx
import { useButton } from "@gbgr/react-headless";

export function Example() {
	const { buttonProps, state } = useButton({
		disabled: false,
		loading: false,
	});

	return (
		<button {...buttonProps}>
			State: {state}
		</button>
	);
}
```
