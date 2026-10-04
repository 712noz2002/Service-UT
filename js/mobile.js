(function () {
  var DESIGN_WIDTH = 375;

  function isPhoneViewport() {
    return window.matchMedia('(max-width: 700px)').matches ||
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;
  }

  function fit() {
    var phone = isPhoneViewport();
    document.body.classList.toggle('is-phone', phone);
    if (!phone) {
      document.documentElement.style.removeProperty('--app-scale');
      document.documentElement.style.setProperty('--screen-h', '781px');
      return;
    }

    var viewportWidth = Math.max(280, window.innerWidth || DESIGN_WIDTH);
    var viewportHeight = Math.max(480, window.innerHeight || 781);
    var scale = viewportWidth / DESIGN_WIDTH;
    var logicalHeight = viewportHeight / scale;

    document.documentElement.style.setProperty('--app-scale', String(scale));
    document.documentElement.style.setProperty('--screen-h', logicalHeight.toFixed(2) + 'px');
  }

  fit();
  window.addEventListener('resize', fit, { passive: true });
  window.addEventListener('orientationchange', fit, { passive: true });
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', fit, { passive: true });
  }

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('./sw.js').catch(function () {});
    });
  }
})();
