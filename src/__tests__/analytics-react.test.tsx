import type { AnalyticsAdapter } from "@anvilkit/analytics-core";
import { act, cleanup, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AnalyticsProvider } from "../AnalyticsProvider.js";
import { useAnalytics, useTrack } from "../hooks.js";

afterEach(cleanup);

function makeAdapter(): AnalyticsAdapter {
	return {
		track: vi.fn(),
		identify: vi.fn(),
		flush: vi.fn(() => Promise.resolve()),
		updatePrivacyStatus: vi.fn(),
	};
}

function wrapperWith(adapter: AnalyticsAdapter, context?: object) {
	return ({ children }: { children: ReactNode }) => (
		<AnalyticsProvider adapter={adapter} context={context as never}>
			{children}
		</AnalyticsProvider>
	);
}

describe("useTrack", () => {
	it("is a no-op (no throw, no adapter call) without a provider", () => {
		const { result } = renderHook(() => useTrack());
		expect(() =>
			act(() => result.current("page_view", { url: "/" })),
		).not.toThrow();
	});

	it("calls adapter.track once with the merged base context under a provider", () => {
		const adapter = makeAdapter();
		const { result } = renderHook(() => useTrack(), {
			wrapper: wrapperWith(adapter, { source: "studio", workspace_id: "w1" }),
		});
		act(() => result.current("page_view", { url: "/" }));
		expect(adapter.track).toHaveBeenCalledTimes(1);
		expect(adapter.track).toHaveBeenCalledWith("page_view", {
			source: "studio",
			workspace_id: "w1",
			url: "/",
		});
	});

	it("works with no properties argument", () => {
		const adapter = makeAdapter();
		const { result } = renderHook(() => useTrack(), {
			wrapper: wrapperWith(adapter, { source: "published_site" }),
		});
		act(() => result.current("page_view"));
		expect(adapter.track).toHaveBeenCalledWith("page_view", {
			source: "published_site",
		});
	});
});

describe("useAnalytics", () => {
	it("returns the injected adapter under a provider", () => {
		const adapter = makeAdapter();
		const { result } = renderHook(() => useAnalytics(), {
			wrapper: wrapperWith(adapter),
		});
		expect(result.current).toBe(adapter);
	});

	it("returns a safe no-op adapter without a provider", () => {
		const { result } = renderHook(() => useAnalytics());
		expect(typeof result.current.track).toBe("function");
		expect(() => result.current.track("x", {})).not.toThrow();
	});
});
