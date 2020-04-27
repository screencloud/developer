import { Global } from '@emotion/core';
import styled from '@emotion/styled';
import { MDXProvider } from '@mdx-js/react';
import React from 'react';
import Header from './Header';
import mdxComponents from './mdxComponents';
import RightSidebar from './rightSidebar';
import Sidebar from './sidebar';
import { baseStyles } from './styles/GlobalStyles';
import { theme } from './theme';

const Wrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  background: ${theme.colors.background};

  .sideBarUL li a {
    color: ${theme.colors.text};
  }

  .sideBarUL .item > a:hover {
    background-color: #1ed3c6;
    color: #fff !important;

    /* background: #F8F8F8 */
  }

  @media only screen and (max-width: 767px) {
    display: block;
  }
`;

const Content = styled('main')`
  display: flex;
  flex-grow: 1;
  margin: 0px 88px;
  padding-top: 3rem;
  background: ${theme.colors.background};

  table tr {
    background: ${theme.colors.background};
  }

  @media only screen and (max-width: 1023px) {
    padding-left: 0;
    margin: 0 10px;
    padding-top: 3rem;
  }
`;

const MaxWidth = styled('div')`
  @media only screen and (max-width: 50rem) {
    width: 100%;
    position: relative;
  }
`;

const LeftSideBarWidth = styled('div')`
  width: 298px;
`;

const RightSideBarWidth = styled('div')`
  width: 224px;
`;

const Layout = ({ children, location }) => (
  <>
    <Global styles={baseStyles} />
    <Header />
    <MDXProvider components={mdxComponents}>
      <Wrapper>
        <LeftSideBarWidth className={'hiddenMobile'}>
          <Sidebar location={location} />
        </LeftSideBarWidth>
        <div className={'sidebarTitle sideBarShow'}>Build an App</div>
        <Content>
          <MaxWidth>{children}</MaxWidth>
        </Content>
        <RightSideBarWidth className={'hiddenMobile'}>
          <RightSidebar location={location} />
        </RightSideBarWidth>
      </Wrapper>
    </MDXProvider>
  </>
);

export default Layout;
