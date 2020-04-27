import styled from '@emotion/styled';
import { graphql, StaticQuery } from 'gatsby';
import React from 'react';
import GitHubButton from 'react-github-btn';
import Loadable from 'react-loadable';
import config from '../../config.js';
import Link from './link';
import LoadingProvider from './mdxComponents/loading';
import Sidebar from './sidebar';

const help = require('./images/help.svg');

const isSearchEnabled = config.header.search && config.header.search.enabled ? true : false;

let searchIndices = [];

if (isSearchEnabled && config.header.search.indexName) {
  searchIndices.push({
    name: `${config.header.search.indexName}`,
    title: `Results`,
    hitComp: `PageHit`,
  });
}

const LoadableComponent = Loadable({
  loader: () => import('./search/index'),
  loading: LoadingProvider,
});

function myFunction() {
  var x = document.getElementById('navbar');

  if (x.className === 'topnav') {
    x.className += ' responsive';
  } else {
    x.className = 'topnav';
  }
}

const StyledBgDiv = styled('div')`
  height: 60px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  background-color: #f8f8f8;
  position: relative;
  display: none;
  background: #000000;

  @media (max-width: 767px) {
    display: block;
  }
`;

const Header = ({ location }) => (
  <StaticQuery
    query={graphql`
      query headerTitleQuery {
        site {
          siteMetadata {
            githubUrl
            helpUrl
            tweetText
            headerLinks {
              link
              text
            }
          }
        }
      }
    `}
    render={data => {
      const logoImage = require('./images/screencloud.svg');

      const twitterImage = require('./images/twitter.svg');

      const twitterLink = (
        <a href="https://twitter.com/screencloud" target="_blank" rel="noopener noreferrer">
          <img src={twitterImage} alt={'Twitter'} />
        </a>
      );

      const {
        site: {
          siteMetadata: { githubUrl, helpUrl, tweetText, headerLinks },
        },
      } = data;

      return (
        <div className={'navBarWrapper'}>
          <nav className={'navBarDefault'}>
            <div className={'navBarHeader'}>
              <Link to={'/'} className={'navBarBrand'}>
                <img
                  className={'img-responsive displayInline'}
                  src={logoImage}
                  alt={'ScreenCloud Developer'}
                />
              </Link>
            </div>
            <ul className="socialWrapper visibleMobileView">
              <li>{twitterLink}</li>
            </ul>
            {isSearchEnabled ? (
              <div className={'searchWrapper hiddenMobile navBarUL'}>
                <LoadableComponent collapse={true} indices={searchIndices} />
              </div>
            ) : null}
            <div id="navbar" className={'topnav'}>
              <div className={'visibleMobile'}>
                <Sidebar location={location} />
              </div>
              <ul className={'navBarUL navBarNav navBarULRight'}>
                {headerLinks.map((link, key) => {
                  if (link.link !== '' && link.text !== '') {
                    return (
                      <li key={key}>
                        <a
                          className="sidebarLink"
                          href={link.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          dangerouslySetInnerHTML={{ __html: link.text }}
                        />
                      </li>
                    );
                  }
                })}
                {helpUrl !== '' ? (
                  <li>
                    <a href={helpUrl}>
                      <img src={help} alt={'Help icon'} />
                    </a>
                  </li>
                ) : null}
                {tweetText !== '' || githubUrl !== '' ? (
                  <li className="divider hiddenMobile"></li>
                ) : null}
                <li className={'hiddenMobile'}>
                  <ul className="socialWrapper">
                    <li>{twitterLink}</li>
                  </ul>
                </li>
                {githubUrl !== '' ? (
                  <li className={'githubBtn'}>
                    <GitHubButton
                      href={githubUrl}
                      data-show-count="true"
                      aria-label="Star on GitHub"
                    >
                      Star
                    </GitHubButton>
                  </li>
                ) : null}
              </ul>
            </div>
          </nav>
          <StyledBgDiv>
            <div className={'navBarDefault removePadd'}>
              <span
                onClick={myFunction}
                className={'navBarToggle'}
                onKeyDown={myFunction}
                role="button"
                tabIndex={0}
              >
                <span className={'iconBar'}></span>
                <span className={'iconBar'}></span>
                <span className={'iconBar'}></span>
              </span>
            </div>
            {isSearchEnabled ? (
              <div className={'searchWrapper'}>
                <LoadableComponent collapse={true} indices={searchIndices} />
              </div>
            ) : null}
          </StyledBgDiv>
        </div>
      );
    }}
  />
);

export default Header;
