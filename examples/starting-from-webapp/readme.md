## Starting from a Webapp

This is _not_ a ScreenCloud app yet.

This project is the basis for the other `-app` examples in this folder. It is shared for anyone who wants to work along with the Getting Started guide step by step.

Hopefully it should look familiar to any JavaScript app you might have worked on before. There is a `package.json` with all our dependencies, and a build tool that converts your source (in `/src/`) into standard JavaScript and HTML (in `/dist/`)

We use Vite here, but there is nothing ScreenCloud-specific in there. If you're already using webpack, Gulp, Grunt or another tool, that's no bother! You won't have to change anything there.

### How to Use

- Clone the repository, then navigate to this folder.
- Run `pnpm install` the first time.
- Run `pnpm start` to develop locally. Your app will start on [http://localhost:8000/](http://localhost:8000/)
- Run `pnpm build` to make a production-optimised bundle.

Feel free to open an issue with any questions!

### Notes

- Has support for SASS, using the `.scss` extension.
- Has support for TypeScript, using the `.ts` extension.
- Images should be placed in `/public/images/`. They will then be copied to `/dist/images/` during build.
