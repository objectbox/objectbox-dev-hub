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


  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'ObjectBox C/C++',
      logo: {
        alt: 'ObjectBox Logo',
        src: 'img/objectbox-logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docs',      // this must match your sidebars.ts export
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://github.com/objectbox/objectbox-c-cpp-docs',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Installation',
              to: '/installation',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              href: 'https://github.com/objectbox/objectbox-c-cpp-docs',
              label: 'GitHub',
            },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} ObjectBox`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['cmake', 'bash', 'c', 'cpp'],
    },

  } satisfies Preset.ThemeConfig,
};

export default config;
