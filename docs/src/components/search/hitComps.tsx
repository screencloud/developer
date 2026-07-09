import React from 'react';
import { Highlight, Snippet } from 'react-instantsearch-dom';
import { Link } from 'gatsby';

interface PageHitProps {
  hit: {
    slug: string;
    [key: string]: any;
  };
}

/* eslint-disable react/display-name -- factory returns an anonymous hit renderer */
export const PageHit =
  (clickHandler: () => void) =>
  ({ hit }: PageHitProps) => (
    <div>
      <Link to={hit.slug} onClick={clickHandler}>
        <div>
          <Highlight attribute="title" hit={hit} tagName="mark" />
        </div>
      </Link>
      <Snippet attribute="excerpt" hit={hit} tagName="mark" />
    </div>
  );
