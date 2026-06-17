/**
 * @file Public barrel for `@anvilkit/analytics-react` — the React consumer API
 * over `@anvilkit/analytics-core`. The core stays React-free; this package
 * carries the `react`/`react-dom` peers.
 */

export {
	AnalyticsProvider,
	type AnalyticsProviderProps,
} from "./AnalyticsProvider.js";
export type { AnalyticsBaseContext, AnalyticsContextValue } from "./context.js";
export { type TrackFn, useAnalytics, useTrack } from "./hooks.js";
export {
	type ComponentTrackingProps,
	useComponentTrack,
} from "./use-component-track.js";
