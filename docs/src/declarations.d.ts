// Inline SVGs are transformed into React components by gatsby-plugin-react-svg
declare module '*.inline.svg' {
  import * as React from 'react';
  const Component: React.FC<React.SVGProps<SVGSVGElement>>;
  export default Component;
}

// Other static assets resolve to their public URL
declare module '*.svg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}
