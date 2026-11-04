/* Basic GA4 traffic measurement. No form contents or unrestricted URL parameters. */
(function () {
  'use strict';
  var id = 'G-272L723EYL';
  window['ga-disable-' + id] = false;
  try {
    if (localStorage.getItem('365pb_analytics_disabled') === 'true') {
      window['ga-disable-' + id] = true;
      return;
    }
  } catch (e) { /* Measurement still works when storage is unavailable. */ }
  if (navigator.doNotTrack === '1' || window.doNotTrack === '1') return;
  if (window.__propertyBuyersAnalyticsLoaded) return;
  window.__propertyBuyersAnalyticsLoaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  var locationUrl = new URL(window.location.href);
  var cleanUrl = new URL(locationUrl.origin + locationUrl.pathname);
  ['utm_source', 'utm_medium', 'utm_campaign'].forEach(function (key) {
    var value = locationUrl.searchParams.get(key);
    if (value && /^[a-zA-Z0-9_-]{1,80}$/.test(value)) cleanUrl.searchParams.set(key, value);
  });
  var referrer = '';
  try {
    var referringUrl = new URL(document.referrer);
    referrer = referringUrl.origin + referringUrl.pathname;
  } catch (e) { /* Direct visits have no referrer. */ }
  window.gtag('js', new Date());
  window.gtag('config', id, {
    page_location: cleanUrl.href,
    page_referrer: referrer,
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });
  var tag = document.createElement('script');
  tag.async = true;
  tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
  document.head.appendChild(tag);
}());
