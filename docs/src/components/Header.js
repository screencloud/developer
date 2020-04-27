import styled from '@emotion/styled';
import { graphql, StaticQuery } from 'gatsby';
import React from 'react';
import GitHubButton from 'react-github-btn';
import Loadable from 'react-loadable';
import config from '../../config.js';
import FacebookSVG from '../images/facebook.inline.svg';
import TwitterSVG from '../images/twitter.inline.svg';
import Link from './link';
import LoadingProvider from './mdxComponents/loading';
import Sidebar from './sidebar';

const help = require('../images/help.svg');

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

function toggleMobileSiteNavigation() {
  var x = document.getElementById('navbar');

  if (x.className === 'topnav') {
    x.className += ' responsive';
  } else {
    x.className = 'topnav';
  }
}

const StyledBgDiv = styled('div')`
  height: 60px;
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
            headerLinks {
              link
              text
            }
          }
        }
      }
    `}
    render={data => {
      const logoImage = require('../images/screencloud.svg');

      const twitterLink = (
        <a href="https://twitter.com/screencloud" target="_blank" rel="noopener noreferrer">
          <TwitterSVG />
        </a>
      );

      const facebookLink = (
        <a href="https://www.facebook.com/ScreenCloudio" target="_blank" rel="noopener noreferrer">
          <FacebookSVG />
        </a>
      );

      const {
        site: {
          siteMetadata: { githubUrl, helpUrl, headerLinks },
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
              <li>{facebookLink}</li>
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
                {githubUrl !== '' ? <li className="divider hiddenMobile"></li> : null}
                <li className={'hiddenMobile'}>
                  <ul className="socialWrapper">
                    <li>{twitterLink}</li>
                    <li>{facebookLink}</li>
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
                onClick={toggleMobileSiteNavigation}
                className={'navBarToggle'}
                onKeyDown={toggleMobileSiteNavigation}
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
