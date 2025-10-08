const AI_USER_AGENTS = [
  'GPTBot',
  'Claude-Web',
  'ClaudeBot',
  'ChatGPT-User',
  'CCBot',
  'PerplexityBot',
  'Claude Code',
  'anthropic-ai',
  'openai'
];

function isAIUserAgent(userAgent) {
  if (!userAgent) return false;
  return AI_USER_AGENTS.some(agent =>
    userAgent.toLowerCase().includes(agent.toLowerCase())
  );
}

module.exports = function aiMarkdownPlugin(context, options) {
  return {
    name: 'ai-markdown-plugin',

    configureWebpack(config, isServer) {
      if (!isServer) return {};

      return {
        plugins: [],
      };
    },

    async contentLoaded({content, actions}) {
      // This plugin sets up the infrastructure for AI markdown serving
    },

    async postBuild({siteConfig, routesPaths, outDir}) {
      // We could generate a sitemap specifically for AI tools here
    },

    // Add middleware for Express server
    getPathsToWatch() {
      return ['docs/**/*.mdx'];
    },

    // This would be used in a custom server setup
    expressMiddleware(app) {
      app.use((req, res, next) => {
        const userAgent = req.headers['user-agent'] || '';

        // Check if this is an AI tool accessing a doc page
        if (isAIUserAgent(userAgent) && req.path.startsWith('/dev-how-to/')) {
          // Extract the doc path
          const docPath = req.path.replace('/dev-how-to/', '');

          // Redirect to markdown API
          const markdownUrl = `/api/markdown?path=${encodeURIComponent(docPath)}`;
          return res.redirect(302, markdownUrl);
        }

        next();
      });
    }
  };
};