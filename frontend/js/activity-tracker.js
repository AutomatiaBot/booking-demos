/**
 * Automatia Activity Tracker
 * 
 * Tracks user activity on demo pages and sends events to the backend API.
 * Include this script on any page to enable activity tracking.
 * 
 * Usage:
 *   <script src="/js/activity-tracker.js"></script>
 *   <script>
 *     ActivityTracker.init({
 *       apiBaseUrl: 'https://us-central1-backend-471615.cloudfunctions.net/automatia-demo-dev',
 *       demoId: 'manhattan-smiles'  // optional
 *     });
 *   </script>
 */

const ActivityTracker = (function() {
  'use strict';

  // Configuration
  let config = {
    apiBaseUrl: '',  // Cloud Functions base: https://region-project.cloudfunctions.net/service-stage
    demoId: null,
    batchSize: 10,
    batchInterval: 5000,  // 5 seconds
    debug: false,
  };

  // State
  let sessionId = null;
  let token = null;
  let eventQueue = [];
  let batchTimer = null;
  let pageLoadTime = Date.now();
  let lastActivityTime = Date.now();
  let scrollDepthMax = 0;
  let isInitialized = false;

  // ============================================
  // Utility Functions
  // ============================================

  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  function log(...args) {
    if (config.debug) {
      console.log('[ActivityTracker]', ...args);
    }
  }

  function getToken() {
    // Try to get token from localStorage (set by login)
    return localStorage.getItem('automatia_token') || token;
  }

  function getSessionId() {
    if (!sessionId) {
      // Check sessionStorage for existing session
      sessionId = sessionStorage.getItem('automatia_session_id');
      if (!sessionId) {
        sessionId = generateUUID();
        sessionStorage.setItem('automatia_session_id', sessionId);
      }
    }
    return sessionId;
  }

  // ============================================
  // API Communication
  // ============================================

  async function sendEvent(eventType, data = {}) {
    const authToken = getToken();
    if (!authToken) {
      log('No auth token, skipping event:', eventType);
      return;
    }

    const event = {
      event_type: eventType,
      session_id: getSessionId(),
      page_url: window.location.href,
      demo_id: config.demoId,
      data: data,
      timestamp: new Date().toISOString(),
    };

    eventQueue.push(event);
    log('Queued event:', eventType, data);

    // Send immediately for important events
    const immediateEvents = ['session_start', 'session_end', 'chat_message_sent', 'error'];
    if (immediateEvents.includes(eventType)) {
      await flushEvents();
    }
  }

  async function flushEvents() {
    if (eventQueue.length === 0) return;

    const authToken = getToken();
    if (!authToken) return;

    const eventsToSend = eventQueue.splice(0, config.batchSize);
    
    try {
      // Cloud Functions URL pattern: baseUrl-function_name
      const endpoint = eventsToSend.length === 1 
        ? `${config.apiBaseUrl}-track_activity`
        : `${config.apiBaseUrl}-track_activity_batch`;

      const body = eventsToSend.length === 1 
        ? eventsToSend[0]
        : { events: eventsToSend };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        // Put events back in queue if failed
        eventQueue.unshift(...eventsToSend);
        log('Failed to send events:', response.status);
      } else {
        log('Sent', eventsToSend.length, 'events');
      }
    } catch (error) {
      // Put events back in queue if failed
      eventQueue.unshift(...eventsToSend);
      log('Error sending events:', error);
    }
  }

  // ============================================
  // Event Tracking Functions
  // ============================================

  function trackSessionStart() {
    sendEvent('session_start', {
      referrer: document.referrer,
      screen_width: window.screen.width,
      screen_height: window.screen.height,
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
      user_agent: navigator.userAgent,
      language: navigator.language,
    });
  }

  function trackSessionEnd() {
    const duration = Math.round((Date.now() - pageLoadTime) / 1000);
    sendEvent('session_end', {
      duration_seconds: duration,
      max_scroll_depth: scrollDepthMax,
    });
  }

  function trackPageView() {
    sendEvent('page_view', {
      page_title: document.title,
      page_path: window.location.pathname,
    });
  }

  function trackPageExit() {
    const duration = Math.round((Date.now() - pageLoadTime) / 1000);
    sendEvent('page_exit', {
      duration_seconds: duration,
      max_scroll_depth: scrollDepthMax,
    });
  }

  function trackButtonClick(element) {
    sendEvent('button_click', {
      button_id: element.id || null,
      button_text: element.textContent?.trim().substring(0, 100) || null,
      button_class: element.className || null,
    });
  }

  function trackLinkClick(element) {
    sendEvent('link_click', {
      link_url: element.href || null,
      link_text: element.textContent?.trim().substring(0, 100) || null,
      link_target: element.target || null,
    });
  }

  function trackScrollDepth(depth) {
    if (depth > scrollDepthMax) {
      scrollDepthMax = depth;
      // Only track at certain thresholds
      const thresholds = [25, 50, 75, 90, 100];
      if (thresholds.includes(Math.floor(depth))) {
        sendEvent('scroll_depth', {
          depth_percent: Math.floor(depth),
        });
      }
    }
  }

  // ============================================
  // Chat Widget Integration
  // ============================================

  function trackChatOpened() {
    sendEvent('chat_opened', {});
  }

  function trackChatClosed(durationSeconds) {
    sendEvent('chat_closed', {
      duration_seconds: durationSeconds,
    });
  }

  function trackChatMessageSent(messageText) {
    sendEvent('chat_message_sent', {
      message_text: messageText?.substring(0, 500) || null,
      message_length: messageText?.length || 0,
    });
  }

  function trackChatMessageReceived(messageText) {
    sendEvent('chat_message_received', {
      message_text: messageText?.substring(0, 500) || null,
      message_length: messageText?.length || 0,
    });
  }

  // ============================================
  // Event Listeners Setup
  // ============================================

  function setupClickTracking() {
    document.addEventListener('click', function(e) {
      const target = e.target.closest('button, a, [role="button"], .btn, [data-track]');
      if (!target) return;

      if (target.tagName === 'A') {
        trackLinkClick(target);
      } else {
        trackButtonClick(target);
      }
    }, true);
  }

  function setupScrollTracking() {
    let ticking = false;
    
    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const scrollPercent = (scrollTop / docHeight) * 100;
          trackScrollDepth(scrollPercent);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  function setupVisibilityTracking() {
    document.addEventListener('visibilitychange', function() {
      if (document.visibilityState === 'hidden') {
        trackPageExit();
        flushEvents();
      } else if (document.visibilityState === 'visible') {
        pageLoadTime = Date.now();
        trackPageView();
      }
    });
  }

  function setupBeforeUnloadTracking() {
    window.addEventListener('beforeunload', function() {
      trackSessionEnd();
      // Use sendBeacon for reliable delivery on page exit
      const authToken = getToken();
      if (authToken && eventQueue.length > 0) {
        const blob = new Blob([JSON.stringify({ events: eventQueue })], { type: 'application/json' });
        navigator.sendBeacon(`${config.apiBaseUrl}-track_activity_batch`, blob);
      }
    });
  }

  function setupChatwootIntegration() {
    // Listen for Chatwoot events
    let chatOpenTime = null;

    window.addEventListener('chatwoot:opened', function() {
      chatOpenTime = Date.now();
      trackChatOpened();
    });

    window.addEventListener('chatwoot:closed', function() {
      const duration = chatOpenTime ? Math.round((Date.now() - chatOpenTime) / 1000) : 0;
      trackChatClosed(duration);
      chatOpenTime = null;
    });

    // Hook into Chatwoot message events if available
    // This requires modifications to the Chatwoot widget or using MutationObserver
    setupChatwootMessageObserver();
  }

  function setupChatwootMessageObserver() {
    // Observe the Chatwoot widget for new messages
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check for user messages
            const userMessage = node.querySelector?.('.user-message, [class*="agent-message--user"]');
            if (userMessage) {
              trackChatMessageSent(userMessage.textContent);
            }
            // Check for bot messages
            const botMessage = node.querySelector?.('.agent-message:not([class*="user"]), [class*="agent-message--agent"]');
            if (botMessage) {
              trackChatMessageReceived(botMessage.textContent);
            }
          }
        });
      });
    });

    // Start observing when Chatwoot widget appears
    const checkForChatwoot = setInterval(function() {
      const chatwootWidget = document.querySelector('#chatwoot-widget, .woot-widget-holder');
      if (chatwootWidget) {
        observer.observe(chatwootWidget, { childList: true, subtree: true });
        clearInterval(checkForChatwoot);
        log('Chatwoot observer attached');
      }
    }, 1000);

    // Stop checking after 30 seconds
    setTimeout(() => clearInterval(checkForChatwoot), 30000);
  }

  function startBatchTimer() {
    if (batchTimer) clearInterval(batchTimer);
    batchTimer = setInterval(flushEvents, config.batchInterval);
  }

  // ============================================
  // Public API
  // ============================================

  function init(options = {}) {
    if (isInitialized) {
      log('Already initialized');
      return;
    }

    // Merge options with defaults
    config = { ...config, ...options };

    if (!config.apiBaseUrl) {
      console.error('[ActivityTracker] apiBaseUrl is required');
      return;
    }

    log('Initializing with config:', config);

    // Setup all tracking
    setupClickTracking();
    setupScrollTracking();
    setupVisibilityTracking();
    setupBeforeUnloadTracking();
    setupChatwootIntegration();
    startBatchTimer();

    // Track session start and initial page view
    trackSessionStart();
    trackPageView();

    isInitialized = true;
    log('Initialized successfully');
  }

  function setToken(newToken) {
    token = newToken;
    localStorage.setItem('automatia_token', newToken);
    log('Token set');
  }

  function setDemoId(demoId) {
    config.demoId = demoId;
    log('Demo ID set:', demoId);
  }

  function trackCustomEvent(eventName, data = {}) {
    sendEvent('custom', {
      custom_type: eventName,
      ...data,
    });
  }

  function trackError(errorMessage, errorStack = null) {
    sendEvent('error', {
      error_message: errorMessage?.substring(0, 500) || null,
      error_stack: errorStack?.substring(0, 1000) || null,
    });
  }

  // Expose public API
  return {
    init: init,
    setToken: setToken,
    setDemoId: setDemoId,
    trackCustomEvent: trackCustomEvent,
    trackError: trackError,
    trackChatMessageSent: trackChatMessageSent,
    trackChatMessageReceived: trackChatMessageReceived,
    trackButtonClick: function(buttonId, buttonText) {
      sendEvent('button_click', { button_id: buttonId, button_text: buttonText });
    },
    trackLinkClick: function(linkUrl, linkText) {
      sendEvent('link_click', { link_url: linkUrl, link_text: linkText });
    },
    trackDemoLaunched: function(demoId) {
      sendEvent('demo_launched', { demo_id: demoId });
    },
    flush: flushEvents,
  };
})();

// Auto-initialize if data attributes are present
document.addEventListener('DOMContentLoaded', function() {
  const script = document.querySelector('script[data-api-base-url]');
  if (script) {
    ActivityTracker.init({
      apiBaseUrl: script.dataset.apiBaseUrl,
      demoId: script.dataset.demoId || null,
      debug: script.dataset.debug === 'true',
    });
  }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ActivityTracker;
}
