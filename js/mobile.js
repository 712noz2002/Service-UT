(function () {
  function isPhoneLike() {
    return window.matchMedia('(max-width: 700px)').matches ||
      window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: fullscreen)').matches ||
      window.navigator.standalone === true;
  }

  function applyViewport() {
    var phone = isPhoneLike();
    document.body.classList.toggle('is-phone', phone);
    if (!phone) return;

    var vv = window.visualViewport;
    var w = vv ? vv.width : window.innerWidth;
    var h = vv ? vv.height : window.innerHeight;
    document.documentElement.style.setProperty('--app-vw', Math.round(w * 100) / 100 + 'px');
    document.documentElement.style.setProperty('--app-vh', Math.round(h * 100) / 100 + 'px');
  }

  applyViewport();
  addEventListener('resize', applyViewport, {passive:true});
  addEventListener('orientationchange', applyViewport, {passive:true});
  if (window.visualViewport) {
    visualViewport.addEventListener('resize', applyViewport, {passive:true});
  }

  if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) {
    addEventListener('load', function () {
      navigator.serviceWorker.register('./sw.js?v=6', {updateViaCache:'none'})
        .then(function (r) { r.update().catch(function(){}); })
        .catch(function(){});
    });
  }
})();
