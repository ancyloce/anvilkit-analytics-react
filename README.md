# @anvilkit/analytics-react

React provider + hooks for AnvilKit Studio analytics. Wraps an
`AnalyticsAdapter` from the React-free `@anvilkit/analytics-core` so any adapter
(Http, GA4, PostHog, …) works in both the editor and a published site.

## Exports

- **`AnalyticsProvider`** — context provider taking an `adapter` plus optional
  base context (`source` / `workspace_id` / `user_id`) merged into every event.
- **`useAnalytics()`** — the active adapter, or a safe **no-op** adapter when no
  provider is mounted.
- **`useTrack()`** — a `track(eventName, properties?)` bound to the provider; a
  genuine no-op (no adapter call) when no provider is mounted.

```tsx
import { AnalyticsProvider, useTrack } from "@anvilkit/analytics-react";
import { createHttpAdapter } from "@anvilkit/analytics-core";

const adapter = createHttpAdapter({ endpoint: "/collect", source: "published_site", privacy });

function App() {
  return (
    <AnalyticsProvider adapter={adapter} context={{ source: "published_site" }}>
      <Page />
    </AnalyticsProvider>
  );
}

function CtaButton() {
  const track = useTrack();
  return <button onClick={() => track("cta_click", { id: "hero" })}>Go</button>;
}
```

Components render identically with no provider mounted (the hook is a safe
no-op), so instrumentation never changes behavior.
