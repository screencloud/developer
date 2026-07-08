/**
 * Turn a heading title into an anchor id.
 *
 * Used both when rendering heading elements (mdxComponents) and when building
 * the right sidebar's table-of-contents links — the two must stay in sync or
 * TOC links point at nonexistent anchors.
 */
export const anchorId = (title: string): string =>
  title.replace(/\s+/g, '').toLowerCase();
