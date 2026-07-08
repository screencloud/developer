import '@emotion/react';

// The site never sets up an emotion ThemeProvider, so styled-component
// interpolations that read props.theme resolve against an empty object at
// runtime. Allow arbitrary keys so those interpolations typecheck.
declare module '@emotion/react' {
  export interface Theme {
    [key: string]: any;
  }
}
