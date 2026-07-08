import React from 'react';
import config from '../config';

interface HTMLProps {
  htmlAttributes?: Record<string, unknown>;
  headComponents?: React.ReactNode[];
  bodyAttributes?: Record<string, unknown>;
  preBodyComponents?: React.ReactNode[];
  body?: string;
  postBodyComponents?: React.ReactNode[];
}

export default class HTML extends React.Component<HTMLProps> {
  render() {
    return (
      <html {...this.props.htmlAttributes} lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
          {config.siteMetadata.ogImage ? (
            <meta property="og:image" content={config.siteMetadata.ogImage} />
          ) : null}
          <meta property="twitter:card" content="summary_large_image" />
          {config.siteMetadata.ogImage ? (
            <meta property="twitter:image" content={config.siteMetadata.ogImage} />
          ) : null}
          {config.siteMetadata.favicon ? (
            <link rel="shortcut icon" type="image/svg" href={config.siteMetadata.favicon} />
          ) : null}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600&display=swap"
          />

          <noscript key="noscript"></noscript>
          {this.props.headComponents}
        </head>
        <body {...this.props.bodyAttributes}>
          {this.props.preBodyComponents}
          <div
            key={`body`}
            id="___gatsby"
            dangerouslySetInnerHTML={{ __html: this.props.body || '' }}
          />
          {this.props.postBodyComponents}
          <script
            defer
            dangerouslySetInnerHTML={{
              __html: `
            function navBarClose() {
              document.getElementById("navbar").classList.toggle("responsive");
            }
            document.addEventListener('click',function(e){
              if(e.target && e.target.tagName.toLowerCase() === 'a'){
                navBarClose();
              }
           });
            `,
            }}
          />
        </body>
      </html>
    );
  }
}
