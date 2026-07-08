import React from 'react';
import { Link as GatsbyLink } from 'gatsby';
import isAbsoluteUrl from 'is-absolute-url';

interface LinkProps {
  to: string;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

const Link = ({ to, ...props }: LinkProps) =>
  isAbsoluteUrl(to) ? (
    <a href={to} {...props}>
      {props.children}
    </a>
  ) : (
    <GatsbyLink to={to} {...props} />
  );

export default Link;
