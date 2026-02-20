// Options page script — manages API key, dismissed terms, cache, and appearance

document.addEventListener('DOMContentLoaded', async () => {
  const apiKeyInput = document.getElementById('api-key-input');
  const saveKeyBtn = document.getElementById('save-key-btn');
  const clearKeyBtn = document.getElementById('clear-key-btn');
  const keyStatus = document.getElementById('key-status');
  const dismissedList = document.getElementById('dismissed-list');
  const tooltipDelay = document.getElementById('tooltip-delay');
  const delayValue = document.getElementById('delay-value');
  const clearCacheBtn = document.getElementById('clear-cache-btn');
  const cacheStatus = document.getElementById('cache-status');

  // ── API Key ───────────────────────────────────────────────────────────────

  // Load existing key (show masked)
  try {
    const result = await chrome.storage.sync.get('apeApiKey');
    if (result.apeApiKey) {
      apiKeyInput.placeholder = 'API key saved (enter new key to replace)';
    }
  } catch (e) {
    // ignore
  }

  saveKeyBtn.addEventListener('click', async () => {
    const key = apiKeyInput.value.trim();
    if (!key) {
      showStatus(keyStatus, 'Please enter an API key.', 'error');
      return;
    }

    try {
      await chrome.storage.sync.set({ apeApiKey: key });
      apiKeyInput.value = '';
      apiKeyInput.placeholder = 'API key saved (enter new key to replace)';
      showStatus(keyStatus, 'API key saved.', 'success');
    } catch (e) {
      showStatus(keyStatus, 'Failed to save API key.', 'error');
    }
  });

  clearKeyBtn.addEventListener('click', async () => {
    try {
      await chrome.storage.sync.remove('apeApiKey');
      apiKeyInput.value = '';
      apiKeyInput.placeholder = 'Paste your APE API key...';
      showStatus(keyStatus, 'API key cleared.', 'success');
    } catch (e) {
      showStatus(keyStatus, 'Failed to clear API key.', 'error');
    }
  });

  // ── Dismissed Terms ───────────────────────────────────────────────────────

  async function loadDismissed() {
    try {
      const result = await chrome.storage.sync.get('dismissedTerms');
      const terms = result.dismissedTerms || [];

      if (terms.length === 0) {
        dismissedList.innerHTML = '<p class="empty-state">No dismissed terms.</p>';
        return;
      }

      dismissedList.innerHTML = terms
        .sort()
        .map(term => `
          <span class="dismissed-chip">
            ${escapeHtml(term)}
            <button data-term="${escapeHtml(term)}" title="Re-enable">&times;</button>
          </span>
        `)
        .join('');

      // Re-enable handlers
      for (const btn of dismissedList.querySelectorAll('button')) {
        btn.addEventListener('click', async () => {
          const term = btn.dataset.term;
          const result = await chrome.storage.sync.get('dismissedTerms');
          const terms = (result.dismissedTerms || []).filter(t => t !== term);
          await chrome.storage.sync.set({ dismissedTerms: terms });
          loadDismissed();
        });
      }
    } catch (e) {
      dismissedList.innerHTML = '<p class="empty-state">Failed to load dismissed terms.</p>';
    }
  }

  loadDismissed();

  // Listen for changes from other contexts (content script dismissals)
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.dismissedTerms) {
      loadDismissed();
    }
  });

  // ── Appearance ────────────────────────────────────────────────────────────

  // Load saved delay
  try {
    const result = await chrome.storage.sync.get('tooltipDelay');
    if (result.tooltipDelay !== undefined) {
      tooltipDelay.value = result.tooltipDelay;
      delayValue.textContent = `${result.tooltipDelay}ms`;
    }
  } catch (e) {
    // use default
  }

  tooltipDelay.addEventListener('input', async () => {
    const val = parseInt(tooltipDelay.value, 10);
    delayValue.textContent = `${val}ms`;
    try {
      await chrome.storage.sync.set({ tooltipDelay: val });
    } catch (e) {
      // ignore
    }
  });

  // ── Cache ─────────────────────────────────────────────────────────────────

  clearCacheBtn.addEventListener('click', async () => {
    try {
      await chrome.runtime.sendMessage({ type: 'clearCache' });
      showStatus(cacheStatus, 'Cache cleared.', 'success');
    } catch (e) {
      showStatus(cacheStatus, 'Failed to clear cache.', 'error');
    }
  });

  // ── Helpers ───────────────────────────────────────────────────────────────

  function showStatus(el, message, type) {
    el.textContent = message;
    el.className = `status-msg ${type}`;
    setTimeout(() => {
      el.textContent = '';
      el.className = 'status-msg';
    }, 3000);
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
});
