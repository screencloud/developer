const config = {
  gatsby: {
    pathPrefix: '/developer',
    siteUrl: 'http://screencloud.github.io/',
    gaTrackingId: null,
    trailingSlash: false,
  },
  header: {
    githubUrl: 'https://github.com/screencloud/developer',
    helpUrl: 'https://github.com/screencloud/developer/issues',
    links: [{ text: '', link: '' }],
    search: {
      enabled: false,
      indexName: '',
      algoliaAppId: process.env.GATSBY_ALGOLIA_APP_ID,
      algoliaSearchKey: process.env.GATSBY_ALGOLIA_SEARCH_KEY,
      algoliaAdminKey: process.env.ALGOLIA_ADMIN_KEY,
    },
  },
  sidebar: {
    forcedNavOrder: [
      '/introduction', // add trailing slash if enabled above
      '/codeblock',
    ],
    collapsedNav: [
      '/codeblock', // add trailing slash if enabled above
    ],
    links: [
      { text: 'Studio', link: 'https://auth.screencloud.com/login' },
      { text: 'ScreenCloud.com', link: 'https://screencloud.com' },
    ],
    frontline: true,
    ignoreIndex: true,
  },
  siteMetadata: {
    title: 'Developer | ScreenCloud',
    description: 'Develop your own Digital Signage apps easily with ScreenCloud.',
    ogImage: null,
    docsLocation: 'https://github.com/screencloud/developer/tree/master/docs/content',
    favicon: 'https://screen.cloud/static/img/favicon.png',
  },
  pwa: {
    enabled: false, // disabling this will also remove the existing service worker.
    manifest: {
      name: 'Develop on ScreenCloud',
      short_name: 'DevelopOnScreenCloud',
      start_url: '/',
      background_color: '#6b37bf',
      theme_color: '#6b37bf',
      display: 'standalone',
      crossOrigin: 'use-credentials',
      icons: [
        {
          src: 'src/pwa-512.png',
          sizes: `512x512`,
          type: `image/png`,
        },
      ],
    },
  },
};

module.exports = config;
