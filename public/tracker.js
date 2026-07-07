/**
 * Xilos Docs — Page View Tracker
 * 
 * Fires on initial page load and on client-side route changes (Nextra uses
 * Next.js App Router navigation). Sends page view data to /api/docs-track
 * which proxies to the Xilos API analytics endpoint.
 * 
 * Session ID is persisted in localStorage to group page views by session.
 */

(function () {
  "use strict";

  var XILOS_API_URL = "https://api.xilos.ai";

  // Get or create a session ID
  function getSessionId() {
    var key = "xilos_docs_session";
    var sid = localStorage.getItem(key);
    if (!sid) {
      sid = "sess_" + Date.now() + "_" + Math.random().toString(36).slice(2, 10);
      localStorage.setItem(key, sid);
    }
    return sid;
  }

  // Track a page view
  function trackPageView() {
    var data = {
      page_path: window.location.pathname,
      page_title: document.title,
      referrer: document.referrer || undefined,
      session_id: getSessionId(),
    };

    // Use sendBeacon for reliability (works even if page is closing)
    if (navigator.sendBeacon) {
      var blob = new Blob([JSON.stringify(data)], {
        type: "application/json",
      });
      navigator.sendBeacon("/api/docs-track", blob);
    } else {
      // Fallback to fetch
      fetch("/api/docs-track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        keepalive: true,
      }).catch(function () {});
    }
  }

  // Track initial page view
  trackPageView();

  // Track on client-side navigation (Next.js/Nextra route changes)
  var lastUrl = window.location.href;
  var observer = new MutationObserver(function () {
    if (window.location.href !== lastUrl) {
      lastUrl = window.location.href;
      // Small delay to let the page title update
      setTimeout(trackPageView, 100);
    }
  });
  observer.observe(document, { subtree: true, childList: true });

  // Also listen to popstate for back/forward navigation
  window.addEventListener("popstate", function () {
    setTimeout(trackPageView, 100);
  });
})();
