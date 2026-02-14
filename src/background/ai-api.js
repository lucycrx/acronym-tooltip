// Acronym Tooltip — AI Fallback (Service Worker module)
// Uses the Wearables APE API (OpenAI-compatible) to generate definitions
// when no WUT entry exists. Uses page context for accuracy.

import { cacheGet, cacheSet } from './cache.js';

/**
 * Generate an AI definition for a term using the APE API.
 * @param {string} term - The acronym to define
 * @param {{ surroundingText: string, pageSource: string }} context - Page context
 * @returns {Promise<string|null>} The AI-generated definition, or null on failure
 */
export async function lookupAI(term, context) {
  // Check cache
  const cacheKey = `ai:${term}`;
  const cached = await cacheGet(cacheKey);
  if (cached) return cached;

  const apiKey = await getApeApiKey();
  if (!apiKey) {
    return null; // No API key configured
  }

  try {
    const prompt = buildPrompt(term, context);

    const resp = await fetch('https://api.wearables-ape.io/models/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a concise Meta internal terminology expert. Provide brief, accurate definitions of acronyms used at Meta (Facebook). Always respond with just the definition in 1-2 sentences.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 150,
        temperature: 0.3,
      }),
    });

    if (!resp.ok) {
      console.warn('[AcronymTooltip] APE API error:', resp.status);
      return null;
    }

    const data = await resp.json();
    const definition = data.choices?.[0]?.message?.content?.trim() || null;

    if (definition) {
      await cacheSet(cacheKey, definition, 'ai');
    }

    return definition;
  } catch (e) {
    console.warn('[AcronymTooltip] AI lookup failed:', e);
    return null;
  }
}

/**
 * Build the prompt for the AI definition, incorporating page context.
 */
function buildPrompt(term, context) {
  let prompt = `Define the acronym "${term}" as used at Meta (Facebook).`;

  if (context.surroundingText) {
    prompt += `\n\nContext from the page where this acronym appears:\n"${context.surroundingText}"`;
  }

  if (context.pageSource) {
    prompt += `\n\nSource: ${context.pageSource}`;
  }

  prompt += '\n\nProvide a concise 1-2 sentence definition. If this is a well-known tech/business term rather than Meta-specific, define it in that general context.';

  return prompt;
}

/**
 * Retrieve the APE API key from extension storage.
 */
async function getApeApiKey() {
  try {
    const result = await chrome.storage.sync.get('apeApiKey');
    return result.apeApiKey || null;
  } catch (e) {
    return null;
  }
}
