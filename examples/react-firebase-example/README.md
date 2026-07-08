# ScreenCloud React Example

A React app that fetches data on an interval and rotates it through a slideshow, connected to a ScreenCloud Player via the [Apps SDK](https://www.npmjs.com/package/@screencloud/apps-sdk). Built with [Vite](https://vite.dev/).

## How to Use

- Clone the repository, then navigate to this folder.
- Run `pnpm install` the first time.
- Run `pnpm start` to develop locally. Your app will start on [http://localhost:3000/](http://localhost:3000/)
- Run `pnpm build` to make a production-optimised bundle.

## Where to Look

- `src/components/data-loader/DataLoader.jsx` — fetches data on an interval; follow the numbered comments to point it at your own API and map the response.
- `src/components/player/ScPlayerInterface.jsx` — connects to the ScreenCloud Player and exposes `appStarted` and the user's `config`.
- `src/components/slide-show/` — renders each item of data as a slide.
