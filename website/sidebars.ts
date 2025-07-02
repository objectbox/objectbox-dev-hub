import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'installation',
        'getting-started',
      ],
    },
    {
      type: 'category',
      label: 'Core Concepts',
      items: [
        'generator',
        'dev-tools-and-debugging',
        'entity-annotations',
        'queries',
        'relations',
      ],
    },
    {
      type: 'category',
      label: 'Advanced',
      items: [
        'schema-changes',
        'store',
        'time-series-data',
        'transactions',
      ],
    },
    'faq',
  ],
};

export default sidebars;
