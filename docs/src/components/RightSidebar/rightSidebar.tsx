import { graphql, useStaticQuery } from 'gatsby';
import React from 'react';
import config from '../../../config';
import { anchorId } from '../../utils/anchor';
import { ListItem, Sidebar } from './styles';

interface TocItem {
  title?: string;
  url?: string;
  items?: TocItem[];
}

interface MdxEdge {
  node: {
    fields: {
      slug: string;
    };
    tableOfContents: {
      items?: TocItem[];
    };
  };
}

const SidebarLayout = ({ location }: { location?: Location }) => {
  const { allMdx } = useStaticQuery<{ allMdx: { edges: MdxEdge[] } }>(graphql`
    query {
      allMdx {
        edges {
          node {
            fields {
              slug
            }
            tableOfContents
          }
        }
      }
    }
  `);

  let finalNavItems: React.ReactNode[] | undefined;

  if (allMdx.edges !== undefined && allMdx.edges.length > 0 && location) {
    allMdx.edges.map((item) => {
      let innerItems: React.ReactNode[] | undefined;

      if (item !== undefined) {
        if (
          item.node.fields.slug === location.pathname ||
          config.gatsby.pathPrefix + item.node.fields.slug === location.pathname
        ) {
          if (item.node.tableOfContents.items) {
            innerItems = item.node.tableOfContents.items.map((innerItem, index) => {
              const itemId = innerItem.title ? anchorId(innerItem.title) : '#';

              return (
                <ListItem key={index} to={`#${itemId}`} level={1}>
                  {innerItem.title}
                </ListItem>
              );
            });
          }
        }
      }
      if (innerItems) {
        finalNavItems = innerItems;
      }
    });
  }

  if (finalNavItems && finalNavItems.length) {
    return (
      <Sidebar>
        <ul className={'rightSideBarUL'}>
          <li className={'rightSideTitle'}>CONTENTS</li>
          {finalNavItems}
        </ul>
      </Sidebar>
    );
  } else {
    return (
      <Sidebar>
        <ul></ul>
      </Sidebar>
    );
  }
};

export default SidebarLayout;
