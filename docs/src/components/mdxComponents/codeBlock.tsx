import * as React from 'react';
import Highlight, { defaultProps } from 'prism-react-renderer';
import prismTheme from 'prism-react-renderer/themes/vsDark';

type Language = React.ComponentProps<typeof Highlight>['language'];

type Token = { types: string[]; content: string; empty?: boolean };

/** Removes the last token from a code example if it's empty. */
function cleanTokens(tokens: Token[][]) {
  const tokensLength = tokens.length;

  if (tokensLength === 0) {
    return tokens;
  }
  const lastToken = tokens[tokensLength - 1];

  if (lastToken.length === 1 && lastToken[0].empty) {
    return tokens.slice(0, tokensLength - 1);
  }
  return tokens;
}

interface CodeBlockProps {
  children: string;
  className?: string;
  [key: string]: any;
}

/* eslint-disable react/jsx-key */
const CodeBlock = ({ children: exampleCode, className, ...props }: CodeBlockProps) => {
  // MDX v2 routes inline code and fenced code through the same `code`
  // component. Fenced blocks have a language className or contain newlines;
  // everything else renders as plain inline code.
  const isFencedBlock =
    (className && className.startsWith('language-')) ||
    (typeof exampleCode === 'string' && exampleCode.includes('\n'));

  if (!isFencedBlock) {
    return (
      <code className={className} {...props}>
        {exampleCode}
      </code>
    );
  }

  const language = (className ? className.replace('language-', '') : 'javascript') as Language;

  return (
    <Highlight
      {...defaultProps}
      code={exampleCode.trimEnd()}
      language={language}
      theme={prismTheme}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className + ' pre'} style={style}>
          {cleanTokens(tokens).map((line, i) => {
            let lineClass: React.CSSProperties = {};

            let isDiff = false;

            if (line[0] && line[0].content.length && line[0].content[0] === '+') {
              lineClass = { backgroundColor: 'rgba(76, 175, 80, 0.2)' };
              isDiff = true;
            } else if (line[0] && line[0].content.length && line[0].content[0] === '-') {
              lineClass = { backgroundColor: 'rgba(244, 67, 54, 0.2)' };
              isDiff = true;
            } else if (line[0] && line[0].content === '' && line[1] && line[1].content === '+') {
              lineClass = { backgroundColor: 'rgba(76, 175, 80, 0.2)' };
              isDiff = true;
            } else if (line[0] && line[0].content === '' && line[1] && line[1].content === '-') {
              lineClass = { backgroundColor: 'rgba(244, 67, 54, 0.2)' };
              isDiff = true;
            }
            const lineProps = getLineProps({ line, key: i });

            lineProps.style = lineClass as any;
            const diffStyle: React.CSSProperties = {
              userSelect: 'none',
              MozUserSelect: '-moz-none',
              WebkitUserSelect: 'none',
            };

            let splitToken: Token;

            return (
              <div {...lineProps} key={i}>
                {line.map((token, key) => {
                  if (isDiff) {
                    if (
                      (key === 0 || key === 1) &&
                      (token.content.charAt(0) === '+' || token.content.charAt(0) === '-')
                    ) {
                      if (token.content.length > 1) {
                        splitToken = {
                          types: ['template-string', 'string'],
                          content: token.content.slice(1),
                        };
                        const firstChar: Token = {
                          types: ['operator'],
                          content: token.content.charAt(0),
                        };

                        return (
                          <React.Fragment key={key}>
                            <span {...getTokenProps({ token: firstChar, key })} style={diffStyle} />
                            <span {...getTokenProps({ token: splitToken, key })} />
                          </React.Fragment>
                        );
                      } else {
                        return <span {...getTokenProps({ token, key })} style={diffStyle} />;
                      }
                    }
                  }
                  return <span {...getTokenProps({ token, key })} />;
                })}
              </div>
            );
          })}
        </pre>
      )}
    </Highlight>
  );
};

export default CodeBlock;
