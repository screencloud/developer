import config from '../../config';

const pageQuery = `{
  pages: allMdx {
    edges {
      node {
        objectID: id
        fields {
          slug
        }
        headings {
          value
        }
        frontmatter {
          title
          metaDescription
        }
        excerpt(pruneLength: 50000)
      }
    }
  }
}`;

interface PageEdge {
  node: {
    frontmatter: Record<string, unknown>;
    fields: Record<string, unknown>;
    [key: string]: unknown;
  };
}

const flatten = (arr: PageEdge[]) =>
  arr.map(({ node: { frontmatter, fields, ...rest } }) => ({
    ...frontmatter,
    ...fields,
    ...rest,
  }));

const settings = { attributesToSnippet: [`excerpt:20`] };

const indexName = config.header.search ? config.header.search.indexName : '';

const queries = [
  {
    query: pageQuery,
    transformer: ({ data }: { data: { pages: { edges: PageEdge[] } } }) =>
      flatten(data.pages.edges),
    indexName: `${indexName}`,
    settings,
  },
];

export default queries;
