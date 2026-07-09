---
name: build-screencloud-app
description: Build, run, and debug a ScreenCloud digital-signage app using @screencloud/apps-sdk. Use when creating a new ScreenCloud app, integrating an existing web app with the ScreenCloud Player, working with connectScreenCloud/app config/preloading/themes/media proxy, or preparing an app for the ScreenCloud App Store.
---

# Building ScreenCloud Apps

A ScreenCloud app is a static web app (HTML/JS/CSS) that the ScreenCloud Player loads in an iframe on digital-signage screens. The app talks to the Player through `@screencloud/apps-sdk` (postMessage under the hood) to receive its per-instance config, environment context, and lifecycle signals.

Full documentation: https://screencloud.github.io/developer/
Reference examples: https://github.com/screencloud/developer/tree/master/examples (vanilla JS, TypeScript, and React apps, all built with Vite).

## Project setup

Any bundler works; the official examples use Vite. Two build requirements matter for signage:

1. **Relative asset URLs** — apps are hosted under arbitrary paths, so set `base: "./"` in `vite.config.js` (or the equivalent in your bundler).
2. **Conservative build target** — signage devices include older Android/FireTV webviews. Use `build: { target: "es2015" }` rather than a modern-desktop default.

```js
// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: { target: "es2015" },
});
```

Install the SDK with your package manager: `@screencloud/apps-sdk`.

## Connecting to the Player

Call `connectScreenCloud()` as the first thing your app does. It resolves once the Player has sent the initialize payload — do not render data-driven UI before it resolves.

```js
import { connectScreenCloud } from "@screencloud/apps-sdk";

async function start() {
  // In production, pass no arguments. See "Local development" for testData.
  const sc = await connectScreenCloud();

  const config = sc.getConfig(); // Per-instance settings users chose in Studio.
  const context = sc.getContext(); // Environment info (see below).

  // Fetch initial data immediately (this may run while preloading)...
  await loadData(config);

  // ...but wait for the app to be visible before starting timers/animation.
  sc.onAppStarted().then(() => {
    setInterval(refreshData, config.refreshTimeSeconds * 1000);
  });
}

start();
```

With TypeScript, type your config: `connectScreenCloud<MyConfig>(...)` and `sc.getConfig()` returns `MyConfig`.

`getScreenCloud()` returns the same `sc` instance anywhere in the app after `connectScreenCloud()` has been called.

## Local development

Outside a real Player there is nothing to send the initialize payload, so `connectScreenCloud()` never resolves ("stuck on loading"). Pass test data in development only:

```js
let testData;

if (import.meta.env.DEV) {
  testData = {
    config: { refreshTimeSeconds: 10 }, // Whatever your app's config shape is.
  };
}

const sc = await connectScreenCloud(testData);
```

- The testData is merged over a built-in sample payload, and the app is auto-"started" so it won't sit in preloading.
- Never ship testData in a production build — it overrules real Player data (the SDK logs a warning if this happens). Guard it behind your bundler's dev flag as above (`import.meta.env.DEV` for Vite, `process.env.NODE_ENV === "development"` for webpack/CRA).
- To develop the preloading behavior itself, call `connectScreenCloud()` with no testData, then manually call `sc.initialize(testData)` and later `sc.start()` from the console or your code.

## Preloading and the app lifecycle

The Player may load your app before it is visible on screen so content is ready the instant it appears:

1. `connectScreenCloud()` resolves → you have config/context; the app may still be off-screen.
2. Fetch data and preload assets now.
3. `sc.onAppStarted()` resolves → the app is visible. Start timers, animation, and "clock starts now" behavior here.

Apps that skip step 3 and start intervals immediately will have already rotated through content by the time viewers see the screen.

## What's in config and context

- `sc.getConfig()` — the per-instance settings a user chose when adding your app in Studio. Shape is defined by your app.
- `sc.getContext()` — environment info:
  - `playerWidth` / `playerHeight` — the app's pixel dimensions on screen.
  - `theme` — optional org theme: `primaryColor`/`secondaryColor`/`textOnPrimary`/`textOnSecondary` (each a 100–900 shade ramp; `500` is the user-selected default), optional `headingFont`/`bodyFont` (`{ family, url }`). Respect it when present so apps match the org's branding.
  - `screenData` — optional per-screen key:value strings set in Studio (e.g. `storeId: "123"`), for screen-specific behavior.
  - `timezone` (IANA string) and `region` (`"eu"` | `"us"`).
  - `appId`, `appInstanceId`, `orgId`, `spaceId`, `screenId` (empty when previewing, not on a real screen).
  - `device` — `{ platform, model, version }` where platform is `studio | android | firetv | chrome | ios | embeddable | msteams`.
  - `userInteractionEnabled` — true only where viewers can interact (e.g. embedded player with a mouse); signage screens are non-interactive.
  - `durationMs` / `durationElapsedMs` — slot timing, when scheduled in a playlist.
  - `appViewerToken` — token for calling ScreenCloud APIs as the viewer.
  - `mediaProxyConfig` — see below; may be `undefined`.
  - `filesByAppInstanceId.nodes` — files attached to this app instance.

## Media proxy (optional)

Some Players expose a media proxy/cache. Routing images/videos/streams through it enables Player-side caching, offline playback, and avoids CORS issues. Always guard for absence and handle both shapes:

```js
function getMediaCacheBaseUrl(sc) {
  const { mediaProxyConfig } = sc.getContext();
  if (!mediaProxyConfig) return undefined; // No proxy; use original URLs.
  if ("mediaProxyEndpoint" in mediaProxyConfig) {
    return mediaProxyConfig.mediaProxyEndpoint.baseUrl; // Newer Players.
  }
  return mediaProxyConfig.mediacacheBaseUrl; // Older Players.
}
```

## Design constraints for signage

- No user input on real screens: no hover states, no click-to-continue, no scroll. Content must rotate/animate on its own.
- Screens are viewed at a distance: large type, high contrast, short text.
- Apps run 24/7: clean up intervals, avoid unbounded memory growth, and handle failed fetches by keeping the last good data on screen rather than showing an error state.
- Handle arbitrary `playerWidth`/`playerHeight` — apps can be full screen or a small zone of a layout, portrait or landscape.

## Shipping

1. Build a production bundle (`vite build` → `dist/`). It must be a static bundle with relative asset paths.
2. Host it yourself on any HTTPS static host. You control deploys; code updates go live without ScreenCloud involvement.
3. Add it to the App Store so it can be used in Studio: https://screencloud.github.io/developer/add-to-app-store (a short form for development apps; a fuller one when publishing).

## Config editors (advanced)

An app can also ship a custom settings/editor UI for Studio, built with `@screencloud/apps-editor-sdk`. Same `connectScreenCloud()` pattern, plus:

- `sc.emitConfigUpdateAvailable()` — tell Studio the user changed something (enables Save).
- `sc.onRequestConfigUpdate(async () => ({ config }))` — register a callback that returns the latest config when the user saves.
