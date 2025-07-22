import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'C/C++ docs for ObjectBox Database',
  tagline: 'Max speed with minimal resource use',
  favicon: 'img/favicon.ico',

  url: 'https://cpp.objectbox.io',
    /*baseUrl: '/',*/
  baseUrl: '/',

  organizationName: 'objectbox', 
  projectName: 'objectbox-c-cpp-docs',

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
      explicitSearchResultPath: false,  // Changed from true - this can cause 404s
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
      sitemap: {           
        lastmod: 'date',
        changefreq: 'weekly',
        priority: 0.5,
        filename: 'sitemap.xml',
      },
      gtag: {                    
        trackingID: 'G-2LXKBNQ3TW',
        anonymizeIP: true,
      },
    } satisfies Preset.Options,
  ],
],



  themeConfig: {
    image: 'img/objectbox-social-card.jpg',
    navbar: {
      title: 'C / C++ Docs',
      logo: {
        alt: 'ObjectBox Logo',
        src: 'img/objectbox-logo.jpg', // Logo for light mode
        srcDark: 'img/objectbox-logo-dm.png', // Logo for dark mode
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
          label: 'Data Sync Docs', 
          position: 'right',
          //  target: '_self', // ← This prevents external link behavior
        },
        {
          href: 'https://objectbox.io/blog/',
          label: 'Blog',
          position: 'right',
          //target: '_self', // ← This prevents external link behavior
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
