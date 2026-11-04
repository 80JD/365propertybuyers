/* Basic GA4 traffic measurement. No form contents or unrestricted URL parameters. */
(function () {
  'use strict';
  var id = 'G-272L723EYL';
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


/* Track accepted inquiries and phone taps, never seller field values. */
(function () {
  'use strict';
  if (window.__propertyBuyersLeadTrackingLoaded) return;
  window.__propertyBuyersLeadTrackingLoaded = true;
  var measurementId = 'G-272L723EYL';
  function track(name, parameters, done) {
    var finished = false;
    function finish() {
      if (finished) return;
      finished = true;
      if (done) done();
    }
    if (done) window.setTimeout(finish, 1000);
    if (typeof window.gtag !== 'function') { finish(); return; }
    parameters.send_to = measurementId;
    parameters.transport_type = 'beacon';
    if (done) { parameters.event_callback = finish; parameters.event_timeout = 900; }
    try { window.gtag('event', name, parameters); } catch (e) { finish(); }
  }
  document.addEventListener('click', function (event) {
    if (event.defaultPrevented || (event.button !== undefined && event.button !== 0)) return;
    var link = event.target.closest ? event.target.closest('a[href^="tel:"]') : null;
    if (!link) return;
    var area = link.closest('nav') ? 'navigation' : link.closest('footer') ? 'footer' : 'page';
    track('phone_click', {contact_method: 'phone', link_location: area});
  });

  if (!window.fetch || !window.FormData) return; // Preserve native form behavior on older browsers.
  Array.prototype.forEach.call(document.querySelectorAll('form'), function (form, index) {
    if (form.action !== 'https://formspree.io/f/xnjbqlkj' || form.method.toLowerCase() !== 'post') return;
    var busy = false;
    var completed = false;
    var formId = 'lead_form_' + (index + 1);
    form.addEventListener('submit', async function (event) {
      if (event.defaultPrevented) return;
      event.preventDefault();
      if (busy || completed) return;
      if (!form.reportValidity()) return;
      var data;
      try { data = new FormData(form); } catch (e) {
        // A submit event is not a lead; leave analytics silent on failure.
        return;
      }
      busy = true;
      var buttons = Array.prototype.map.call(form.querySelectorAll('button[type="submit"],input[type="submit"]'), function (button) {
        var state = {button:button, disabled:button.disabled};
        button.disabled = true;
        return state;
      });
      form.setAttribute('aria-busy', 'true');
      var status = form.querySelector('[data-lead-status]');
      if (!status) {
        status = document.createElement('p');
        status.setAttribute('data-lead-status', '');
        status.setAttribute('role', 'status');
        status.setAttribute('aria-live', 'polite');
        status.style.marginTop = '12px';
        form.appendChild(status);
      }
      status.textContent = 'Sending your inquiry…';
      var response;
      try {
        response = await fetch(form.action, {method:'POST', body:data, headers:{Accept:'application/json'}});
      } catch (e) {
        status.textContent = 'We could not confirm your inquiry was received. Please check your connection or call (501) 365-1499.';
      }
      if (response && response.ok) {
        completed = true;
        status.textContent = 'Thank you—your inquiry has been received.';
        var destination = '/thank-you.html';
        var next = form.querySelector('input[name="_next"]');
        try {
          var nextUrl = new URL(next ? next.value : destination, window.location.origin);
          if (nextUrl.origin === window.location.origin) destination = nextUrl.pathname;
        } catch (e) { /* Use the existing thank-you page. */ }
        track('generate_lead', {lead_type:'property_inquiry', form_id:formId, submission_method:'formspree'}, function () {
          window.location.assign(destination);
        });
        return;
      }
      if (response) {
        status.textContent = response.status === 429
          ? 'Too many inquiries were sent at once. Please wait a minute and try again, or call (501) 365-1499.'
          : 'Your inquiry was not accepted. Please check the form and try again, or call (501) 365-1499.';
      }
      busy = false;
      form.removeAttribute('aria-busy');
      buttons.forEach(function (state) { state.button.disabled = state.disabled; });
    });
  });
}());
