import * as React from 'react';

interface AnchorTagProps {
  children?: React.ReactNode;
  href?: string;
  [key: string]: any;
}

const AnchorTag = ({ children: link, ...props }: AnchorTagProps) => {
  if (link) {
    return (
      <a href={props.href} target="_blank" rel="noopener noreferrer">
        {link}
      </a>
    );
  } else {
    return null;
  }
};

export default AnchorTag;
