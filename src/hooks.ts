"use client";

import type { AnalyticsAdapter } from "@anvilkit/analytics-core";
import { use, useCallback } from "react";
import { AnalyticsContext, NOOP_ADAPTER } from "./context.js";

/**
 * The active {@link AnalyticsAdapter}, or a safe no-op adapter when no
 * {@link AnalyticsProvider} is mounted.
 */
export function useAnalytics(): AnalyticsAdapter {
	const value = use(AnalyticsContext);
	return value?.adapter ?? NOOP_ADAPTER;
}

/** A tracker bound to the provider. */
export type TrackFn = (
	eventName: string,
	properties?: Record<string, string | number | boolean>,
) => void;

/**
 * Returns a `track(eventName, properties?)` bound to the provider, merging the
 * provider's base context. A genuine no-op (no adapter call) when no
 * {@link AnalyticsProvider} is mounted.
 */
export function useTrack(): TrackFn {
	const value = use(AnalyticsContext);
	return useCallback<TrackFn>(
		(eventName, properties) => {
			if (value === null) return; // no provider → no-op, no adapter call
			const base: Record<string, string | number | boolean> = {};
			const ctx = value.context;
			if (ctx?.source !== undefined) base.source = ctx.source;
			if (ctx?.workspace_id !== undefined) base.workspace_id = ctx.workspace_id;
			if (ctx?.user_id !== undefined) base.user_id = ctx.user_id;
			value.adapter.track(eventName, { ...base, ...properties });
		},
		[value],
	);
}
