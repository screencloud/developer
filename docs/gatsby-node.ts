import path from 'path';
import type { GatsbyNode } from 'gatsby';
import startCase from 'lodash.startcase';

import config from './config';

const docsTemplate = path.resolve('./src/templates/docs.tsx');

interface CreatePagesQuery {
  allMdx: {
    nodes: Array<{
      fields: {
        id: string;
        slug: string;
      };
      internal: {
        contentFilePath: string;
      };
    }>;
  };
}

export const createPages: GatsbyNode['createPages'] = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;

  const result = await graphql<CreatePagesQuery>(`
    {
      allMdx {
        nodes {
          fields {
            id
            slug
          }
          internal {
            contentFilePath
          }
        }
      }
    }
  `);

  if (result.errors || !result.data) {
    reporter.panicOnBuild('Error loading MDX result', result.errors);
    return;
  }

  result.data.allMdx.nodes.forEach(node => {
    createPage({
      path: node.fields.slug ? node.fields.slug : '/',
      component: `${docsTemplate}?__contentFilePath=${node.internal.contentFilePath}`,
      context: {
        id: node.fields.id,
      },
    });
  });
};

export const onCreateWebpackConfig: GatsbyNode['onCreateWebpackConfig'] = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
      alias: {
        $components: path.resolve(__dirname, 'src/components'),
      },
    },
  });
};

export const onCreateNode: GatsbyNode['onCreateNode'] = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `Mdx`) {
    const parent = node.parent ? getNode(node.parent) : undefined;

    if (!parent || !parent.relativePath || !parent.ext) {
      return;
    }

    const relativePath = parent.relativePath as string;
    const ext = parent.ext as string;

    let value = relativePath.replace(ext, '');

    if (value === 'index') {
      value = '';
    }

    if (config.gatsby && config.gatsby.trailingSlash) {
      createNodeField({
        name: `slug`,
        node,
        value: value === '' ? `/` : `/${value}/`,
      });
    } else {
      createNodeField({
        name: `slug`,
        node,
        value: `/${value}`,
      });
    }

    createNodeField({
      name: 'id',
      node,
      value: node.id,
    });

    const frontmatter = (node as { frontmatter?: { title?: string } }).frontmatter;

    createNodeField({
      name: 'title',
      node,
      value: frontmatter?.title || startCase(parent.name as string),
    });
  }
};
