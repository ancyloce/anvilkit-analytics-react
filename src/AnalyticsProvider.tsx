"use client";

import type { AnalyticsAdapter } from "@anvilkit/analytics-core";
import type { ReactElement, ReactNode } from "react";
import { useMemo } from "react";
import {
	type AnalyticsBaseContext,
	AnalyticsContext,
	type AnalyticsContextValue,
} from "./context.js";

/** Props for {@link AnalyticsProvider}. */
export interface AnalyticsProviderProps {
	/** Transport adapter from `@anvilkit/analytics-core` (Http/GA4/PostHog/…). */
	readonly adapter: AnalyticsAdapter;
	/** Optional base context merged into every event. */
	readonly context?: AnalyticsBaseContext;
	readonly children: ReactNode;
}

/**
 * Provides an {@link AnalyticsAdapter} (and optional base context) to the tree.
 * Usable at the `<Studio>` composition root and at a published-site root.
 */
export function AnalyticsProvider({
	adapter,
	context,
	children,
}: AnalyticsProviderProps): ReactElement {
	const value = useMemo<AnalyticsContextValue>(
		() => (context === undefined ? { adapter } : { adapter, context }),
		[adapter, context],
	);
	return (
		<AnalyticsContext.Provider value={value}>
			{children}
		</AnalyticsContext.Provider>
	);
}
