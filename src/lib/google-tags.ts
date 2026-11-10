export const GOOGLE_ADS_ID = "AW-18548302229";
export const WHATSAPP_CONVERSION_DESTINATION =
  "AW-18548302229/lW0OCPrd268dEJXDwoxF";
export const ADSENSE_CLIENT = "ca-pub-7804080664715961";
export const ADSENSE_SCRIPT_URL = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;

// Run after hydration; keep Next's data-nscript attribute off Google's own tag.
export const ADSENSE_BOOTSTRAP = `
(function () {
  var src = '${ADSENSE_SCRIPT_URL}';
  if (document.querySelector('script[src="' + src + '"]')) return;
  var script = document.createElement('script');
  script.async = true;
  script.src = src;
  script.crossOrigin = 'anonymous';
  document.head.appendChild(script);
})();
`;

declare global {
  interface Window {
    __valcronTrackWhatsApp?: (href: string) => void;
  }
}

/** Forms opening WhatsApp programmatically use the same deduplication as links. */
export function trackWhatsAppNavigation(href: string) {
  if (typeof window !== "undefined") window.__valcronTrackWhatsApp?.(href);
}

// Runs in the head before hydration so early clicks can queue their conversion.
// Root-layout persistence and the guard keep a single listener across SPA routes.
export const GOOGLE_TAG_BOOTSTRAP = `
(function () {
  if (window.__valcronGoogleTagInitialized) return;
  window.__valcronGoogleTagInitialized = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', '${GOOGLE_ADS_ID}');

  var trackedLinks = new Set();
  function trackWhatsAppUrl(href) {
    var url;
    try { url = new URL(href, window.location.href); } catch (_) { return; }
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return;
    if (url.hostname !== 'wa.me' && url.hostname !== 'www.wa.me' && url.hostname !== 'api.whatsapp.com') return;
    var key = JSON.stringify([window.location.pathname, window.location.search, url.href]);
    if (trackedLinks.has(key)) return;
    trackedLinks.add(key);
    window.gtag('event', 'conversion', { send_to: '${WHATSAPP_CONVERSION_DESTINATION}' });
  }
  window.__valcronTrackWhatsApp = trackWhatsAppUrl;
  function trackWhatsApp(event) {
    if (event.type === 'auxclick' && event.button !== 1) return;
    var target = event.target;
    var element = target && (target.nodeType === 1 ? target : target.parentElement);
    var link = element && element.closest ? element.closest('a[href]') : null;
    if (link) trackWhatsAppUrl(link.href);
  }
  document.addEventListener('click', trackWhatsApp, { capture: true, passive: true });
  document.addEventListener('auxclick', trackWhatsApp, { capture: true, passive: true });
})();
`;
