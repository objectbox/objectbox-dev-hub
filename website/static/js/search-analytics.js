(function () {
  // Utility: send GA4 events if gtag exists
  function sendEvent(name, params) {
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, params || {});
    }
  }

  // Detect the search input rendered by docusaurus-search-local
  function getSearchInput() {
    // Works with the default local-search theme (input[type="search"])
    return document.querySelector('input[type="search"]');
  }

  // Hook into search typing + submit/enter
  function attachSearchListeners() {
    const input = getSearchInput();
    if (!input) return;

    let lastValue = '';
    let lastResultsCount = null;

    // Fire when user presses Enter (treated as "view_search_results")
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const query = input.value.trim();
        if (!query) return;
        // send GA4 "view_search_results"
        sendEvent('view_search_results', {
          search_term: query,
        });
        // Also record if there were zero results (if we can read result container)
        // Result container is rendered after typing; we can query it shortly after.
        setTimeout(() => {
          const results = document.querySelectorAll('.searchResultItem');
          lastResultsCount = results ? results.length : null;
          if (lastResultsCount === 0) {
            sendEvent('search_no_results', { search_term: query });
          }
        }, 50);
      }
    });

    // Debounced input capture to log "search" intent (optional)
    let t;
    input.addEventListener('input', () => {
      clearTimeout(t);
      t = setTimeout(() => {
        const val = input.value.trim();
        if (val && val !== lastValue) {
          lastValue = val;
          sendEvent('search', { search_term: val });
        }
      }, 400);
    });

    // Click tracking on results (delegated)
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a');
      if (!a) return;

      // Local search results typically have a container; adjust selector if needed
      const resultItem = e.target.closest('.searchResultItem, .DocSearch-Hit'); // support both local & DocSearch
      if (resultItem) {
        const href = a.getAttribute('href') || '';
        const title =
          resultItem.querySelector('mark')?.textContent ||
          resultItem.textContent?.trim().slice(0, 120) ||
          '';
        sendEvent('select_content', {
          content_type: 'search_result',
          item_id: href,
          item_name: title,
        });
      }
    });
  }

  // Wait for hydration
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachSearchListeners);
  } else {
    attachSearchListeners();
  }
})();
