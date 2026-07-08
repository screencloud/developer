import { Layout, Link } from '$components';
import { graphql } from 'gatsby';
import React from 'react';
import Helmet from 'react-helmet';
import config from '../../config';
import NextPrevious, { NavItem } from '../components/NextPrevious';
import { Edit, StyledHeading, StyledMainWrapper } from '../components/styles/Docs';
import gitHub from '../images/github.svg';

const forcedNavOrder = config.sidebar.forcedNavOrder;

interface DocsPageData {
  allMdx: {
    edges: Array<{
      node: {
        fields: {
          slug: string;
          title: string;
        };
      };
    }>;
  };
  mdx: {
    fields: {
      id: string;
      title: string;
      slug: string;
    };
    parent: {
      relativePath: string;
    };
    frontmatter: {
      metaTitle: string | null;
      metaDescription: string | null;
    };
  };
  site: {
    siteMetadata: {
      docsLocation: string;
    };
  };
}

interface DocsProps {
  data?: DocsPageData;
  children: React.ReactNode;
  location?: Location;
  [key: string]: any;
}

const Docs = (props: DocsProps) => {
  const { data, children } = props;

  if (!data) {
    return null;
  }
  const {
    allMdx,
    mdx,
    site: {
      siteMetadata: { docsLocation },
    },
  } = data;

  const navItems = allMdx.edges
    .map(({ node }) => node.fields.slug)
    .filter((slug) => slug !== '/')
    .sort()
    .reduce<Record<string, string[]> & { items: string[] }>(
      (acc, cur) => {
        if (forcedNavOrder.find((url) => url === cur)) {
          return { ...acc, [cur]: [cur] };
        }

        let prefix = cur.split('/')[1];

        if (config.gatsby && config.gatsby.trailingSlash) {
          prefix = prefix + '/';
        }

        if (prefix && forcedNavOrder.find((url) => url === `/${prefix}`)) {
          return { ...acc, [`/${prefix}`]: [...acc[`/${prefix}`], cur] };
        } else {
          return { ...acc, items: [...acc.items, cur] };
        }
      },
      { items: [] }
    );

  const nav: Array<NavItem | undefined> = forcedNavOrder
    .reduce<string[]>((acc, cur) => {
      return acc.concat(navItems[cur]);
    }, [])
    .concat(navItems.items)
    .map((slug) => {
      if (slug) {
        const { node } = allMdx.edges.find(({ node }) => node.fields.slug === slug)!;

        return { title: node.fields.title, url: node.fields.slug };
      }
    });

  // meta tags
  const metaTitle = `${mdx.frontmatter.metaTitle || mdx.fields.title}${
    config.siteMetadata.titleSuffix
  }`;

  const metaDescription = mdx.frontmatter.metaDescription || config.siteMetadata.description;

  let canonicalUrl = config.gatsby.siteUrl;

  canonicalUrl =
    config.gatsby.pathPrefix !== '/' ? canonicalUrl + config.gatsby.pathPrefix : canonicalUrl;
  canonicalUrl = canonicalUrl + mdx.fields.slug;

  return (
    <Layout {...props}>
      <Helmet>
        {metaTitle ? <title>{metaTitle}</title> : null}
        {metaTitle ? <meta name="title" content={metaTitle} /> : null}
        {metaDescription ? <meta name="description" content={metaDescription} /> : null}
        {metaTitle ? <meta property="og:title" content={metaTitle} /> : null}
        {metaDescription ? <meta property="og:description" content={metaDescription} /> : null}
        {metaTitle ? <meta property="twitter:title" content={metaTitle} /> : null}
        {metaDescription ? <meta property="twitter:description" content={metaDescription} /> : null}
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>
      <div className={'titleWrapper'}>
        <StyledHeading>{mdx.fields.title}</StyledHeading>
        <Edit className={'mobileView'}>
          {docsLocation && (
            <Link className={'gitBtn'} to={`${docsLocation}/${mdx.parent.relativePath}`}>
              <img src={gitHub} alt={'Github logo'} /> Edit on GitHub
            </Link>
          )}
        </Edit>
      </div>
      <StyledMainWrapper>{children}</StyledMainWrapper>
      <div className={'addPaddTopBottom'}>
        <NextPrevious mdx={mdx} nav={nav} />
      </div>
    </Layout>
  );
};

export default Docs;

export const pageQuery = graphql`
  query ($id: String!) {
    site {
      siteMetadata {
        docsLocation
      }
    }
    mdx(fields: { id: { eq: $id } }) {
      fields {
        id
        title
        slug
      }
      parent {
        ... on File {
          relativePath
        }
      }
      frontmatter {
        metaTitle
        metaDescription
      }
    }
    allMdx {
      edges {
        node {
          fields {
            slug
            title
          }
        }
      }
    }
  }
`;
