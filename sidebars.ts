import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    'README', // The main landing page for the docs section
    {
      type: 'category',
      label: 'Core Concepts',
      items: [
        'data-modeling-offline-first-apps',
        'transactions',
      ],
    },
    {
      type: 'category',
      label: 'API Facts',
      items: [
        'box-get-method',
        'box-put-method',
        'box-remove-method',
      ],
    },
    {
      type: 'category',
      label: 'Migration',
      items: [
        'realm-to-objectbox-migration',
        'realm-to-objectbox-api-mapping',
        'technical-realm-vs-object-box-audit',
      ],
    },
    {
      type: 'category',
      label: 'Edge AI Use Cases',
      items: [
        'on-device-vector-database-sync',
      ],
    },
  ],
};

export default sidebars;