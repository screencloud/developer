---
title: 'Build with AI'
metaTitle: 'Build ScreenCloud Apps with AI'
metaDescription: 'Use our Claude Code plugin to build ScreenCloud apps with an AI coding agent.'
---

AI coding agents are great at building ScreenCloud apps — the whole surface area is a small SDK and a handful of signage-specific conventions. We publish a skill that teaches your agent those conventions, so it scaffolds apps correctly the first time: the Player connection lifecycle, local test data, preloading, themes, the media proxy, and how to ship to the App Store.

## Claude Code

Our plugin is published straight from this repository. Add the marketplace once, then install:

```
/plugin marketplace add screencloud/developer
/plugin install screencloud-apps@screencloud
```

That's it. Now ask for what you want, in your own words:

```
Build a ScreenCloud app that shows our latest company news from this RSS feed,
rotating one story at a time.
```

Claude will pick up the `build-screencloud-app` skill automatically whenever you're working on a ScreenCloud app — you don't need to invoke anything explicitly.

## Other agents

The skill is a plain Markdown file, so any agent that accepts project context can use it. Copy [`SKILL.md`](https://github.com/screencloud/developer/blob/master/plugins/screencloud-apps/skills/build-screencloud-app/SKILL.md) into your project — for example as part of your `AGENTS.md`, a Cursor rule, or pasted into a prompt.

## What the skill knows

- Project setup with the build settings signage screens need (relative asset URLs, conservative browser targets).
- The `connectScreenCloud()` lifecycle: config, context, and why timers should wait for `onAppStarted()`.
- Local development with test data — and why it must never ship to production.
- Signage design constraints: no user input, viewed at distance, runs 24/7, arbitrary screen zones.
- Themes, per-screen data, the media proxy, and App Store submission.

The skill links back to this documentation and to the [example apps](https://github.com/screencloud/developer/tree/master/examples), so the agent can go deeper when it needs to.

Found a gap or a wrong assumption in the skill? [Open an issue](https://github.com/screencloud/developer/issues) — it's versioned with this repo.
