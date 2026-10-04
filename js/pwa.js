/* 안심ON PWA bootstrap — ignored automatically on file:// */
(function () {
  if (!("serviceWorker" in navigator)) return;
  if (location.protocol !== "https:" && location.hostname !== "localhost" && location.hostname !== "127.0.0.1") return;

  window.addEventListener("load", function () {
    navigator.serviceWorker.register("./sw.js", { scope: "./" }).catch(function (err) {
      console.warn("안심ON service worker registration failed:", err);
    });
  });
})();
