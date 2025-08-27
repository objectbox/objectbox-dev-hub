import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'ObjectBox for Embedded AI, Mobile AI, Edge AI & Offline-First Apps',
  tagline: 'How to use ObjectBox for Edge AI, Mobile AI, Embedded AI, and Offline Apps with real-time sync in any setting.',
  favicon: 'img/favicon.ico',

  url: 'https://dev.objectbox.io',
  baseUrl: '/',

  organizationName: 'objectbox', 
  projectName: 'objectbox-dev-site',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  themes: [
    [
     '@easyops-cn/docusaurus-search-local',
    {
      hashed: true,
      language: ['en'],
      highlightSearchTermsOnTargetPage: true,
      explicitSearchResultPath: false,
      indexDocs: true,
      indexBlog: false,
      indexPages: true,
      docsRouteBasePath: '/',
      searchResultLimits: 8,
      searchResultContextMaxLength: 50,
      ignoreFiles: [],
    },
    ],
  ],

 presets: [
  [
    'classic',
    {
      docs: {
        routeBasePath: '/',
        sidebarPath: require.resolve('./sidebars.ts' ),
        editUrl: 'https://github.com/objectbox/objectbox-dev-site/blob/main/', //needs changing!
      },
      blog: false,
      theme: {
        customCss: [
          require.resolve('./src/css/custom.css' ),
        ],
      },
      sitemap: {           
        lastmod: 'date',
        changefreq: 'weekly',
        priority: 0.5,
        filename: 'sitemap.xml',
      },
      gtag: {                    
        trackingID: 'G-XXXXXXXXXX', //needs changing!
        anonymizeIP: true,
      },
    } satisfies Preset.Options,
  ],
],

  themeConfig: {
    image: 'img/objectbox-social-card.jpg',
    navbar: {
      title: 'How to use ObjectBox for Edge AI, Mobile AI, Embedded AI, and Offline Apps with real-time sync in any setting',
      logo: {
        alt: 'ObjectBox Logo',
        src: 'img/objectbox-logo.jpg',
        srcDark: 'img/objectbox-logo-dm.png',
      },
      items: [
        {
          href: 'https://docs.objectbox.io',
          label: 'Main Docs',
          position: 'right',
        },
        {
          href: 'https://objectbox.io/blog/',
          label: 'Blog',
          position: 'right',
        },
        {
          href: 'https://github.com/objectbox',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    copyright: `© ${new Date( ).getFullYear()} ObjectBox`,
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: [
        'bash', 'javascript', 'typescript', 'json',
        'swift', 'kotlin', 'java', 'python', 
        'dart', 'go', 'c', 'cpp', 'csharp', 'rust',
        'php', 'ruby', 'groovy'
      ],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
