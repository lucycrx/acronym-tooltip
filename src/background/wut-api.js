// Acronym Tooltip — WUT API (Service Worker module)
// Fetches definitions from WUT by scraping the word page HTML.
// The page embeds structured JSON objects that we extract with regex.

import { cacheGet, cacheSet } from './cache.js';

/**
 * Look up definitions for a term from WUT.
 * Returns an array of { definition, upvote_count, downvote_count } or empty array.
 */
export async function lookupWut(term) {
  console.log('[AcronymTooltip][BG-WUT] Looking up term:', term);

  // Check cache first
  const cacheKey = `wut:${term}`;
  const cached = await cacheGet(cacheKey);
  if (cached) {
    console.log('[AcronymTooltip][BG-WUT] Cache hit for:', term);
    return cached;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const resp = await fetch(
      `https://www.internalfb.com/intern/wut/word/?word=${encodeURIComponent(term)}`,
      { credentials: 'include', signal: controller.signal },
    );

    clearTimeout(timeoutId);

    if (!resp.ok) {
      console.warn('[AcronymTooltip][BG-WUT] WUT page fetch failed:', resp.status);
      return [];
    }

    const html = await resp.text();
    const definitions = parseDefinitions(html, term);
    console.log('[AcronymTooltip][BG-WUT] Parsed', definitions.length, 'definitions for:', term);

    await cacheSet(cacheKey, definitions, 'wut');
    return definitions;
  } catch (e) {
    console.warn('[AcronymTooltip][BG-WUT] WUT lookup failed:', e);
    return [];
  }
}

/**
 * Parse WUT definitions from page HTML.
 * The page embeds JSON objects in JS calls like:
 *   {"id":69934,"Word":"maiba","Definition":"Meta AI Business Assistant","Author":571165424,"CreatedTime":1729855936}
 * Each definition appears twice (initShareableLink + initDelete), so we deduplicate by id.
 */
function parseDefinitions(html, term) {
  const regex = /"id":(\d+),"Word":"([^"]+)","Definition":"((?:[^"\\]|\\.)*)","Author":(\d+),"CreatedTime":(\d+)/g;
  const seen = new Set();
  const results = [];
  let match;

  while ((match = regex.exec(html)) !== null) {
    const [, id, word, definition] = match;

    // Only include definitions for the requested word (case-insensitive)
    if (word.toLowerCase() !== term.toLowerCase()) continue;

    // Deduplicate by id
    if (seen.has(id)) continue;
    seen.add(id);

    // Unescape JSON string escapes
    const unescaped = definition.replace(/\\(.)/g, (_, c) => {
      if (c === '/') return '/';
      if (c === 'n') return '\n';
      if (c === '"') return '"';
      if (c === '\\') return '\\';
      return c;
    });

    results.push({
      definition: unescaped,
      upvote_count: 0,
      downvote_count: 0,
    });
  }

  return results;
}
