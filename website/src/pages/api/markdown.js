import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// AI User-Agents that should receive markdown
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

function getMarkdownContent(docPath) {
  try {
    const docsDir = path.join(process.cwd(), 'docs');
    const filePath = path.join(docsDir, `${docPath}.mdx`);

    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data: frontmatter, content } = matter(fileContent);

    // Return structured markdown with frontmatter
    return {
      title: frontmatter.title,
      description: frontmatter.description,
      tags: frontmatter.tags || frontmatter.keywords,
      content: content,
      lastModified: fs.statSync(filePath).mtime
    };
  } catch (error) {
    console.error('Error reading markdown:', error);
    return null;
  }
}

export default function handler(req, res) {
  const userAgent = req.headers['user-agent'] || '';
  const { path: docPath } = req.query;

  // Only serve markdown to AI tools
  if (!isAIUserAgent(userAgent)) {
    return res.status(403).json({
      error: 'This endpoint is optimized for AI tools. Please visit the main site.'
    });
  }

  if (!docPath) {
    return res.status(400).json({ error: 'Path parameter required' });
  }

  const markdownData = getMarkdownContent(docPath);

  if (!markdownData) {
    return res.status(404).json({ error: 'Document not found' });
  }

  // Set appropriate headers
  res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
  res.setHeader('X-Content-Optimized-For', 'AI-Tools');
  res.setHeader('X-Token-Savings', '~10x');

  // Return clean markdown
  const response = `---
title: ${markdownData.title}
description: ${markdownData.description}
tags: ${JSON.stringify(markdownData.tags)}
lastModified: ${markdownData.lastModified}
---

${markdownData.content}`;

  return res.status(200).send(response);
}