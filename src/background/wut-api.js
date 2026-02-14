// Acronym Tooltip — WUT API (Service Worker module)
// Fetches definitions from WUT using the intern GraphQL API.
// Uses credentials: 'include' to authenticate with the user's internalfb session.

import { cacheGet, cacheSet } from './cache.js';

/**
 * Look up definitions for a term from WUT.
 * Returns an array of { definition, upvote_count, downvote_count } or empty array.
 */
export async function lookupWut(term) {
  // Check cache first
  const cacheKey = `wut:${term}`;
  const cached = await cacheGet(cacheKey);
  if (cached) return cached;

  try {
    // Try the detailed query first (individual definitions with vote counts)
    let definitions = await fetchWutDetailed(term);

    // Fallback to the simple query if detailed fails
    if (definitions === null) {
      definitions = await fetchWutSimple(term);
    }

    const result = definitions || [];
    await cacheSet(cacheKey, result, 'wut');
    return result;
  } catch (e) {
    console.warn('[AcronymTooltip] WUT lookup failed:', e);
    return [];
  }
}

// ── Detailed query: wut_definitions_by_word ─────────────────────────────────
// Returns individual definitions with vote counts, sorted by votes.

async function fetchWutDetailed(term) {
  const query = `query WutDetailedLookup($word: String!) {
    wut_definitions_by_word(word: $word) {
      definition
      upvote_count
      downvote_count
    }
  }`;

  try {
    const data = await graphqlFetch(query, { word: term });
    const defs = data?.wut_definitions_by_word;

    if (!defs || defs.length === 0) return [];

    return defs
      .filter(d => d.definition && d.definition.length > 0)
      .map(d => ({
        definition: d.definition,
        upvote_count: d.upvote_count || 0,
        downvote_count: d.downvote_count || 0,
      }))
      .sort((a, b) => (b.upvote_count || 0) - (a.upvote_count || 0));
  } catch (e) {
    console.warn('[AcronymTooltip] Detailed WUT query failed:', e);
    return null; // signal to try fallback
  }
}

// ── Simple query: wut_definition ────────────────────────────────────────────
// Returns the top definition + all definitions as strings (no vote counts).
// Used by the Wiki hovercard — stable and lightweight.

async function fetchWutSimple(term) {
  const query = `query WutSimpleLookup($word: String!) {
    wut_definition(word: $word) {
      definition
      definitions
    }
  }`;

  try {
    const data = await graphqlFetch(query, { word: term });
    const result = data?.wut_definition;

    if (!result) return [];

    // Check for the "no definition" sentinel
    if (result.definition === 'No definition found.' || !result.definitions?.length) {
      return [];
    }

    return result.definitions
      .filter(d => d && d.length > 0 && d !== 'No definition found.')
      .map(d => ({
        definition: d,
        upvote_count: 0,
        downvote_count: 0,
      }));
  } catch (e) {
    console.warn('[AcronymTooltip] Simple WUT query failed:', e);
    return [];
  }
}

// ── GraphQL fetch helper ────────────────────────────────────────────────────

async function graphqlFetch(query, variables) {
  const resp = await fetch('https://www.internalfb.com/intern/api/graphql/', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      q: query,
      query_params: JSON.stringify(variables),
    }),
  });

  if (!resp.ok) {
    throw new Error(`GraphQL fetch failed: ${resp.status}`);
  }

  const text = await resp.text();

  // Strip the "for (;;);" anti-hijacking prefix if present
  const cleaned = text.replace(/^for\s*\(;;\);?\s*/, '');
  const json = JSON.parse(cleaned);

  if (json.errors && json.errors.length > 0) {
    console.warn('[AcronymTooltip] GraphQL errors:', json.errors);
  }

  return json.data || null;
}
