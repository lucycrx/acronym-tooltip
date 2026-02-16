// Popup script — handles search, recent lookups, and site toggle

document.addEventListener('DOMContentLoaded', async () => {
  const searchInput = document.getElementById('search-input');
  const resultArea = document.getElementById('result-area');
  const recentList = document.getElementById('recent-list');
  const siteToggle = document.getElementById('site-toggle');
  const openOptions = document.getElementById('open-options');

  // ── Site toggle ───────────────────────────────────────────────────────────

  // Get the current tab's hostname
  let currentHostname = '';
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url) {
      currentHostname = new URL(tab.url).hostname;
    }
  } catch (e) {
    // ignore
  }

  // Load disabled sites
  try {
    const result = await chrome.storage.sync.get('disabledSites');
    const disabled = new Set(result.disabledSites || []);
    siteToggle.checked = !disabled.has(currentHostname);
  } catch (e) {
    // default to enabled
  }

  siteToggle.addEventListener('change', async () => {
    try {
      const result = await chrome.storage.sync.get('disabledSites');
      const disabled = new Set(result.disabledSites || []);

      if (siteToggle.checked) {
        disabled.delete(currentHostname);
      } else {
        disabled.add(currentHostname);
      }

      await chrome.storage.sync.set({ disabledSites: Array.from(disabled) });
    } catch (e) {
      // ignore
    }
  });

  // ── Search ────────────────────────────────────────────────────────────────

  let searchTimeout = null;

  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    const term = searchInput.value.trim().toUpperCase();

    if (!term || term.length < 2) {
      resultArea.style.display = 'none';
      return;
    }

    searchTimeout = setTimeout(() => {
      performSearch(term);
    }, 300);
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      clearTimeout(searchTimeout);
      const term = searchInput.value.trim().toUpperCase();
      if (term && term.length >= 2) {
        performSearch(term);
      }
    }
  });

  async function performSearch(term) {
    resultArea.style.display = 'block';
    resultArea.innerHTML = '<div class="result-loading">Looking up...</div>';

    try {
      const response = await chrome.runtime.sendMessage({
        type: 'manualLookup',
        term,
      });

      if (!response || response.error) {
        resultArea.innerHTML = `<div class="result-error">${response?.error || 'Lookup failed'}</div>`;
        return;
      }

      renderResult(response);
      loadRecent(); // refresh the list
    } catch (e) {
      resultArea.innerHTML = '<div class="result-error">Extension error</div>';
    }
  }

  function renderResult(data) {
    const { term, definitions, source, aiDefinition } = data;
    const isAI = source === 'ai';
    const hasDefs = definitions && definitions.length > 0;

    let html = `
      <div class="result-term">
        ${escapeHtml(term)}
        <span class="result-badge ${isAI ? 'result-badge--ai' : ''}">${isAI ? 'AI-generated' : 'WUT'}</span>
      </div>
    `;

    if (isAI && aiDefinition) {
      html += `<div class="result-def">${escapeHtml(aiDefinition)}</div>`;
    } else if (hasDefs) {
      html += `<div class="result-def">${escapeHtml(definitions[0].definition)}</div>`;
      html += `<div class="result-votes">&#9650; ${definitions[0].upvote_count || 0}</div>`;

      const others = definitions.slice(1, 4);
      if (others.length > 0) {
        html += '<div class="result-other">';
        html += `<div class="result-other-title">Other definitions (${others.length})</div>`;
        for (const def of others) {
          html += `<div class="result-other-def">${escapeHtml(def.definition)} <span style="color:#a1a1aa;">&#9650; ${def.upvote_count || 0}</span></div>`;
        }
        html += '</div>';
      }
    } else if (source === 'none') {
      html += '<div class="result-error">No definitions found.</div>';
    }

    html += `<a class="result-link" href="https://www.internalfb.com/intern/wut/word/?word=${encodeURIComponent(term)}" target="_blank">${isAI ? 'Define it &#8594;' : 'View on WUT &#8594;'}</a>`;

    resultArea.innerHTML = html;
  }

  // ── Recent lookups ────────────────────────────────────────────────────────

  async function loadRecent() {
    try {
      const result = await chrome.storage.local.get('recentLookups');
      const recent = result.recentLookups || [];

      if (recent.length === 0) {
        recentList.innerHTML = '<p class="empty-state">No recent lookups yet.</p>';
        return;
      }

      recentList.innerHTML = recent
        .slice(0, 10)
        .map(term => `<a class="recent-chip" data-term="${escapeHtml(term)}">${escapeHtml(term)}</a>`)
        .join('');

      // Click handler for chips
      for (const chip of recentList.querySelectorAll('.recent-chip')) {
        chip.addEventListener('click', (e) => {
          e.preventDefault();
          const t = chip.dataset.term;
          searchInput.value = t;
          performSearch(t);
        });
      }
    } catch (e) {
      recentList.innerHTML = '<p class="empty-state">No recent lookups yet.</p>';
    }
  }

  loadRecent();

  // ── Options link ──────────────────────────────────────────────────────────

  openOptions.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });

  // ── Helpers ───────────────────────────────────────────────────────────────

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Focus the search input on open
  searchInput.focus();
});
