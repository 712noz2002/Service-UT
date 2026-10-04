(function () {
  var DESIGN_WIDTH = 375;
  function isPhone() {
    return window.matchMedia('(max-width: 700px)').matches ||
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;
  }
  function fit() {
    var phone = isPhone();
    document.body.classList.toggle('is-phone', phone);
    if (!phone) {
      document.documentElement.style.removeProperty('--app-scale');
      document.documentElement.style.setProperty('--screen-h', '781px');
      return;
    }
    var w = Math.max(280, document.documentElement.clientWidth || window.innerWidth || DESIGN_WIDTH);
    var h = Math.max(480, window.visualViewport ? window.visualViewport.height : (window.innerHeight || 781));
    var scale = w / DESIGN_WIDTH;
    document.documentElement.style.setProperty('--app-scale', String(scale));
    document.documentElement.style.setProperty('--screen-h', (h / scale).toFixed(3) + 'px');
  }
  fit();
  addEventListener('resize', fit, {passive:true});
  addEventListener('orientationchange', fit, {passive:true});
  if (window.visualViewport) window.visualViewport.addEventListener('resize', fit, {passive:true});

  if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) {
    addEventListener('load', function () {
      navigator.serviceWorker.register('./sw.js?v=4', {updateViaCache:'none'}).then(function (r) {
        r.update().catch(function(){});
      }).catch(function(){});
    });
  }
})();
