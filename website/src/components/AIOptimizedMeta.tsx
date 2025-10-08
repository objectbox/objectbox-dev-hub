import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useLocation} from '@docusaurus/router';

interface AIOptimizedMetaProps {
  frontMatter: {
    title?: string;
    description?: string;
    slug?: string;
  };
}

export function AIOptimizedMeta({frontMatter}: AIOptimizedMetaProps) {
  const {siteConfig} = useDocusaurusContext();
  const location = useLocation();

  // Extract doc path from current location
  const docPath = location.pathname.replace(siteConfig.baseUrl || '/', '');

  // GitHub raw URL for this specific document
  const githubRawUrl = `https://raw.githubusercontent.com/objectbox/objectbox-dev-hub/mdx/website/docs/${docPath}.mdx`;

  // Our API endpoint
  const apiRawUrl = `${siteConfig.url}${siteConfig.baseUrl}api/raw?path=${encodeURIComponent(docPath)}`;

  return (
    <Head>
      {/* AI-specific meta tags */}
      <meta name="ai:raw-content" content={githubRawUrl} />
      <meta name="ai:api-endpoint" content={apiRawUrl} />
      <meta name="ai:token-savings" content="~10x" />
      <meta name="ai:content-type" content="markdown" />

      {/* Link headers for AI discovery */}
      <link rel="alternate" type="text/markdown" href={githubRawUrl} title="Raw Markdown (AI Optimized)" />
    </Head>
  );
}

export default AIOptimizedMeta;