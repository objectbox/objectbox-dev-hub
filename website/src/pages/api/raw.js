// AI User-Agents that should receive raw markdown
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

export default function handler(req, res) {
  const userAgent = req.headers['user-agent'] || '';
  const { path: docPath } = req.query;

  // Only serve raw markdown to AI tools
  if (!isAIUserAgent(userAgent)) {
    return res.status(403).json({
      error: 'This endpoint is optimized for AI tools. Please visit the main site.'
    });
  }

  if (!docPath) {
    return res.status(400).json({ error: 'Path parameter required' });
  }

  // Map common paths to GitHub raw URLs
  const githubBaseUrl = 'https://raw.githubusercontent.com/objectbox/objectbox-dev-hub/mdx/website/docs';

  // Handle different path formats
  let githubPath = docPath;
  if (!githubPath.endsWith('.mdx')) {
    githubPath += '.mdx';
  }

  const rawUrl = `${githubBaseUrl}/${githubPath}`;

  // Set headers indicating this is optimized for AI
  res.setHeader('X-Content-Optimized-For', 'AI-Tools');
  res.setHeader('X-Token-Savings', '~10x');
  res.setHeader('X-Source', 'GitHub-Raw');

  // Redirect to the raw GitHub file
  return res.redirect(302, rawUrl);
}