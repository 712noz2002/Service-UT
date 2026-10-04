(function () {
  function markPhone() {
    var phone = window.matchMedia('(max-width: 700px)').matches ||
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;
    document.body.classList.toggle('is-phone', phone);
  }
  markPhone();
  addEventListener('resize', markPhone, {passive:true});
  addEventListener('orientationchange', markPhone, {passive:true});

  if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) {
    addEventListener('load', function () {
      navigator.serviceWorker.register('./sw.js?v=5', {updateViaCache:'none'})
        .then(function (r) { r.update().catch(function(){}); })
        .catch(function(){});
    });
  }
})();
