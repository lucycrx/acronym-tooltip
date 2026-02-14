// Acronym Tooltip — Cache Layer (Service Worker module)
// Provides get/set with TTL for definition lookups and DTSG tokens.

const CACHE_STORAGE_KEY = 'act_cache';

const TTL = {
  wut: 24 * 60 * 60 * 1000,  // 24 hours
  ai: 4 * 60 * 60 * 1000,    // 4 hours
  dtsg: 60 * 60 * 1000,      // 1 hour
};

/**
 * Get a cached entry if it exists and hasn't expired.
 * @param {string} key - Cache key (e.g., 'def:XFN' or 'dtsg')
 * @returns {Promise<any|null>} Cached value or null
 */
export async function cacheGet(key) {
  try {
    const result = await chrome.storage.local.get(CACHE_STORAGE_KEY);
    const cache = result[CACHE_STORAGE_KEY] || {};
    const entry = cache[key];
    if (!entry) return null;
    if (Date.now() > entry.expiry) {
      // Expired — clean up
      delete cache[key];
      await chrome.storage.local.set({ [CACHE_STORAGE_KEY]: cache });
      return null;
    }
    return entry.value;
  } catch (e) {
    return null;
  }
}

/**
 * Set a cache entry with a TTL category.
 * @param {string} key - Cache key
 * @param {any} value - Value to cache
 * @param {'wut'|'ai'|'dtsg'} ttlType - TTL category
 */
export async function cacheSet(key, value, ttlType) {
  try {
    const result = await chrome.storage.local.get(CACHE_STORAGE_KEY);
    const cache = result[CACHE_STORAGE_KEY] || {};
    cache[key] = {
      value,
      expiry: Date.now() + (TTL[ttlType] || TTL.wut),
    };
    await chrome.storage.local.set({ [CACHE_STORAGE_KEY]: cache });
  } catch (e) {
    console.warn('[AcronymTooltip] Cache write failed:', e);
  }
}

/**
 * Clear all cached data.
 */
export async function cacheClear() {
  try {
    await chrome.storage.local.remove(CACHE_STORAGE_KEY);
  } catch (e) {
    // ignore
  }
}
