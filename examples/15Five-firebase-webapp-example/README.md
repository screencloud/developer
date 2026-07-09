# 15Five ScreenCloud Example

A React app that displays 15Five "high fives" on ScreenCloud, fetching data from the companion Firebase cloud function (see `../15five-firebase-cloud-function-example`). Built with [Vite](https://vite.dev/).

## How to Use

- Clone the repository, then navigate to this folder.
- Run `pnpm install` the first time.
- Start the companion cloud function locally (it serves `http://localhost:5001/screencloud-15five/us-central1/highFives`).
- Run `pnpm start` to develop locally. Your app will start on [http://localhost:3000/](http://localhost:3000/)
- Run `pnpm build` to make a production-optimised bundle.

## Where to Look

- `src/components/data-loader/DataLoader.jsx` — fetches high fives on an interval and maps the API response.
- `src/components/player/ScPlayerInterface.jsx` — connects to the ScreenCloud Player and exposes `appStarted` and the user's `config`.
- `src/components/slide-show/` — renders each high five as a slide.
