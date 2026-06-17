"use client";

import { useCallback } from "react";
import { useTrack } from "./hooks.js";

/**
 * The declarative tracking fields a component exposes (PRD 0004 F13 / §5.8).
 * All optional + serializable — a component spreads matching Puck fields into
 * its config and passes the props here.
 */
export interface ComponentTrackingProps {
	/** Fire `eventName` on the component's primary interaction. Default off. */
	readonly trackClick?: boolean;
	/** Event name; defaults to `${slug}_click`. */
	readonly eventName?: string;
	/** Extra properties merged into the event. Non-strings are dropped. */
	readonly eventProps?: Readonly<Record<string, string | undefined>>;
}

/**
 * Shared per-component tracking helper. Returns a stable handler that fires
 * `eventName` (default `${slug}_click`) with `eventProps` when `trackClick` is
 * on — a no-op when it's off OR when no `AnalyticsProvider` is mounted (via
 * `useTrack`). A context hook only: no data fetch, identical render either way,
 * so the pure-component invariant holds.
 */
export function useComponentTrack(
	slug: string,
	{ trackClick, eventName, eventProps }: ComponentTrackingProps,
): () => void {
	const track = useTrack();
	return useCallback(() => {
		if (trackClick !== true) return;
		const properties: Record<string, string> = {};
		for (const [key, value] of Object.entries(eventProps ?? {})) {
			if (typeof value === "string") properties[key] = value;
		}
		track(
			eventName !== undefined && eventName.length > 0
				? eventName
				: `${slug}_click`,
			properties,
		);
	}, [track, slug, trackClick, eventName, eventProps]);
}
