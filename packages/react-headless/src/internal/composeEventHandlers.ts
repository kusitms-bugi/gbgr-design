import * as React from "react";

type Handler<E> = ((event: E) => void) | undefined;

export function composeEventHandlers<E extends React.SyntheticEvent>(
	originalHandler: Handler<E>,
	ourHandler: Handler<E>,
	options?: { checkDefaultPrevented?: boolean },
) {
	return (event: E) => {
		originalHandler?.(event);

		if (options?.checkDefaultPrevented !== false && event.defaultPrevented) {
			return;
		}

		ourHandler?.(event);
	};
}

