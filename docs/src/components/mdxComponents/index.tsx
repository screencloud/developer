import styled from '@emotion/styled';
import { Link } from 'gatsby';
import React from 'react';
import { theme } from '../theme';
import { anchorId } from '../../utils/anchor';
import AnchorTag from './anchor';
import CodeBlock from './codeBlock';

const StyledPre = styled('pre')`
  padding: 16px;
  background: ${theme.colors.preFormattedText};
`;

// Headings with non-string children (e.g. inline code) get no id.
const headingId = (children: React.ReactNode) =>
  typeof children === 'string' ? anchorId(children) : undefined;

interface HeadingProps {
  children?: React.ReactNode;
  [key: string]: any;
}

// The heading content always arrives through the spread props, which the
// jsx-a11y plugin cannot see.
/* eslint-disable jsx-a11y/heading-has-content */
const mdxComponents: Record<string, React.ComponentType<any>> = {
  h1: (props: HeadingProps) => (
    <h1 className="heading1" id={headingId(props.children)} {...props} />
  ),
  h2: (props: HeadingProps) => (
    <h2 className="heading2" id={headingId(props.children)} {...props} />
  ),
  h3: (props: HeadingProps) => (
    <h3 className="heading3" id={headingId(props.children)} {...props} />
  ),
  h4: (props: HeadingProps) => (
    <h4 className="heading4" id={headingId(props.children)} {...props} />
  ),
  h5: (props: HeadingProps) => (
    <h5 className="heading5" id={headingId(props.children)} {...props} />
  ),
  h6: (props: HeadingProps) => (
    <h6 className="heading6" id={headingId(props.children)} {...props} />
  ),
  p: (props: HeadingProps) => <p className="paragraph" {...props} />,
  pre: (props: HeadingProps) => (
    <StyledPre>
      <pre {...props} />
    </StyledPre>
  ),
  code: CodeBlock,
  a: AnchorTag,
  Link,
  // TODO add `img`
  // TODO add `blockquote`
  // TODO add `ul`
  // TODO add `li`
  // TODO add `table`
};

export default mdxComponents;
