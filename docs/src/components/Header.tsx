import styled from '@emotion/styled';
import { graphql, useStaticQuery } from 'gatsby';
import React from 'react';
import GitHubButton from 'react-github-btn';
import config from '../../config';
import FacebookSVG from '../images/facebook.inline.svg';
import TwitterSVG from '../images/twitter.inline.svg';
import helpIcon from '../images/help.svg';
import logoImage from '../images/screencloud.svg';
import Link from './link';
import LoadingProvider from './mdxComponents/loading';
import Sidebar from './sidebar';

interface SearchIndex {
  name: string;
  title: string;
  hitComp: string;
}

const isSearchEnabled = config.header.search && config.header.search.enabled ? true : false;

const searchIndices: SearchIndex[] = [];

if (isSearchEnabled && config.header.search.indexName) {
  searchIndices.push({
    name: `${config.header.search.indexName}`,
    title: `Results`,
    hitComp: `PageHit`,
  });
}

const SearchComponent = React.lazy(() => import('./search/index'));

interface LazySearchProps {
  collapse?: boolean;
  indices: SearchIndex[];
}

const LazySearch = (props: LazySearchProps) => (
  <React.Suspense fallback={<LoadingProvider />}>
    <SearchComponent {...props} />
  </React.Suspense>
);

function toggleMobileSiteNavigation() {
  const x = document.getElementById('navbar');

  if (!x) {
    return;
  }

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

const Header = ({ location }: { location?: Location }) => {
  const data = useStaticQuery(graphql`
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
  `);

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

  const [hasMounted, setHasMounted] = React.useState(false);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <div className={'navBarWrapper'}>
      <nav className={'navBarDefault'}>
        <div className={'navBarHeader'}>
          <Link to={'/'} className={'navBarBrand'}>
            {hasMounted ? (
              <img
                className={'img-responsive displayInline'}
                src={logoImage}
                alt={'ScreenCloud Developer'}
              />
            ) : null}
          </Link>
        </div>
        <ul className="socialWrapper visibleMobileView">
          {hasMounted ? (
            <>
              <li>{twitterLink}</li>
              <li>{facebookLink}</li>
            </>
          ) : null}
        </ul>
        {isSearchEnabled && hasMounted ? (
          <div className={'searchWrapper hiddenMobile navBarUL'}>
            <LazySearch collapse={true} indices={searchIndices} />
          </div>
        ) : null}
        <div id="navbar" className={'topnav'}>
          <div className={'visibleMobile'}>
            <Sidebar location={location} />
          </div>
          <ul className={'navBarUL navBarNav navBarULRight'}>
            {headerLinks.map((link: { link: string; text: string }, key: number) => {
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
                  <img src={helpIcon} alt={'Help icon'} />
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
                {hasMounted ? (
                  <GitHubButton
                    href={githubUrl}
                    data-show-count="true"
                    aria-label="Star on GitHub"
                    {...({ style: { height: '40px' } } as any)}
                  >
                    Star
                  </GitHubButton>
                ) : null}
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
        {isSearchEnabled && hasMounted ? (
          <div className={'searchWrapper'}>
            <LazySearch collapse={true} indices={searchIndices} />
          </div>
        ) : null}
      </StyledBgDiv>
    </div>
  );
};

export default Header;
