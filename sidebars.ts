import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    'README', // The main landing page for the docs section
    {
      type: 'category',
      label: 'Core Concepts',
      items: [
        'data-modeling-offline-first-apps',
      ],
    },
    {
      type: 'category',
      label: 'API Facts',
      items: [
        'box-get-method',
        'box-put-method',
        'box-remove-method',
        'transactions',
        'data-sync-cpp-getting-started',
      ],
    },
    {
      type: 'category',
      label: 'Migration',
      items: [
        'realm-to-objectbox-migration',
        'realm-to-objectbox-api-mapping',
        'technical-realm-vs-object-box-audit',
        {
          type: 'doc',
          id: 'mongodb-atlas-objectbox-sync-quickstart-production-notes',
          label: 'MongoDB Data Sync tutorial',
        },
      ],
    },
    {
      type: 'category',
      label: 'Edge AI Use Cases',
      items: [
        'edge-computing-edge-ai-local-ai-marketanalysis',
        'on-device-vector-database-sync',
        'on-device-ai-goes-mainstream',
      ],
    },
  ],
};

export default sidebars;