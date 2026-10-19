(() => {
  if (!document.getElementById('home')) return;
  function topOfHome() {
    document.querySelector('nav')?.classList.remove('open');
    document.querySelector('.menu-toggle')?.setAttribute('aria-expanded', 'false');
    window.scrollTo({top: 0, left: 0, behavior: 'instant'});
  }
  function settleAtHome() {
    if (location.hash !== '#home') return;
    topOfHome();
    requestAnimationFrame(() => requestAnimationFrame(topOfHome));
  }
  document.querySelectorAll('a[href="#home"]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      history.scrollRestoration = 'manual';
      if (location.hash !== '#home') history.pushState(null, '', '#home');
      if (link.matches('header > a.wordmark')) window.replaySoulTimeOpening?.();
      else window.finishSoulTimeOpening?.();
      settleAtHome();
    });
  });
  ['hashchange', 'pageshow', 'load'].forEach(event => window.addEventListener(event, settleAtHome));
  settleAtHome();
})();
