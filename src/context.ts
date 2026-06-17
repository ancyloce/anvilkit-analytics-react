"use client";

import type { AnalyticsAdapter, BaseEventData } from "@anvilkit/analytics-core";
import { createNoopAdapter } from "@anvilkit/analytics-core";
import { createContext } from "react";

/** Base context the provider merges into every tracked event. */
export type AnalyticsBaseContext = Pick<
	BaseEventData,
	"source" | "workspace_id" | "user_id"
>;

/** The value carried by {@link AnalyticsContext}. */
export interface AnalyticsContextValue {
	readonly adapter: AnalyticsAdapter;
	readonly context?: AnalyticsBaseContext;
}

/** Stable no-op adapter returned by {@link useAnalytics} with no provider. */
export const NOOP_ADAPTER: AnalyticsAdapter = createNoopAdapter();

export const AnalyticsContext = createContext<AnalyticsContextValue | null>(
	null,
);
