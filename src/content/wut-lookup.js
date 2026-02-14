// Acronym Tooltip — WUT Lookup (Content Script)
// Fetches WUT definitions directly from the content script context,
// where the user's internalfb.com session cookies are available.
// Service workers cannot send credentialed requests to internalfb.com.

(function () {
  'use strict';

  window.__ACT = window.__ACT || {};

  // ── In-memory cache (per page load) ───────────────────────────────────────

  const wutCache = new Map();
  const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

  // ── DTSG token ────────────────────────────────────────────────────────────

  let dtsgToken = null;
  let dtsgFetchPromise = null;

  async function getDtsgToken() {
    if (dtsgToken) return dtsgToken;
    if (dtsgFetchPromise) return dtsgFetchPromise;

    dtsgFetchPromise = fetchDtsgToken();
    dtsgToken = await dtsgFetchPromise;
    dtsgFetchPromise = null;
    return dtsgToken;
  }

  async function fetchDtsgToken() {
    // Method 1: Try to extract from the page's existing DOM
    const inputEl = document.querySelector('input[name="fb_dtsg"]');
    if (inputEl && inputEl.value) {
      return inputEl.value;
    }

    // Method 2: Try to extract from meta tag or script data
    const metaEl = document.querySelector('meta[name="fb_dtsg"]');
    if (metaEl && metaEl.content) {
      return metaEl.content;
    }

    // Method 3: Fetch a lightweight page and extract the token
    try {
      const resp = await fetch('https://www.internalfb.com/intern/wut/', {
        credentials: 'include',
        headers: { 'Accept': 'text/html' },
      });
      if (!resp.ok) return null;

      const html = await resp.text();
      // Look for fb_dtsg in the HTML
      const match = html.match(/"DTSGInitialData".*?"token":"([^"]+)"/);
      if (match) return match[1];

      // Alternative pattern
      const match2 = html.match(/name="fb_dtsg"\s+value="([^"]+)"/);
      if (match2) return match2[1];
    } catch (e) {
      console.warn('[AcronymTooltip] Failed to fetch DTSG token:', e);
    }

    return null;
  }

  // ── GraphQL fetch (from content script — has cookies) ─────────────────────

  async function graphqlFetch(query, variables) {
    const dtsg = await getDtsgToken();

    const params = {
      q: query,
      query_params: JSON.stringify(variables),
    };
    if (dtsg) {
      params.fb_dtsg = dtsg;
    }

    const resp = await fetch('https://www.internalfb.com/intern/api/graphql/', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(params),
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

  // ── WUT queries ───────────────────────────────────────────────────────────

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

  // ── Public lookup function ────────────────────────────────────────────────

  async function lookupWut(term) {
    // Check in-memory cache
    const cached = wutCache.get(term);
    if (cached && Date.now() < cached.expiry) {
      return cached.value;
    }

    try {
      // Try detailed query first
      let definitions = await fetchWutDetailed(term);

      // Fallback to simple query if detailed fails
      if (definitions === null) {
        definitions = await fetchWutSimple(term);
      }

      const result = definitions || [];

      // Cache the result
      wutCache.set(term, { value: result, expiry: Date.now() + CACHE_TTL });

      return result;
    } catch (e) {
      console.warn('[AcronymTooltip] WUT lookup failed:', e);
      return [];
    }
  }

  // Expose to shared namespace
  window.__ACT.lookupWut = lookupWut;

  // Listen for messages from the service worker (e.g., popup manual lookups)
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'wutLookup' && message.term) {
      lookupWut(message.term)
        .then(sendResponse)
        .catch(() => sendResponse([]));
      return true; // async response
    }
  });
})();
