(function () {
  var video = document.querySelector('[data-hero-video]');
  if (!video) return;

  video.addEventListener('playing', function () {
    video.classList.add('is-active');
  });

  var playPromise = video.play();
  if (playPromise && typeof playPromise.catch === 'function') {
    playPromise.catch(function () {
      /* 自動再生できない場合は地層フォールバックの表示を継続する */
    });
  }
})();
