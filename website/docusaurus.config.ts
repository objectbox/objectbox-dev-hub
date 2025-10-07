import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'ObjectBox for Embedded AI, Mobile AI, Edge AI & Offline-First Apps',
  tagline: 'Dev-TidBits around Edge AI, Databases, Data Sync',
  favicon: 'img/favicon.ico',

  url: ' https://objectbox.io',
  baseUrl: '/dev-how-to/',

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
          sidebarPath: require.resolve('./sidebars.ts'),
          editUrl: 'https://github.com/objectbox/objectbox-dev-hub/edit/mdx/website/docs/',

        },
        blog: false,
        theme: {
          customCss: [require.resolve('./src/css/custom.css')],
        },
        sitemap: {
          lastmod: 'date',
          changefreq: 'weekly',
          priority: 0.5,
          filename: 'sitemap.xml',
        },
        gtag: {
          trackingID: 'G-73JHY4DBKQ', 
          anonymizeIP: true,
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/objectbox-social-card.jpg',
    navbar: {
      title: 'Dev TidBits and How-tos around Edge AI, Databases, Data Sync',
      logo: {
        alt: 'ObjectBox Logo',
        src: 'img/objectbox-logo-rect.jpg',
        srcDark: 'img/objectbox-logo-dm.png',
      },
      items: [
        { href: 'https://docs.objectbox.io', label: 'Main Docs', position: 'right' },
        { href: 'https://objectbox.io/blog/', label: 'Blog', position: 'right' },
        { href: 'https://github.com/objectbox', label: 'GitHub', position: 'right' },
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: [
        'bash', 'javascript', 'typescript', 'json',
        'swift', 'kotlin', 'java', 'python',
        'dart', 'go', 'c', 'cpp', 'csharp', 'rust',
        'php', 'ruby', 'groovy',
      ],
    },
  } satisfies Preset.ThemeConfig,

  // ✅ Add site-wide scripts here (e.g., GA4 search logging)
  scripts: [{ src: '/js/search-analytics.js', async: true }],
};

export default config;
