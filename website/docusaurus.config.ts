import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'C/C++ docs for ObjectBox Database',
  tagline: 'Max speed with minimal resource use',
  favicon: 'img/favicon.ico',

  url: 'https://cpp.objectbox.io',
  baseUrl: '/',

  organizationName: 'objectbox', 
  projectName: 'objectbox-c-cpp-docs',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

 presets: [
  [
    'classic',
    {
      docs: {
        routeBasePath: '/',                      // serve docs at /
        sidebarPath: require.resolve('./sidebars.ts'),
        editUrl:
          'https://github.com/objectbox/objectbox-c-cpp-docs/blob/main/website/',
      },
      // If you don't need a blog, you can disable it:
      blog: false,
      theme: {
        customCss: [
          require.resolve('./src/css/custom.css'),
        ],
      },
    } satisfies Preset.Options,
  ],
],

themes: [
  [
    '@easyops-cn/docusaurus-search-local',
    {
      hashed: true,
      language: ['en'],
      highlightSearchTermsOnTargetPage: true,
      explicitSearchResultPath: true,
    },
  ],
],



  themeConfig: {
    image: 'img/objectbox-social-card.jpg',
    navbar: {
      title: 'ObjectBox C/C++',
      logo: {
        alt: 'ObjectBox Logo',
        src: 'img/objectbox-logo.jpg',
      },
      items: [
        // Right side items in the order you want them to appear:
        {
          href: 'https://objectbox.io',
          label: 'ObjectBox.io',
          position: 'right',
          //target: '_self', // ← This prevents external link behavior
        },
        {
          href: 'https://docs.objectbox.io/sync',
          label: 'Sync Docs', 
          position: 'right',
          //  target: '_self', // ← This prevents external link behavior
        },
        {
          href: 'https://twitter.com/objectbox_io',
          label: 'Follow us',
          position: 'right',
          //target: '_self', // ← This prevents external link behavior
        },
        
      ],
    },
    copyright: `© ${new Date().getFullYear()} ObjectBox`,
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: [
        'cmake', 'bash', 'c', 'cpp',
        'swift', 'kotlin', 'java', 'python', 
        'dart', 'go', 'protobuf'
      ],
    },
    

  } satisfies Preset.ThemeConfig,
};

export default config;
