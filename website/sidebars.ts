import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.
 */
const sidebars: SidebarsConfig = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  // To achieve the desired structure, we define it manually.
  docs: [
    {
      type: 'doc',
      id: 'README',
      label: 'ObjectBox C / C++ Database', // Clean label
    },
    {
      type: 'doc', 
      id: 'installation',
      label: 'Installation', // Clean label
    },
    {
      type: 'doc',
      id: 'getting-started', 
      label: 'Getting Started', // Clean label
    },
    {
      type: 'doc',
      id: 'entity-annotations',
      label: 'Entity Annotations', // Clean label
    },
    {
      type: 'doc',
      id: 'generator',
      label: 'Generator', // Clean label
    },
    {
      type: 'doc',
      id: 'store',
      label: 'Store', // Clean label
    },
    {
      type: 'doc',
      id: 'queries',
      label: 'Queries', // Clean label
    },
    {
      type: 'doc',
      id: 'relations',
      label: 'Relations', // Clean label
    },
    {
      type: 'doc',
      id: 'transactions',
      label: 'Transactions', // Clean label
    },
    {
      type: 'doc',
      id: 'schema-changes',
      label: 'Schema Changes', // Clean label
    },
    {
      type: 'doc',
      id: 'time-series-data',
      label: 'Time Series Data', // Clean label
    },
    {
      type: 'doc',
      id: 'dev-tools-and-debugging',
      label: 'Dev Tools and Debugging', // Clean label
    },
    {
      type: 'doc',
      id: 'faq',
      label: 'FAQ', // Clean label
    },
    // --- External Links Section ---
    {
      type: 'html',
      value: '<hr class="sidebar-divider">', // Optional: Adds a visual separator
    },
    {
      type: 'link',
      label: 'GitHub',
      href: 'https://github.com/objectbox/objectbox-c',
    },
    {
      type: 'link',
      label: 'ObjectBox Generator',
      href: 'https://github.com/objectbox/objectbox-generator',
    },
    {
      type: 'link',
      label: 'C API docs',
      href: 'https://objectbox.io/docfiles/c/current/',
    },
    {
      type: 'html',
      value: '<hr class="sidebar-divider">', // Optional: Adds a visual separator
    },
    {
      type: 'link',
      label: 'Golang Database',
      href: 'https://golang.objectbox.io/',
    },
    {
      type: 'link',
      label: 'Swift Database',
      href: 'https://swift.objectbox.io/',
    },
    {
        type: 'link',
        label: 'Java Database',
        href: 'https://docs.objectbox.io/',
      },
  ],
};

export default sidebars;
